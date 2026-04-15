const mongoose = require("mongoose");
const env = require("./env");

const connectDb = async () => {
  await mongoose.connect(env.mongoUri, {
    maxPoolSize: 20,
    minPoolSize: 2
  });
};

module.exports = connectDb;
