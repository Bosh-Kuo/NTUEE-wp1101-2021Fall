import mongoose from "mongoose";
import { dataInit } from "./upload.js";
import dotenv from 'dotenv-defaults';

import "dotenv-defaults/config.js";
dotenv.config();

async function connect() {
  // TODO 1.1 Connect your MongoDB
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('Mongo database connected!');
    // dataInit();
  });
}

export default { connect };