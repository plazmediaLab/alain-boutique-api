import { Router } from 'express';
import { IDLengthVerify } from '../middlewares';

// import all controllers
import GroupController from '../controller/GroupController';

const routes = new Router();

// Add routes
routes.get('/', GroupController.index);
routes.get('/:id', [IDLengthVerify], GroupController.show);
routes.post('/', GroupController.store);
routes.put('/:id', [IDLengthVerify], GroupController.update);
routes.delete('/:id', [IDLengthVerify], GroupController.destroy);

module.exports = routes;
