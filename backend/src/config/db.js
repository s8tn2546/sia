const mongoose = require("mongoose");
const env = require("./env");

const connectDb = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      maxPoolSize: 20,
      minPoolSize: 2
    });
    console.log(`Connected to MongoDB at ${env.mongoUri}`);
  } catch (err) {
    console.log(`Failed to connect to ${env.mongoUri}, falling back to in-memory MongoDB...`);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      maxPoolSize: 20,
      minPoolSize: 2
    });
    console.log(`Connected to in-memory MongoDB at ${uri}`);
  }
};

module.exports = connectDb;
