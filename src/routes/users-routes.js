const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const usersController = require('../controllers/users-controller');

router.get('/', usersController.verifyLogin, usersController.listUsers);

router.post('/', [
  check('username').isLength({min: 7}).withMessage("Username need at least 7 characters."),
] , usersController.createUser);

router.put('/:id', [
  check('username').isLength({min: 7}).withMessage("Username need at least 7 characters."),
] ,  usersController.verifyLogin, usersController.updateUser);

router.delete('/:id',  usersController.verifyLogin, usersController.deleteUser);

router.post('/login', usersController.loginUser);

module.exports = router;
