import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connection = async () => {
    const MONGO_USER = process.env.MONGO_USER;
    const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
    const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
    const MONGO_DB = process.env.MONGO_DB;

    const MONGO_UR = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;
    try{
        await mongoose.connect(MONGO_UR);
        return console.log('Successful Connection to MongoDB',
            'Database USER', MONGO_USER,
            'Database ', MONGO_DB);
    }
    catch(error){
        console.log('Could not connect to db:', error)
    }
}

export default connection;