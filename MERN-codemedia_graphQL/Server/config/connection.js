const mongoose = require('mongoose');
require('dotenv').config();

// Optional: prevent deprecation warnings
mongoose.set('strictQuery', false);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/snippetDB';

if (!process.env.MONGODB_URI) {
  console.warn('⚠️ Warning: MONGODB_URI not set in .env. Falling back to local MongoDB.');
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
db.once('open', () => {
  console.log(`✅ MongoDB connected: ${MONGODB_URI.includes('localhost') ? 'Local' : 'Atlas/Cloud'}`);
});

module.exports = db;
