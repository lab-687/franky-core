const userRepository = require('../repositories/users-repository');
const tokenRepository = require('../repositories/token-repository');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.listUsers = async (req, res) => {
  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);
  if(verify.role !== 'admin') return res.status(403).send({message: "You don't have access for this."});

  try {
    const data = await userRepository.list(null,'username email type role');
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({message: 'Failed on list users'});
  }
};

exports.createUser = async (req, res) => {
  const {errors} = validationResult(req);
  var salt = req.body.level;
  if(!salt) salt = 10;

  if(errors.length > 0) {
    return res.status(400).send({errors});
  } else if(req.body.type !== 'public') {
    if(req.body.type !== 'anon') {
      return res.status(400).send({message: 'The type needs to be "anon" or "public" '});
    }
  } else if(req.body.role === 'admin') {
    const token = req.headers.authorization;
    const verify = await tokenRepository.verify(token);
    if(verify.role !== 'admin') return res.status(403).send({message: "You don't have access for this."});
  }

  console.log(req.body.password);

  bcrypt.hash(req.body.password, salt, async (err, encrypted) => {
    req.body.password = encrypted;
    console.log(req.body.password);

    try {
      await userRepository.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        type: req.body.type,
        role: req.body.role
      });
      return res.status(201).send({message: 'User created'});
    } catch (e) {
      return res.status(500).send({message: 'Failed on create user'});
    }
  });

};

exports.updateUser = async (req, res) => {
  const {errors} = validationResult(req);

  if(errors.length > 0) {
    return res.status(400).send({errors});
  } else if(req.body.type !== 'public') {
    if(req.body.type !== 'anon') {
      return res.status(400).send({message: 'The type needs to be "anon" or "public" '});
    }
  }

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);
  if(req.body.role !== verify.role) {
    if(verify.role !== 'admin') {
        return res.status(403).send({message: "You don't have access for this."});
    }
  }

  try {
    await userRepository.update(req.params.id, req.body);
    return res.status(200).send({message: 'User updated'});
  } catch (e) {
    return res.status(500).send({message: 'Failed on update user'});
  }
};

exports.deleteUser = async (req, res) => {
  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);
  if(verify.role !== 'admin') return res.status(403).send({message: "You don't have access for this."});

  try {
    await userRepository.delete(req.params.id);
    return res.status(200).send({message: 'User deleted'});
  } catch (e) {
    return res.status(500).send({message: 'Failed on delete user'});
  }
};

exports.loginUser = async (req, res) => {
  const {errors} = validationResult(req);

  if(errors.length > 0) {
    return res.status(400).send({errors});
  } else if(!req.body.username && !req.body.email) {
    return res.status(400).send({message: 'You need to send an username or email.'});
  } else if(!req.body.password) {
    return res.status(400).send({message: 'You need to send a password.'});
  }

  var user;

  if(req.body.email) {
      user = await userRepository.list({email: req.body.email}, 'password role');
  } else {
      user = await userRepository.list({username: req.body.username}, 'password role');
  }

  if(user.length === 0) return res.status(500).send({message: 'Failed on login'});

  bcrypt.compare(req.body.password, user[0].password, async (err, result) => {
    if(result) {
      try {
        const data = await tokenRepository.create(user[0]._id, user[0].role);
        return res.status(200).send(data);
      } catch (e) {
        return res.status(500).send({message: 'Failed on login'});
      }
    } else {
      return res.status(500).send({message: 'Wrong password'});
    }
  });

};

exports.verifyLogin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send({message: 'No token provided.' });

  const verify = await tokenRepository.verify(token);
  if(verify.auth) {
      next();
  } else {
    return res.status(500).send({message: 'Invalid token.'})
  }
};
