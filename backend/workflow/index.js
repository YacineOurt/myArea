const express = require('express');
const {initRoute} = require('./routes')
var cors = require('cors');
require('dotenv').config()

const {refreshAllSpotifyToken} = require("./getToken/spotify");
const { refreshAllGoogleToken } = require('./getToken/google');
const {getAllEventFromCalendar} = require("./zig/Calendar/getEventsWithinOneHour");
const { newAlbumThisWeek } = require('./zig/Spotify/newAlbumThisWeek');
const {getAllEmailsFromLastMinute} = require("./zig/Gmail/getNewEmail");

const app = express();
app.use(cors());
const PORT = 8080;
app.use(express.json());

const PULLING_INTERVAL = 5000  // 1 minutes 60000
const REFRESH_SPOTIFY_TOKEN_INTERVALL = 8081 * 1000 // 50 minutes
const DAILY_INTERVAL = 24 * 60 * 60 * 1000 // 1 jour
const WEEKLY_INTERVAL = 7 * 24 * 60 * 60 * 1000 // 1 semaine

let queue = []; //liste des zig déclenchés, en attente d'execution du zag 

initRoute(app, queue);   //Crée toutes les routes

refreshAllSpotifyToken();
refreshAllGoogleToken();

setInterval(() => {             //Refresh tous les tokens de la database
    refreshAllSpotifyToken();
    refreshAllGoogleToken();
}, REFRESH_SPOTIFY_TOKEN_INTERVALL)

setInterval(() => {
    getAllEventFromCalendar();
    getAllEmailsFromLastMinute();
}, PULLING_INTERVAL)


setInterval(() => {
    newAlbumThisWeek()
}, WEEKLY_INTERVAL)


app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

module.exports = {
    app,
}
