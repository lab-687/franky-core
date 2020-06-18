const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const groupsController = require('../controllers/groups-controller');
const usersController = require('../controllers/users-controller');

router.get('/', usersController.verifyLogin, groupsController.listGroups);

router.get('/:id', usersController.verifyLogin, groupsController.GroupDetails);

router.post('/', usersController.verifyLogin, groupsController.createGroup);

router.put('/:id', usersController.verifyLogin, groupsController.updateGroup);

router.delete('/:id',  usersController.verifyLogin, groupsController.deleteGroup);

module.exports = router;
