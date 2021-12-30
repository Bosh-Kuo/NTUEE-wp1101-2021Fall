import mongoose from 'mongoose';
import dotenv from 'dotenv-defaults';

dotenv.config();

const mongoConnect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('Mongo database connected!');
    });
}

export default mongoConnect;