var express = require('express');
var router = express.Router();

var todoController = require('./../controllers/todos');
var subTodoController = require('./../controllers/subtodos');
var authController = require('./../controllers/auth.js');
var authMiddleware = require('./../middlewares/auth.js');

router.get('/todos', authMiddleware.mustLogin, todoController.show);

router.get('/', authController.renderLogin);





module.exports = router;
