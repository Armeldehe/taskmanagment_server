var express = require('express');
var taskRouter = express.Router();
const taskController = require('../controler/task.controller')
const authenticate = require('../middlewares/authentication')

// taskRouter.use(authenticate)
taskRouter.get('/tasks/:userId', authenticate, taskController.getTasks);
taskRouter.post('/tasks', authenticate, taskController.postTask);
taskRouter.delete('/tasks/:taskId',authenticate, taskController.deleteOneTask);
taskRouter.put('/tasks/:taskId', authenticate, taskController.putTask);
taskRouter.post('/delete-many', authenticate, taskController.deleteManyTask);

module.exports = taskRouter;
