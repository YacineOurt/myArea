const {spotifyGetToken} = require("./getToken/spotify")
const {setDiscordInfo, getZigFromName, getUserFromEmail} = require("./pocketbase/database")
const {setDiscordWaiting} = require("./pocketbase/database")
const {getUserFromDiscordId} = require("./pocketbase/getZag")
const {getZagFromZigAndUser} = require("./pocketbase/database")
const {launchZag} = require("./handleZigzag")
const {googleGetToken} = require("./getToken/google")
const { getWeather } = require("./tools/Weather/getWeather")
const { newAlbumThisWeek } = require("./zig/Spotify/newAlbumThisWeek")
const {infoNearPlaces } = require ("./tools/VLille/v_lille")
const {setDiscordCredential} = require("./pocketbase/database");

function initRoute(app, queue) {
    app.post('/spotify/setCode', async (req, res) => {
        const code = req.body.code;
        const userId = req.body.userId;
        const platforme = req.body.platforme ? req.body.platforme : null;
    
        if (code && userId) {
            const result = await spotifyGetToken(code, userId, platforme);
            if (result) {
                res.status(200).send("Ok. Successfully got user Spotify Token");
            } else {
                res.status(500).send("Internal server error: wrong userId or code");
            }
        } else {
            res.status(400).send("Bad request: code or userId missing");
        }
    });
    

    app.post("/discord/setInfo", async (req, res) => {
        const discordId = req.body.discordId;
        const discordChannel = req.body.discordChannel;
        if (discordId && discordChannel) {
            const status = await setDiscordInfo(discordId, discordChannel);
            await setDiscordCredential(await getUserFromDiscordId(discordId));
            if (status)
                res.status(200).send("Ok. Set discordId to a user");
            else {
                console.log("Internal servor error: probably no user waiting");
                res.status(500).send("Internal servor error: probably no user waiting");
            }
        } else {
            res.status(400).send("Bad request: discordId is missing");
        }
    });

    app.post('/google/setCode', async(req, res) => {
        const code = req.body.code;
        const userId = req.body.userId;

        if (code && userId) {
            try {
                const response = await googleGetToken(code, userId);
                if (response == 200) {
                    console.log("get google token SUCCESS");
                    res.status(200).send("Ok.Successfuly get Google token.");
                }
            } catch(e) {
                console.log("Google get token error : " + e.message);
                res.status(500).send("Internal servor error: wrong userId or code");
            }
        } else {
            res.status(400).send("Bad request: code or userId missing");
        }
    })

    app.post("/discord/setWaiting", async (req, res) => {
        const userId = req.body.userId;
        if (userId) {
            try {
                const status = await setDiscordWaiting(userId);
                if (status)
                    res.status(200).send("Ok. Successfully set user to waiting");
            } catch(e) {
                res.status(500).send("Internal servor error: cannot set to waiting")
            }
        } else {
            res.status(400).send("Bad request: userId is missing or null");

        }
    });

    app.post("/discord/trigger/getSong", async (req, res) => {
        const discordId = req.body.discordId;
        const songId = req.body.songId;
        
        if (discordId && songId) {
            try {
                const user = await getUserFromDiscordId(discordId);
                const zig = await getZigFromName("Envoie un lien spotify sur discord");
    
                if (user.totalItems > 0 && zig.totalItems > 0) {
                    const zigzag = await getZagFromZigAndUser(user.items[0].id, zig.items[0].id)
                    launchZag(zigzag.items[0].zag_id, user.items[0].id, {songId: songId})
                    res.status(200).send("Ok");
                } else {
                    res.status(404).send('User or Zig not found.');
                }
            } catch (error) {
                console.error('Error:', error.message);
                res.status(500).send('Internal server error.');
            }
        } else {
            res.status(400).send('Bad request: discordId or songId missing.');
        }
    });
    
    app.post("/discord/askMeteo", async (req, res) => {  //TODO: Mettre /discord/meteo pour une meilleure compréhension 
        const discordId = req.body.discordId;
        const channelId = req.body.channelId === undefined ? null : req.body.channelId;

        if (discordId) {
            try {
                const user = await getUserFromDiscordId(discordId);
                const zig = await getZigFromName('Ecris météo sur Discord');
                const message = await getWeather();
                if (user.totalItems > 0 && zig.totalItems > 0 && message) {
                    const zigzag = await getZagFromZigAndUser(user.items[0].id, zig.items[0].id)
                    launchZag(zigzag.items[0].zag_id, user.items[0].id, {discordId: discordId, channelId: channelId, message: message})
                    res.status(200).send("Ok");
                } else {
                    res.status(404).send('User or Zig not found.');
                    console.log(`discord/askMeteo error: User or Zig not found. Zig = ${zig.totalItems} \n User = ${user.totalItems}`)
                }
            } catch(e) {
                console.log("/discord/askMeteo error " + e.message)
                res.status(500).send("Internal server error");
            }
        }
    });

    app.post("/discord/newMessage", async (req, res) => {  //TODO: Mettre /discord/meteo pour une meilleure compréhension 
        const discordId = req.body.discordId;
        const channelId = req.body.channelId;
        const message = req.body.message;

        if (discordId) {
            try {
                const user = await getUserFromDiscordId(discordId);
                const zig = await getZigFromName('Récupération des messages');
                if (user.totalItems > 0 && zig.totalItems > 0 && message) {
                    const zigzag = await getZagFromZigAndUser(user.items[0].id, zig.items[0].id)
                    launchZag(zigzag.items[0].zag_id, user.items[0].id, {discordId: discordId, channelId: channelId, message: message})
                    res.status(200).send("Ok");
                } else {
                    res.status(404).send('User or Zig not found.');
                    console.log(`DiscordNewMessage error: User or Zig not found. Zig = ${zig.totalItems} \n User = ${user.totalItems}`)
                }
            } catch(e) {
                console.log("DiscordNewMessage error " + e.message)
                res.status(500).send("Internal server error");
            }
        }
    });

    app.post("/VLille/getVLille", async (req, res) => {  //TODO: Mettre /discord/meteo pour une meilleure compréhension 
        const discordId = req.body.discordId;
        const channelId = req.body.channelId;

        if (discordId) {
            try {
                const user = await getUserFromDiscordId(discordId);
                const zig = await getZigFromName(`Ecris V'Lille sur Discord`);
                if (user.totalItems > 0 && zig.totalItems > 0) {
                    const message = await infoNearPlaces(user.items[0].id);
                    const zigzag = await getZagFromZigAndUser(user.items[0].id, zig.items[0].id)
                    launchZag(zigzag.items[0].zag_id, user.items[0].id, {discordId: discordId, channelId: channelId, message: message})
                    res.status(200).send("Ok");
                } else {
                    res.status(404).send('User or Zig not found.');
                    console.log(`DiscordNewMessage error: User or Zig not found. Zig = ${zig.totalItems} \n User = ${user.totalItems}`)
                }
            } catch(e) {
                console.log("DiscordNewMessage error: " + e.message)
                res.status(500).send("Internal server error");
            }
        }
    });
}

async function calendarEventWithinOneHour(userId, eventName, eventDescription) {
    if (userId && eventName) {
        const message = `N'oubliez pas votre évènement: ${eventName} ${eventDescription != undefined ? ` -> ${eventDescription}` : ""}`;
        try {
            const zig = await getZigFromName("Un event calendar à lieu dans moins d'une heure");
            
            if (zig.totalItems > 0) {
                const zigzag = await getZagFromZigAndUser(userId, zig.items[0].id);
                launchZag(zigzag.items[0].zag_id, userId, {message: message});
            } else {
                console.log("Google calendar: zig not found");
            }
        } catch(e) {
            console.log("Google calendar error " + e.message)
        }
    }
}

function extractEmail(inputString) {
    const emailRegex = /<([^>]+)>/;
    const match = inputString.match(emailRegex);
    return match ? match[1] : null;
}

async function gmailNewMail(subject, body, from, to) {
    if (from && to) {
        const message = `From ${from}\nObjet: ${subject}\n ${body}`;
        try {
            const zig = await getZigFromName("Nouveau mail reçu");
            const user = await getUserFromEmail(extractEmail(to));
            console.log("user = " + JSON.stringify(user));
            if (zig.totalItems > 0 && user.id) {
                const zigzag = await getZagFromZigAndUser(user.id, zig.items[0].id);
                launchZag(zigzag.items[0].zag_id, user.id, {message: message});
            } else {
                console.log("Gmail new mail: zig not found");
            }
        } catch(e) {
            console.log("Gmail new mail error " + e.message)
        }
    } else {
        console.log("Gmail new mail: no from found")
    }
}

module.exports = {
    initRoute,
    calendarEventWithinOneHour,
    gmailNewMail
}