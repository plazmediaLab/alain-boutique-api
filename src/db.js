import  mongoose from 'mongoose';
require('dotenv').config();

mongoose.Promise = global.Promise;

/**
 * 
 * MongoDB connection for development
 * @parameters // process.env.DB_NAME with the name of your DB in the .env file
 */
mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}, (err) => {
    if (!err) {
        console.log('SUCCESS on MongoDB Connection');
    } else {
        console.log('Error in DB connection: ' + err)
    }
});