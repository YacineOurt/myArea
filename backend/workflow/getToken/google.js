require('dotenv').config()
const querystring = require('querystring');
const axios = require('axios');
const {postUserCredentials} = require("../pocketbase/database");
const {getServiceId} = require("../pocketbase/database");
const {postNewToken} = require("../pocketbase/database");
const {getUsersConnectedToAService} = require("../pocketbase/database");

async function googleGetToken(code, userId) {
    const tokenEndpoint = 'https://oauth2.googleapis.com/token';
    const params = {
        code: code,
        client_id: process.env.NODE_APP_GOOGLE_ID_CLIENT,
        client_secret: process.env.NODE_APP_GOOGLE_SECRET,
        redirect_uri: process.env.NODE_APP_GOOGLE_REDIRECT,
        grant_type: 'authorization_code'
    };

    try {
        const response = await axios.post(tokenEndpoint, querystring.stringify(params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (response.status == 200) {
            const serviceId = await getServiceId("Google");
            postUserCredentials(response.data.access_token, response.data.refresh_token, userId, serviceId);
            return 200;
        } else {
            console.log("Error exchanging authorization code for tokens");
            return 500;
        }
    } catch (error) {
        console.error('Error exchanging authorization code for tokens:', error.message);
        throw error;
    }
}


async function googleRefreshToken(userId, serviceId, refreshToken) {

    try {
        const response = await axios.post(process.env.NODE_APP_GOOGLE_TOKEN_URL, {
            client_id: process.env.NODE_APP_GOOGLE_ID_CLIENT,
            client_secret: process.env.NODE_APP_GOOGLE_SECRET,
            refresh_token: refreshToken,
            grant_type: "refresh_token"
        });

        if (response.data && response.data.access_token) {
            postNewToken(response.data.access_token, userId, serviceId);
            return 200;
        } else {
            console.log(`Cannot refresh google token for user ${userId}`);
            return 500;
        }
    } catch (error) {
        console.error("Error in refreshGoogleToken:", error.message);
        throw error;
    }
}

async function refreshAllGoogleToken() {
    const all_google_user = await getUsersConnectedToAService("Google");

    if (!all_google_user) {
        return;
    }
    try {
        all_google_user.items.forEach(element => {
            googleRefreshToken(element.user_id, element.service_id, element.refresh_token)
        });
    } catch(e) {
        console.log("Error refresh all google token: " + e.message);
    }
}

module.exports = {
    googleGetToken,
    refreshAllGoogleToken
}