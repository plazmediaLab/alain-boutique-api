if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

/**
 * 
 * Express APP setting import
 * 
 */
import app from './app';

/**
 * 
 * DB connection started 
 * @settings // Uncomment to start the connection to the database
 */
import './db';

/**
 * 
 * Server started
 * 
 */
app.listen(process.env.PORT || process.env.SERVER_PORT);

console.log('Serve listen on port', Number(process.env.PORT || process.env.SERVER_PORT));