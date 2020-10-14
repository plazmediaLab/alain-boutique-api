import { Router } from 'express';

// import all controllers
import SummaryController from '../controller/SummaryController';

const routes = new Router();

/**
 *
 * @method Index
 */
routes.get(
  '/',
  [
    /* Middlewares */
  ],
  SummaryController.index
);

module.exports = routes;
