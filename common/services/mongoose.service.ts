import mongoose from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongoose-service');

class MongooseService {
    private count = 0;
    private mongooseOptions = { useNewUrlParser: true,  useUnifiedTopology: true, serverSelectionTimeoutMS: 5000, useFindAndModify: false };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose(){
        return mongoose;
    }

    connectWithRetry = () => {
        log('MongoDB connection with retry');
        mongoose.connect("mongodb://localhost:27017/api-db",  this.mongooseOptions).then(() => {
            log('MongoDB is connected')
        }).catch(err => {
            log(`MongoDB connection unsuccessful (will do retry #${++this.count} after 5 seconds):`, err);
            setTimeout(this.connectWithRetry, 5000)
        })
    };
}
export default new MongooseService();