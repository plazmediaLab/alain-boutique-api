import express from 'express';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import pkg from '../package.json';
import { decodedToken, userAccess } from './middlewares';

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
import UserRoutes from './routes/UserRoutes';
import GroupRoutes from './routes/GroupRoutes';
import ProductRoutes from './routes/ProductRoutes';
import ParnerthRoutes from './routes/ParnerthRoutes';
import SummaryRoutes from './routes/SummaryRoutes';

/**
 * 
 * Initials Setup
 * 
 */
// Add here your initial settings

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
 * Public dir || Static files
 * 
 */
app.use(express.static(path.join(__dirname, 'public')));

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
  });
});

/**
 * 
 * Set routes
 * 
 */
app.use('/api/user', UserRoutes);
app.use('/api/group', decodedToken, userAccess, GroupRoutes);
app.use('/api/product', decodedToken, userAccess, ProductRoutes);
app.use('/api/parnerth', decodedToken, ParnerthRoutes);
app.use('/api/summary', decodedToken, userAccess, SummaryRoutes);

/** ================================
 * Set routes
 */
export default app;
 /**
  * ============================= */ 