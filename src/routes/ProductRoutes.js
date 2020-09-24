import { Router } from 'express';
import { IDLengthVerify } from '../middlewares';

// import all controllers
import ProductController from '../controller/ProductController';

const routes = new Router();

// Add routes
routes.get('/', ProductController.index);
routes.get('/:id', [IDLengthVerify], ProductController.show);
routes.post('/', ProductController.store);
routes.put('/:id', [IDLengthVerify], ProductController.update);
routes.delete('/:id', [IDLengthVerify], ProductController.destroy);

module.exports = routes;
