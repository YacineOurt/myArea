const axios = require('axios')
const PbFunction = require("../pocketbase/database");
const postUserCredentials=PbFunction.postUserCredentials;
const postNewToken=PbFunction.postNewToken;
const getServiceId=PbFunction.getServiceId;
const {getUsersConnectedToAService} = require('../pocketbase/database');
const e = require('cors');

async function spotifyGetToken(code, user_id, platforme) {
    try {
        const redirect_link = platforme == "mobile" ? process.env.NODE_APP_SPOTIFY_MOBILE_REDIRECT_URI : process.env.NODE_APP_SPOTIFY_REDIRECT_URI; 
        const basicAuth = Buffer.from(`${process.env.NODE_APP_SPOTIFY_CLIENT_ID}:${process.env.NODE_APP_SPOTIFY_CLIENT_SECRET}`).toString('base64');
        const data = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirect_link)}`;
        const spotifyId = await getServiceId("Spotify");
        const response = await axios.post(`${process.env.NODE_APP_SPOTIFY_URL}/token`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth}`,
            }
        });

        if (spotifyId != null) {
            const credentialsPostSuccess = await postUserCredentials(response.data.access_token, response.data.refresh_token, user_id, spotifyId); // Utilisation de await ici

            if (credentialsPostSuccess) { 
                return true;
            } else {
                console.log("Error posting user credentials.");
                return false;
            }
        } else {
            console.log("cannot get Spotify token: cannot find Spotify zag id");
            return false;
        }
    } catch (error) {
        console.error('cannot get Spotify token:', error.response?.data || error.message);
        return false;
    }
}



async function spotifyRefreshToken(user_id, service_id, refresh_token) {
    const data = `grant_type=refresh_token&refresh_token=${encodeURIComponent(refresh_token)}`;
    const basicAuth = Buffer.from(process.env.NODE_APP_SPOTIFY_CLIENT_ID + ':' + process.env.NODE_APP_SPOTIFY_CLIENT_SECRET).toString('base64');
    try {
        const response = await axios.post(`${process.env.NODE_APP_SPOTIFY_URL}/token`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + basicAuth
            }
        });
        postNewToken(response.data.access_token, user_id, service_id)
        return response.data;
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error.message);
    }
}

async function refreshAllSpotifyToken() {
    const all_spotify_user = await getUsersConnectedToAService("Spotify");
    if (!all_spotify_user) {
        return;
    }
    try {
        all_spotify_user.items.forEach(element => {
            spotifyRefreshToken(element.user_id, element.service_id, element.refresh_token)
        });
    } catch(e) {
        console.log(e.message);
    }
}

module.exports= {
    spotifyGetToken,
    refreshAllSpotifyToken
}
