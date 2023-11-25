var express = require('express');
var router = express.Router();

var todoController = require('./../controllers/todos');
var subTodoController = require('./../controllers/subtodos');
var authController = require('./../controllers/auth.js');


router.post('/todos', todoController.insert);
router.delete('/todos/:todosId', todoController.delete);
router.put('/todos/:todosId', todoController.update);

router.post('/subtodos/:todosId', subTodoController.insert);
router.delete('/subtodos/:subtodosId', subTodoController.delete);
router.put('/subtodos/:subtodosId', subTodoController.update);

router.post('/',authController.login);



module.exports = router;
