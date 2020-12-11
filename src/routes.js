const express = require('express');

const UserController = require('./app/controllers/userController');
const SessionController = require('./app/controllers/sessionController');
const authMiddleware = require('./app/middlewares/auth');

const routes = express.Router();

routes.get('/users', UserController.list);
routes.post('/session', SessionController.authenticate);
routes.post('/users', UserController.register);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

module.exports = routes;
