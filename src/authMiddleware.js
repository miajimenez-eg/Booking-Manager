// const jwt = require('jsonwebtoken');
// const { auth } = require('express-openid-connect');
// const authConfig = require('./config/auth');

// const handleAuthentication = (req, res, next) => {
//     console.log('handleAuthentication function running')
//     // Initialise user object in the request if not present
//     if(req.user == undefined){
//         req.user = {};
//     }
//     // Extract user information from JWT token in headers
//     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
//         // Decode JWT token payload
//         const token = req.headers.authorization.split(' ')[1];
//         const tokenPayLoad = jwt.decode(token);

//         // Set user information from JWT payload
//         req.user.name = tokenPayLoad.name;
//         req.user.id = tokenPayLoad.sub;
//         req.user.token = token;
//         next();
//     } else if(req.oidc && req.oidc.isAuthenticated()){
//         // Extract user information from OpenID Connect
//         req.user.id = req.oidc.user.sub;
//         req.user.name = req.oidc.user.name;
//         req.user.token = req.oidc.idToken;
//         next();
//     } else {
//         // If not authenticated, use OpenID Connect authentication
//         auth(authConfig)(req, res, () => {
//             // Check if OpenId Connect authentication was successful
//             if(req.oidc.isAuthenticated()){
//                 req.user.id = req.oidc.user.sub;
//                 req.user.name = req.oidc.user.name;
//                 req.user.token = req.oidc.idToken;
//                 next();
//             } else {
//                 res.status(401).json({ message: 'Unauthorised: You need to be logged in.'})
//             }
//             next();
//         });
//     }
// };

// module.exports = handleAuthentication;
