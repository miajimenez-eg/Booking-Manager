const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// Create User model and assign properties
const userSchema = new mongoose.Schema({
    email: String,
    name: String, 
    password: String,
    bookings: Object
});


// Function to hash a user's password
async function hashPassword(password){
    return await bcrypt.hash(password, 10);
}

const User = mongoose.model('User', userSchema);

module.exports = { User, hashPassword };