const mongoose = require('mongoose');
const { USER, PASS, DB } = process.env;
const uri = `mongodb+srv://${USER}:${PASS}@cluster0.4zr4a.mongodb.net/${DB}?retryWrites=true&w=majority`;
mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
