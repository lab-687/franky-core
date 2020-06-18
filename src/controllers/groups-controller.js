const groupsRepository = require('../repositories/groups-repository');
const tokenRepository = require('../repositories/token-repository');
const environmentRepository = require('../repositories/environment-repository');
const categoriesRepository = require('../repositories/categories-repository');
const usersRepository = require('../repositories/users-repository');


exports.listGroups = async (req, res) => {
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  try {
    if(verify.role === 'admin') {
      data = await groupsRepository.list(null,null);
      return res.status(200).send(data);
    } else {
      data = await groupsRepository.list({type: 'public'},'name description participants');
      return res.status(200).send(data);
    }
  } catch (e) {
    return res.status(500).send({message: 'error on list all groups'});
  }


};

exports.GroupDetails = async (req, res) => {
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  try {
    if(verify.role === 'admin') {
      data = await groupsRepository.list({_id: req.params.id},null);
      return res.status(200).send(data[0]);
    } else {
      data = await groupsRepository.list({_id: req.params.id}, null);
      var foundUser = false;
      var promises = data[0].participants.map(async (participant) => {
        if(participant.userId === verify.id) foundUser = true;
      });
      await Promise.all(promises);
      if(foundUser) {
        return res.status(200).send(data[0]);
      } else {
        return res.status(500).send({message: 'You need to be a participant to see the details of this group'});
      }
    }
  } catch(e) {
      return res.status(500).send({message: 'Failed on get group details'});
  }

};

exports.createGroup = async (req, res) => {
  var error = false;
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  if(verify.role === 'user' && !data[0].canUsersMakeGroups) return res.status(403).send({message: 'You cant create the group'});

  if(req.body.type !== 'public' && req.body.type !== 'private') return res.status(500).send({message: 'Group type invalid'});

  if(req.body.participants.length === 0) {
    req.body.participants.push({role: 'leader', userId: verify.id});
  } else {
    var creatorAlreadyIn = false;
    var promises = req.body.participants.map(async (participant) => {
      try {
        var userExists = await usersRepository.list({_id: participant.id}, null);
      } catch (e) {
        error = true;
        return res.status(500).send({message: 'You are trying to send and invalid user has a participant'});
      }


      if(userExists.length === 0) {
        error = true;
        return res.status(500).send({message: 'You are trying to send and invalid user has a participant'});
      }
      if(userExists[0].id === verify.id) {
        error = true;
        creatorAlreadyIn = true;
        return res.status(500).send({message: 'Dont pass you user as a participant. You will be insert automatically'});
      }
    });
    await Promise.all(promises);
    if(!creatorAlreadyIn) req.body.participants.push({role: 'leader', userId: verify.id});
  }

  if(!data[0].hasCategories) {
    req.body.categories = null;
  } else {
    if(req.body.categories.length > 0) {
       promises = req.body.categories.map(async (category) => {
        var categoryExists = await categoriesRepository.list({name: category}, null);
        if(categoryExists.length === 0) {
          error = true;
          return res.status(500).send({message: 'You are trying to send an invalid category.'});
        }
      });
      await Promise.all(promises);
    }
  }

  if(!data[0].hasEvents) {
    req.body.events = null;
  } else {
    //do it later, when events model is ready!
  }
  if(!error) {
    try {
      await groupsRepository.create({
        name: req.body.name,
        description: req.body.description,
        stories: req.body.stories,
        categories: req.body.categories,
        participants: req.body.participants,
        events: req.body.events,
        type: req.body.type
      });
      return res.status(201).send({message: 'Group created.'});
    } catch (e) {
      return res.status(500).send({message: 'Failed on create group'});
    }
  }

};

exports.updateGroup = async (req, res) => {
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  try {
    if(verify.role === 'admin') {
      data = await groupsRepository.update(req.params.id,null);
      return res.status(200).send(data[0]);
    } else {
      data = await groupsRepository.list({_id: req.params.id}, null);
      var foundUser = false;
      var promises = data[0].participants.map(async (participant) => {
        if(participant.userId === verify.id) foundUser = true;
      });
      await Promise.all(promises);
      if(foundUser) {
        return res.status(200).send(data[0]);
      } else {
        return res.status(500).send({message: 'You need to be a participant to see the details of this group'});
      }
    }
  } catch(e) {
      return res.status(500).send({message: 'Failed on get group details'});
  }
};

exports.deleteGroup = async (req, res) => {
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});
};
