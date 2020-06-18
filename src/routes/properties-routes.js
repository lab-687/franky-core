const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/properties-controller');
const usersController = require('../controllers/users-controller');

router.get('/', usersController.verifyLogin, propertiesController.listProperties);

router.post('/', usersController.verifyLogin, propertiesController.createProperty);

router.delete('/:id', usersController.verifyLogin, propertiesController.deleteProperty);

module.exports = router;
