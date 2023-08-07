const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authConfig = require('./config/auth');
const connectDB = require('./config/db');
const { auth } = require('express-openid-connect');
const Booking = require('./models/Booking');

const PORT = process.env.PORT

const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
app.use((req, res, next) => {
    if(req.user == undefined){
        req.user = {};
    }
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        const token = req.headers.authorization.split(' ')[1];
        const tokenPayLoad = jwt.decode(token);
        req.user.name = tokenPayLoad.name;
        req.user.id = tokenPayLoad.sub;
        req.user.token = token;
        next();
    } else if(req.oidc && req.oidc.isAuthenticated()){
        req.user.id = req.oidc.user.sub;
        req.user.name = req.oidc.user.name;
        req.user.token = req.oidc.idToken;
        next();
    } else {
        auth(authConfig)(req, res, () => {
            req.user.id = req.oidc.user.sub;
            req.user.name = req.oidc.user.name;
            req.user.token = req.oidc.idToken;
            next();
        });
    }
})

// CONNECT TO DATABASE
connectDB;

// ENDPOINTS

app.get('/bookings', async (req, res) => {
    const bookings = await Booking.find({});
    res.send({bookings, user: req.user});
});

app.get('/bookings/:id', async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    res.send({booking, user: req.userId});
});

app.post('/bookings', (req, res) => {
    const booking = new Booking(req,body);
    booking.save(booking)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(400).send("Something went wrong");
        })
});

app.put('/bookings/:id', async (req, res) => {
    const oldBooking = await Booking.findByIdAndUpdate(req.params.id, req.body);
    const newBooking = await Booking.findById(req.params.id);
    res.send({ oldBooking, newBooking });
});

app.delete('/bookings/:id', async (req, res) => {
    const booking = await Booking.findByIdAndRemove(req.params.id);
    res.send(booking);
});

// AUTH

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});