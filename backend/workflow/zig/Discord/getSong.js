const axios = require("axios");
require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

async function setDiscordId(discordId, discordChannel) {
    try {
        const response = await axios({
            method: 'post',
            url: `${process.env.NODE_APP_SELF_URL}/discord/setInfo`,
            headers: {}, 
            data: {
                discordId: discordId,
                discordChannel: discordChannel 
            }
        });

        if (response.status < 200 || response.status >= 300) {
            console.error(`Error response from server: ${response.status} - ${response.statusText}`);
        }
    } catch(e) {
        console.error('Set discord id error:', e.message);
    }
}


async function triggerNewSong(discordId, songId)
{
    try {
        const response = await axios({
            method: 'post',
            url: `${process.env.NODE_APP_SELF_URL}/discord/trigger/getSong`,
            headers: {}, 
            data: {
                discordId: discordId,
                songId: songId
            }
        });
        if (response.status < 200 || response.status >= 300) {
            console.error(`Error response from server: ${response.status} - ${response.statusText}`);
        }
    } catch(e) {
        console.log("Trigger new song error: " + e.message);
    }
}


async function triggerNewMessage(discordId, channelId, message)
{
    try {
        const response = await axios({
            method: 'post',
            url: `${process.env.NODE_APP_SELF_URL}/discord/newMessage`,
            headers: {}, 
            data: {
                discordId: discordId,
                channelId: channelId,
                message: message
            }
        });
        if (response.status < 200 || response.status >= 300) {
            console.error(`Error response from server: ${response.status} - ${response.statusText}`);
        }
    } catch(e) {
        console.log("Trigger new message error" + e.message);
    }
}


async function triggerNewMessage(discordId, channelId, message)
{
    try {
        const response = await axios({
            method: 'post',
            url: `${process.env.NODE_APP_SELF_URL}/discord/newMessage`,
            headers: {}, 
            data: {
                discordId: discordId,
                channelId: channelId,
                message: message
            }
        });
        if (response.status < 200 || response.status >= 300) {
            console.error(`Error response from server: ${response.status} - ${response.statusText}`);
        }
    } catch(e) {
        console.log("Network error" + e.message);
    }
}

async function triggerMeteo(discordId, channelId)
{
    try {
        const response = await axios({
            method: 'post',
            url: `${process.env.NODE_APP_SELF_URL}/discord/askMeteo`,
            headers: {}, 
            data: {
                discordId: discordId,
                channelId: channelId
            }
        });
        if (response.status < 200 || response.status >= 300) {
            console.log(`Error response from server: ${response.status} - ${response.statusText}`);
        }
    } catch(e) {
        console.log("Trigger meteo network error " + e.message);
    }
}


async function triggerVLille(discordId, channelId)
{
    try {
        const response = await axios({
            method: 'post',
            url: `${process.env.NODE_APP_SELF_URL}/VLille/getVLille`,
            headers: {}, 
            data: {
                discordId: discordId,
                channelId: channelId
            }
        });
        if (response.status < 200 || response.status >= 300) {
            console.log(`Error response from server: ${response.status} - ${response.statusText}`);
        }
    } catch(e) {
        console.log("Trigger meteo network error " + e.message);
    }
}


const client =   new Client ({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

const token = process.env.NODE_APP_DISCORD_BOT_KEY

client.on('ready', (c) => {
    console.log("Bot is online")
});

client.on('guildCreate', (guild) => {
    console.log(`new client ${client.user.id}`);
    setDiscordId(guild.id, guild.systemChannel.id);
});

function sendMessage(guildId, channelId, message)
{
    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
        console.log(`Le bot n'est pas sur ce serveur ou l'ID du serveur est incorrect.`);
        return;
    }

    const channel = guild.channels.cache.get(channelId);

    if (!channel) {
        console.log(`Le canal spécifié n'a pas été trouvé.`);
        return;
    }
    channel.send(message);
}

client.on('messageCreate', async (message) => {
    if (msg = verifyMessage(message.content)) {
        sendMessage(message.guildId, message.channelId, "Bien reçu !");
        triggerNewSong(message.guildId, msg);
        return message;
    } else if (message.content == "météo") {
        triggerMeteo(message.guildId, message.channelId)
    } else if (message.content == `V'Lille`) {
        triggerVLille(message.guildId, message.channelId);
    } else if (message.author.bot) {
        return;
    } else
        triggerNewMessage(message.guildId, message.channelId, message.content)
})

function verifyMessage(message)
{
    const regexSpotify = /^(https:\/\/open\.spotify\.com\/(track|album|artist|playlist)\/[a-zA-Z0-9]+(\?si=[a-zA-Z0-9]+)?)$/;

    if (regexSpotify.test(message)) {
        const regexSpotify = /\/track\/([a-zA-Z0-9]+)\??/;
        const correspondance = regexSpotify.exec(message);

        if (correspondance && correspondance[1]) {
            console.log(correspondance[1])
            return correspondance[1];
        }
        else
            return null;
    } else
        return null;
}

client.login(token);

module.exports = {
    sendMessage
}