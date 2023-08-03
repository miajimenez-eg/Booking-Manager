const axios = require('axios');

const getGitHubAccessToken = async (code) => {
    const body = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET,
        code,
    }
    const options = {
        headers: {
            accept: "application/json"
        }
    }

    const response = await axios.post('https://github.com/login/oauth/access_token', body, options)
    const accessToken = await response.data.access_token
    return {
        status: 200,
        token: accessToken,
        user: await getUserDetails(accessToken)
    }
}

const getUserDetails = async (token) => {
    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`
            }
        })
        const data = await response.data
        return {
            success: true,
            id: data.id,
            name: data.name
        }
    } catch(err) {
        return {
            success: false
        }
    }
}

module.exports = {
    getGitHubAccessToken,
    getUserDetails
}