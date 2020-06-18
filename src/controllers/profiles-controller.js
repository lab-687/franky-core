const profilesRepository = require('../repositories/profiles-repository');
const environmentRepository = require('../repositories/environment-repository');
const tokenRepository = require('../repositories/token-repository');
const propertiesRepository = require('../repositories/properties-repository');

exports.showProfile = async (req, res) => {
  var data = await environmentRepository.show(null,null);

  if(data[0].usersTypeAllowed !== "both" && data[0].usersTypeAllowed != "public") return res.status(500).send({message: "Your usersTypeAllowed do not alow properties"});

  try {
    const token = req.headers.authorization;
    const verify = await tokenRepository.verify(token);

    data = await profilesRepository.show({userId: verify.id},null);
    if(data.length === 0) {
      return res.status(500).send({message: 'You need to create a Profile.'});
    } else {
     return res.status(200).send(data[0]);
    }

  } catch (e) {
    return res.status(500).send({message: 'Failed on show user profile'});
  }
};

exports.createProfile = async (req, res) => {
  var data = await environmentRepository.show(null,null);

  if(data[0].usersTypeAllowed !== "both" && data[0].usersTypeAllowed != "public") return res.status(500).send({message: "Your usersTypeAllowed do not alow properties"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  data = await profilesRepository.show({userId: verify.id},null);

  if(data.length === 0) {
      try {
        await profilesRepository.create({
          name: req.body.name,
          userId: verify.id,
          profilePicture: req.body.profilePicture,
          userProperties: req.body.userProperties,
          userGroups: req.body.userGroups,
          userEvents: req.body.userEvents
        });
        return res.status(201).send({message: 'Profile created'});
      } catch (e) {
        return res.status(500).send({message: 'Failed on create profile'});
      }
  } else {
    return res.status(500).send({message: 'You already create your Profile, use the update route instead.'});
  }

};

exports.updateProfile = async (req, res) => {
  var data = await environmentRepository.show(null,null);

  if(data[0].usersTypeAllowed !== "both" && data[0].usersTypeAllowed != "public") return res.status(500).send({message: "Your usersTypeAllowed do not alow properties"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  data = await profilesRepository.show({userId: verify.id},null);
  if(data.length === 0) {
    return res.status(500).send({message: 'Your Profile doesnt exist, use the create route instead.'});
  } else {
      try {
        await profilesRepository.update(data[0].id, req.body);
        return res.status(200).send({message: 'Profile updated'});
      } catch (e) {
        return res.status(500).send({message: 'Failed on update profile'});
      }
  }
};

exports.verifyProperties = async (req, res, next) => {
  var propertiesOkay = true;

  const promises = req.body.userProperties.map(async (property) => {
    var data = await propertiesRepository.list({type: property.type}, null);
    if(data.length === 0) {
      propertiesOkay = false;
      return res.status(500).send({message: 'You are trying to send an invalid property.'});
    }
  });

  await Promise.all(promises);

  if(propertiesOkay) next();
};
