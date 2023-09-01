const authConfig = {
    authRequired: true,
    auth0Logout: true,
    baseURL: process.env.AUTH0_AUDIENCE,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    secret: process.env.AUTH0_SECRET,
    sendGridApiKey: process.env.SENDGRID_API_KEY
}

module.exports = authConfig;