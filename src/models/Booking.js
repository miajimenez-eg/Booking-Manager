const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    destination: String,
    price: Number,
    dates: Date,
    accommodation: String,
    userId: Number
});

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking;