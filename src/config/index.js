import { Booking } from '../models/Booking';
import { User } from '../models/User';

Booking.belongsTo(User);
User.hasMany(Booking);

export default {
    Booking,
    User
};