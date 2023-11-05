const axios = require('axios')
const PbFunction=require("../pocketbase/database");
const postUserCredentials=PbFunction.postUserCredentials;
const checkActivity=require("../zig/discordGetSong")

async function discordGetToken(code, userId) 
{
    const data = {
        client_id: process.env.NODE_APP_DISCORD_APP_ID,
        client_secret: process.env.NODE_APP_DISCORD_SECRET_CLIENT,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.NODE_APP_DISCORD_MESSAGE_REDIRECT 
    };
    try {
        const response = await axios({
            method: 'post',
            url: process.env.NODE_APP_DISCORD_TOKEN_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data
        });
        checkActivity(response.data.access_token)
        return (postUserCredentials(response.data.access_token, "refreshtoken", userId, "gboo0aypxx91aiq"))
    } catch (error) {
        console.error('cannot get token');
        return 400;     // TOKEN NOT VALID
    }    
}

module.exports=discordGetToken