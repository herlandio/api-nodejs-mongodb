require('dotenv').config();
const mongoose = require('mongoose');
const { USER, PASS, DB } = process.env;

if (!USER || !PASS || !DB) {
  console.error('Environment variables USER, PASS, and DB must be defined.');
  process.exit(1);
}

const uri = `mongodb+srv://${USER}:${PASS}@cluster0.4zr4a.mongodb.net/${DB}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
