const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authConfig = require('./config/auth');
const connectDB = require('./config/db');
const { auth } = require('express-openid-connect');
const Booking = require('./models/Booking');
const { requiresAuth } = require('express-openid-connect');
const { User, hashPassword, encryptInfo } = require('./models/User');

const PORT = process.env.PORT || 3000;

const app = express();

// MIDDLEWARE

// Parse incoming JSON data
app.use(bodyParser.json());

// Custom middleware to handle user authentication
app.use((req, res, next) => {
    // Initialise user object in the request if not present
    if(req.user == undefined){
        req.user = {};
    }
    // Extract user information from JWT token in headers
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        // Decode JWT token payload
        const token = req.headers.authorization.split(' ')[1];
        const tokenPayLoad = jwt.decode(token);
        req.user.name = tokenPayLoad.name;
        req.user.id = tokenPayLoad.sub;
        req.user.token = token;
        next();
    } else if(req.oidc && req.oidc.isAuthenticated()){
        // Extract user information from OpenID Connect
        req.user.id = req.oidc.user.sub;
        req.user.name = req.oidc.user.name;
        req.user.token = req.oidc.idToken;
        next();
    } else {
        // If not authenticated, use OpenID Connect authentication
        auth(authConfig)(req, res, () => {
            req.user.id = req.oidc.user.sub;
            req.user.name = req.oidc.user.name;
            req.user.token = req.oidc.idToken;
            next();
        });
    }
})

// CONNECT TO DATABASE

// Call the connectDB() function
// Connect to MongoDB
const dbConnection = connectDB();

// Check if connected
if (dbConnection.readyState === 1) {
  console.log('Application is connected to MongoDB');
} else {
  console.log('Application is not connected to MongoDB');
}

// AUTH ROUTES

// Route to check if the user is logged in
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Route that requires authentication to access user profile 

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


// BOOKING ENDPOINTS

// Route to retrieve all bookings
app.get('/bookings', async (req, res) => {
    const bookings = await Booking.find({});
    res.send({bookings, user: req.user});
});

// Route to retrieve a specific booking by ID
app.get('/bookings/:id', async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    res.send({booking, user: req.userId});
});

// Route to create a new booking
app.post('/bookings', (req, res) => {
    const booking = new Booking(req.body);
    booking.save(booking)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(400).send("Something went wrong");
        })
});

// Route to update a booking by ID
app.put('/bookings/:id', async (req, res) => {
    const oldBooking = await Booking.findByIdAndUpdate(req.params.id, req.body);
    const newBooking = await Booking.findById(req.params.id);
    res.send({ oldBooking, newBooking });
});

// Route to delete a booking by ID
app.delete('/bookings/:id', async (req, res) => {
    const booking = await Booking.findByIdAndRemove(req.params.id);
    res.send(booking);
});

// USER ENDPOINTS
// app.post('/register', async (req, res) => {
//     try {
//         // Hash new user's password
//         const hashedPassword = await hashPassword(req.body.password);

//         // Create new user
//         const newUser = new User({
//             email: req.body.email,
//             name: req.body.name,
//             password: hashedPassword,
//             bookings: {}
//         });

//         // Save new user to the database
//         const savedUser = await newUser.save();

//         // Status 201 for successful resource creation
//         res.status(201).send(savedUser);
//     } catch (error) {
//         console.error(error);
//         res.status(400).send("Something went wrong");
//     }
// });



// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;