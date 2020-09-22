import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import pkg from '../package.json';
import { RoleSeeder } from './libs/InitialSetups';

/**
 * 
 * Express instance
 * 
 */
const app = express();
app.set('pkg', pkg);

/**
 * 
 * Routers import
 * 
 */
import UserRouters from './routes/UserRouters';

/**
 * 
 * Initials Setup
 * 
 */
RoleSeeder();

/**
 * 
 * Middlewares
 * 
 */
app.use(bodyParser.urlencoded({ extended: false })); //-> parse application/x-www-form-urlencoded 
app.use(bodyParser.json()); // -> parse application/json
app.use(express.json());
app.use(morgan('dev'));

/**
 * 
 * Set main API info
 * 
 */
app.get('/', (req, res) => {
  res.json({
    name: app.get('pkg').name,
    author: app.get('pkg').author,
    description: app.get('pkg').description,
    version: app.get('pkg').version,
    license: app.get('pkg').license
  })
});

/**
 * 
 * Set routes
 * 
 */
app.use('/api/user', UserRouters);

/** ================================
 * Set routes
 */
export default app;
 /**
  * ============================= */