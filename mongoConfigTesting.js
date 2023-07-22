//// mongoConfigTesting.js 
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer = null
async function initializeMongoServer() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}

async function disconnect() {
  if (mongoServer) {
    await mongoose.connection.close()
    await mongoServer.stop();
  }
}

module.exports = {
  initializeMongoServer,
  disconnect
};