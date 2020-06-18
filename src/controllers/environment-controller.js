const environmentRepository = require('../repositories/environment-repository');
const tokenRepository = require('../repositories/token-repository');

exports.showEnvironment = async (req, res) => {
  try {
    const data = await environmentRepository.show(null,null);
    if(data.length === 0) {
      return res.status(500).send({message: 'You need to create an Environment, unless your Franky core will not work.'});
    } else {
     return res.status(200).send(data[0]);
    }

  } catch (e) {
    return res.status(500).send({message: 'Failed on show environment settings'});
  }

};

exports.createEnvironment = async (req, res) => {
  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);
  if(verify.role !== 'admin') return res.status(403).send({message: "You don't have access for this."});

  if(req.body.usersTypeAllowed !== "both" && req.body.usersTypeAllowed != "anon" && req.body.usersTypeAllowed != "public") return res.status(500).send({message: "Invalid value for usersTypeAllowed"});

  if(!req.body.hasGroups) req.body.canUsersMakeGroups = false;

  if(!req.body.hasEvents) req.body.canUsersMakeEvents = false;

  const data = await environmentRepository.show(null,null);
  if(data.length === 0) {
      try {
        await environmentRepository.create({
          slug: req.body.slug,
          usersTypeAllowed: req.body.usersTypeAllowed,
          canUsersMakeStories: req.body.canUsersMakeStories,
          canUsersMakeGroups: req.body.canUsersMakeGroups,
          hasGroups: req.body.hasGroups,
          hasCategories: req.body.hasCategories,
          hasEvents: req.body.hasEvents,
          canUsersMakeEvents: req.body.canUsersMakeEvents
        });
        return res.status(201).send({message: 'Environment created'});
      } catch (e) {
        return res.status(500).send({message: 'Failed on create environment settings'});
      }
  } else {
    return res.status(500).send({message: 'You already create your Environment, use the update route instead.'});
  }

};

exports.updateEnvironment = async (req, res) => {
  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);
  if(verify.role !== 'admin') return res.status(403).send({message: "You don't have access for this."});

  if(req.body.usersTypeAllowed !== "both" && req.body.usersTypeAllowed != "anon" && req.body.usersTypeAllowed != "public") return res.status(500).send({message: "Invalid value for usersTypeAllowed"});

  const data = await environmentRepository.show(null,null);
  if(data.length === 0) {
    return res.status(500).send({message: 'Your Environment doesnt exist, use the create route instead.'});
  } else {
      try {
        await environmentRepository.update(data[0].id, req.body);
        return res.status(200).send({message: 'Environment updated'});
      } catch (e) {
        return res.status(500).send({message: 'Failed on update environment settings'});
      }
  }
};
