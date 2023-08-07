const mongoose = require('mongoose');

const connectDB = mongoose.connect(process.env.MONGO_DB_CONN_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .then(error => console.error('MongoDB connection error:', error));

module.exports = connectDB;