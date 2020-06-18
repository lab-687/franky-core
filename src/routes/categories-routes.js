const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories-controller');
const usersController = require('../controllers/users-controller');

router.get('/', usersController.verifyLogin, categoriesController.listCategories);

router.post('/', usersController.verifyLogin, categoriesController.createCategory);

router.delete('/:id', usersController.verifyLogin, categoriesController.deleteCategory);

module.exports = router;
