const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


// Create User model and assign properties
const userSchema = new mongoose.Schema({
    email: String,
    name: String, 
    password: String,
    bookings: Object,
    isAdmin : { type: Boolean, default: false }
});

// Function to encrypt sensitive data
// async function encryptInfo(data, encryptionKey){
//     // Symmetric encryption algorithm
//     const algorithm = 'aes-256-cbc';

//     // Generate a random initialisation vector
//     const iv = crypto.randomBytes(16)

//     // Create a cipher using the specified algorithm and the encryption key
//     const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

//     // Encrypt the data
//     let encryptedData = cipher.update(data, 'utf8', 'hex');
//     encryptedData += cipher.final('hex');

//     // Return the encrypted data as an object, also containing the intialisation vector
//     const encryptedObject = {
//         iv: iv.toString('hex'),
//         encryptedData
//     };

//     return encryptedObject;
// }

// Function to hash a user's password
// async function hashPassword(password){
//     // Generate salt
//     const salt = bcrypt.genSaltSync(parseInt(rounds));

//     // Hash the password using the salt
//     const hashedPassword = bcrypt.hashSync(password, salt);

//     return hashedPassword;
// }

const User = mongoose.model('User', userSchema);

module.exports = { User };