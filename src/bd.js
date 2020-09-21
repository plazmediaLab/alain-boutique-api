import  mongoose from 'mongoose';

mongoose.Promise = global.Promise;

/**
 * 
 * MongoDB connection for development
 * @parameters // change local-db-name for you DB name
 */
mongoose.connect('mongodb://localhost:27017/local-db-name', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection ERROR')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});