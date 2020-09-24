import { Router } from 'express';

// import all controllers
import ProductController from '../controller/ProductController';

const routes = new Router();

// Add routes
routes.get('/', ProductController.index);
routes.get('/:id', ProductController.show);
routes.post('/', ProductController.store);
routes.put('/:id', ProductController.update);
routes.delete('/:id', ProductController.destroy);

module.exports = routes;
