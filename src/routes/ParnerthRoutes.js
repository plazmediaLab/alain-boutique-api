import { Router } from 'express';
import { userAccess } from '../middlewares';

// import all controllers
import ParnerthController from '../controller/ParnerthController';

const routes = new Router();

// Add routes
routes.get('/', ParnerthController.index);
routes.get('/:key', ParnerthController.show);
routes.post('/', [userAccess], ParnerthController.store);
routes.put('/:key', [userAccess], ParnerthController.update);
routes.delete('/:key', [userAccess], ParnerthController.destroy);

module.exports = routes;