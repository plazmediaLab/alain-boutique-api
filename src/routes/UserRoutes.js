import { Router } from 'express';

import UserController from '../controller/UserController';

const routes = new Router();

// Add routes
routes.post('/signup', UserController.signup);
routes.post('/login', UserController.login);
routes.post('/auth', UserController.auth);

module.exports = routes;
