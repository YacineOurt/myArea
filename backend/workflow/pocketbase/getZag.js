const axios = require("axios");

async function postSongInMetadata(discord_id, song_id)
{
    const zag_id = await getZagFromDiscordId(discord_id);
}

async function setMetadataToZag(zag_id, metadata)
{
    console.log(zag_id, metadata)
    try {
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/zigzag/records/${zag_id}`,
            headers: { 
            'Content-Type': 'application/json'
            },
            data : {
                "metadata": metadata
            }
        };
        
        const response = await axios.request(config)
        console.log(response.data)
        return 200;
    } catch(error) {
        console.log(error);
        return 500;
    }
}
async function getUserFromDiscordId(discord_id) {

    const encoded_discord_id = encodeURIComponent(discord_id)

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/users/records?filter=discord_id%3D"${encoded_discord_id}"`,
        headers: { }
      };
    try {
        const response = await axios.request(config);
        return response.data;
    } catch {
        (error) => {
            console.log("Cannot get user from DiscordId " + error);
        }};
}

module.exports = {
    getUserFromDiscordId,
    setMetadataToZag,
}