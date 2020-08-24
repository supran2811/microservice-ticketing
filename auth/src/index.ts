import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  console.log('Starting up...!!!');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KET must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo uri must be definde');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to mongodb!!');
  } catch (error) {
    console.log('Error ::: ', error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000 !!!!!');
  });
};

start();
