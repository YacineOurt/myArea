const {addSong} = require("./zag/Spotify/addSongIntoPlaylist");
const {sendMessage} = require("./zig/Discord/getSong");
const {getChannelFromUserId} = require("./pocketbase/database");
const {getDiscordIdFromUserId} = require("./pocketbase/database");
const {getZagFromName} = require("./pocketbase/database");
const {sendEmail} = require("./zag/Gmail/gmail");

async function launchZag(zag_id, user_id, metadata)
{
    const ZagAddToPlaylist = await getZagFromName("Ajoute à la playlist");
    const ZagWriteOnDiscord = await getZagFromName("Ecris sur votre channel Discord");
    const ZagSendEmail = await getZagFromName("Envoie un mail");

    if (ZagAddToPlaylist.totalItems > 0 && ZagAddToPlaylist.items[0].id == zag_id) {
        if (metadata.songId)
            addSong(metadata.songId, user_id);
        else
            console.log("Cannot launch addSong: songId is missing");
    }
    if (ZagWriteOnDiscord.totalItems > 0 && ZagWriteOnDiscord.items[0].id == zag_id) {
        if (ZagWriteOnDiscord.totalItems > 0 && ZagWriteOnDiscord.items[0].id == zag_id) {
            if (metadata.channelId && metadata.discordId)
                sendMessage(metadata.discordId, metadata.channelId, metadata.message);
            else {
                if (metadata.message) {
                    const channelId = await getChannelFromUserId(user_id);
                    const discordId = await getDiscordIdFromUserId(user_id);
                    sendMessage(discordId, channelId, metadata.message);
                } else {
                    console.log("Cannot launch write on channel: message is missing");
                }
            }
        }
    }
    if (ZagSendEmail.totalItems > 0 && ZagSendEmail.items[0].id == zag_id) {
        sendEmail(user_id, metadata.message);
    }   
}

module.exports = {
    launchZag
}