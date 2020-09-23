import { Router } from 'express';
import { decodedToken } from '../middlewares';

// import all controllers
import GroupController from '../controller/GroupController';

const routes = new Router();

// Add routes
routes.get('/', GroupController.index);
routes.get('/:id', GroupController.show);
routes.post('/', GroupController.store);
routes.put('/:id', GroupController.update);
routes.delete('/:id', GroupController.destroy);

module.exports = routes;
