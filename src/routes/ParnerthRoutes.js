import { Router } from 'express';
import { userAccess } from '../middlewares';

// import all controllers
import ParnerthController from '../controller/ParnerthController';

const routes = new Router();

// Add routes
routes.get('/', ParnerthController.index);
routes.get('/:group_id', ParnerthController.show);
routes.post('/', [userAccess], ParnerthController.store);
routes.delete('/:group_id/:key', [userAccess], ParnerthController.destroy);

module.exports = routes;