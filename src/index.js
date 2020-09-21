require('dotenv').config()

/**
 * 
 * Express APP setting  import
 * 
 */
import app from './app';

/**
 * 
 * Server started
 * 
 */
app.listen(process.env.PORT || process.env.SERVER_PROT);

console.log('Serve listen on port', Number(process.env.SERVER_PROT));