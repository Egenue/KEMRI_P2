import mongoose from 'mongoose';

const connection = async () => {
    const MONGO_USER = process.env.MONGO_USER;
    const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
    const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
    const MONGO_DB = process.env.MONGO_DB;

    const MONGO_UR = `mongodb+srv://${MONGO_USER}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;
    try{
        await mongoose.connect(MONGO_UR);
        return console.log('Successful Connection to MongoDB');
    }
    catch(error){
        console.log('Could not connect to db:', error)
    }
}

export default connection;