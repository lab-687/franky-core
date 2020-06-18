const express = require('express');
const router = express.Router();
const profilesController = require('../controllers/profiles-controller');
const usersController = require('../controllers/users-controller');

router.get('/', usersController.verifyLogin, profilesController.showProfile);

router.post('/', usersController.verifyLogin, profilesController.verifyProperties, profilesController.createProfile);

router.put('/', usersController.verifyLogin, profilesController.verifyProperties, profilesController.updateProfile);

module.exports = router;
