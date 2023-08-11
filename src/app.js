const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authConfig = require('./config/auth');
const connectDB = require('./config/db');
const { auth } = require('express-openid-connect');
const Booking = require('./models/Booking');
const { requiresAuth } = require('express-openid-connect');
const { User } = require('./models/User');
// const { User, hashPassword, encryptInfo } = require('./models/User');

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

        // Set user information from JWT payload
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
            // Check if OpenId Connect authentication was successful
            if(req.oidc.isAuthenticated()){
                req.user.id = req.oidc.user.sub;
                req.user.name = req.oidc.user.name;
                req.user.token = req.oidc.idToken;
                next();
            } else {
                res.status(401).json({ message: 'Unauthorised: You need to be logged in.'})
            }
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

// Middleware to check if a user is an admin

const isAdmin = async (req, res, next) => {
        if(req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'You are not authorised to do this action'});
        }
    
};

// Middlware to check data access/edit/delete permissions

const isAuthorisedForRequest = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if(booking.userId === req.user.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'You are not authorised to do this action'});
        }
    } catch(error) {
        res.status(400).json({ message: 'Something went wrong' });
    }
}


// Route to retrieve all bookings as a basic user
app.get('/bookings', isAuthenticated, isAuthorisedForRequest, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id });
        res.send({ bookings, user: req.user });
    } catch(error) {
        res.status(400).json({ message: 'Something went wrong' });
    }
});

// Route to retrieve a specific booking by ID
app.get('/bookings/:id', isAuthenticated, isAuthorisedForRequest, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if(!booking) {
            res.status(404).json({ message: 'Booking not found' });
        }
        res.send({ booking, user: req.userId });
    } catch(error) {
        res.status(400).json({ message: 'Something went wrong'});
    }
});

// Route to create a new booking
app.post('/bookings', isAuthenticated, (req, res) => {
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
app.put('/bookings/:id', isAuthenticated, isAuthorisedForRequest, async (req, res) => {
    try {
        const oldBooking = await Booking.findByIdAndUpdate(req.params.id, req.body);
        if(!oldBooking){
            res.status(404).json({ message: 'Booking not found' });
        }
        const newBooking = await Booking.findById(req.params.id);
        res.send({ oldBooking, newBooking });
    } catch(error) {
        res.status(400).json({ message: 'Something went wrong' });
    }
});

// Route to delete a booking by ID
app.delete('/bookings/:id', isAuthenticated, isAuthorisedForRequest, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndRemove(req.params.id);
        if(!booking){
            res.status(404).json({ message: 'Booking not found' });
        }
        res.send(booking);
    } catch(error) {
        res.status(400).json({ message: 'Something went wrong' });
    }
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