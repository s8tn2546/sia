const mongoose = require("mongoose");
const env = require("./env");

const syncIndexes = async () => {
  const modelNames = mongoose.modelNames();

  if (!modelNames.length) {
    return;
  }

  await Promise.all(modelNames.map((modelName) => mongoose.model(modelName).syncIndexes()));
};

const connectDb = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      maxPoolSize: 20,
      minPoolSize: 2
    });
    await syncIndexes();
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
    await syncIndexes();
    console.log(`Connected to in-memory MongoDB at ${uri}`);
  }
};

module.exports = connectDb;
