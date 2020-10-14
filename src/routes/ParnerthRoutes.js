import { Router } from 'express';
import { userAccess } from '../middlewares';

// import all controllers
import ParnerthController from '../controller/ParnerthController';

const routes = new Router();

// Add routes
routes.get('/', ParnerthController.index);
routes.get('/:group_id', ParnerthController.show);
routes.post('/:key', [userAccess], ParnerthController.storeUser);
routes.post('/:group_id/:key', [userAccess], ParnerthController.storeGroup);
routes.delete('/:key', [userAccess], ParnerthController.destroy);
routes.delete('/:group_id/:key', [userAccess], ParnerthController.destroyOfGroup);

module.exports = routes;
