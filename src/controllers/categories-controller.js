const environmentRepository = require('../repositories/environment-repository');
const categoriesRepository = require('../repositories/categories-repository');
const tokenRepository = require('../repositories/token-repository');

exports.listCategories = async (req, res) => {
  const data = await environmentRepository.show(null,null);

  if(!data[0].hasCategories) return res.status(500).send({message: "Your environment do not alow categories"});

  try {

    const data = await categoriesRepository.list(null,'name');
     return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({message: 'Failed on list categories'});
  }

};

exports.createCategory = async (req, res) => {
  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);
  if(verify.role !== 'admin') return res.status(403).send({message: "You don't have access for this."});

  const data = await environmentRepository.show(null,null);

  if(!data[0].hasCategories) return res.status(500).send({message: "Your environment do not alow categories"});

      try {
        await categoriesRepository.create({
          name: req.body.name
        });

        return res.status(201).send({message: 'Category created'});
      } catch (e) {
        return res.status(500).send({message: 'Failed on create category'});
      }

};

exports.deleteCategory = async (req, res) => {
  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);
  if(verify.role !== 'admin') return res.status(403).send({message: "You don't have access for this."});

  const data = await environmentRepository.show(null,null);

  if(!data[0].hasCategories) return res.status(500).send({message: "Your environment do not alow categories"});

      try {
        await categoriesRepository.delete(req.params.id);
        return res.status(200).send({message: 'Category deleted'});
      } catch (e) {
        return res.status(500).send({message: 'Failed on delete category'});
      }
};
