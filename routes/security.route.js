var express = require('express');
var securityRouter = express.Router();
const securityController = require('../controler/security_controller')

/* GET home page. */

securityRouter.post('/register', securityController.register);
securityRouter.post('/login', securityController.login);
securityRouter.post('/logout', securityController.logout);



module.exports = securityRouter;
