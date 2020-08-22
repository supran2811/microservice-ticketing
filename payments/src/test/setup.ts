import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

/** To mock the import of nats-wrapper client from mocks folder */
jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_kYCCryd0LcyMNv3blFN7cApS00XN5EbNSu';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'assffff';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks(); // clear and reset all the mocks
  const collections = await mongoose.connection.db.collections();

  for (let coll of collections) {
    await coll.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload. { id , email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object: { jwt: My_jwt}
  const session = { jwt: token };

  // Turn session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take json and encode it as Base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with encoded data
  return [`express:sess=${base64}`]; // return array for supertest
};
