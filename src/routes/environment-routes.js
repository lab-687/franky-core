const express = require('express');
const router = express.Router();
const environmentController = require('../controllers/environment-controller');
const usersController = require('../controllers/users-controller');

router.get('/', usersController.verifyLogin, environmentController.showEnvironment);

router.post('/', usersController.verifyLogin, environmentController.createEnvironment);

router.put('/', usersController.verifyLogin, environmentController.updateEnvironment);

module.exports = router;
