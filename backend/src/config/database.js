const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const seedDatabase = require('./seedData');

async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fashionhub';
  try {
    console.log('Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('Connected to MongoDB successfully!');
    await seedDatabase();
  } catch (err) {
    console.log('Local MongoDB not detected on 27017. Starting embedded MongoDB server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      console.log('Embedded MongoDB server running at:', memoryUri);
      await mongoose.connect(memoryUri);
      console.log('Connected to Embedded MongoDB successfully!');
      await seedDatabase();
    } catch (memErr) {
      console.error('Failed to start Embedded MongoDB:', memErr);
    }
  }
}

connectDB();

module.exports = mongoose.connection;
