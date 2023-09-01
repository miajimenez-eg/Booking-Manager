const authConfig = {
    authRequired: true,
    auth0Logout: true,
    baseURL: process.env.AUTH0_AUDIENCE,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    secret: process.env.AUTH0_SECRET
}

module.exports = authConfig;