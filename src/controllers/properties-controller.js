const environmentRepository = require('../repositories/environment-repository');
const propertiesRepository = require('../repositories/properties-repository');
const tokenRepository = require('../repositories/token-repository');

exports.listProperties = async (req, res) => {
  const data = await environmentRepository.show(null,null);

  if(data[0].usersTypeAllowed !== "both" && data[0].usersTypeAllowed != "public") return res.status(500).send({message: "Your usersTypeAllowed do not alow properties"});

  try {

    const data = await propertiesRepository.list(null,'type expressionValidate');
     return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({message: 'Failed on list properties'});
  }

};

exports.createProperty = async (req, res) => {
  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);
  if(verify.role !== 'admin') return res.status(403).send({message: "You don't have access for this."});

  const data = await environmentRepository.show(null,null);

  if(data[0].usersTypeAllowed !== "both" && data[0].usersTypeAllowed != "public") return res.status(500).send({message: "Your usersTypeAllowed do not alow properties"});

      try {
        await propertiesRepository.create({
          type: req.body.type,
          expressionValidate: req.body.expressionValidate
        });

        return res.status(201).send({message: 'Property created'});
      } catch (e) {
        return res.status(500).send({message: 'Failed on create property'});
      }

};

exports.deleteProperty = async (req, res) => {
  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);
  if(verify.role !== 'admin') return res.status(403).send({message: "You don't have access for this."});

  const data = await environmentRepository.show(null,null);

  if(data[0].usersTypeAllowed !== "both" && data[0].usersTypeAllowed != "public") return res.status(500).send({message: "Your usersTypeAllowed do not alow properties"});

      try {
        await propertiesRepository.delete(req.params.id);
        return res.status(200).send({message: 'Property deleted'});
      } catch (e) {
        return res.status(500).send({message: 'Failed on delete property'});
      }
};
