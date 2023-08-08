const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    name: String, 
    password: String,
    bookings: Object
});

const User = mongoose.model('User', userSchema);

module.exports = User;