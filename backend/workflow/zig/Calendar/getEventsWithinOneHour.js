const {google} = require('googleapis');
const calendar = google.calendar('v3');
const {getUsersConnectedToAService} = require("../../pocketbase/database");
const axios = require('axios');
const { calendarEventWithinOneHour } = require('../../routes');


async function addNotificationFlagToEvent(userToken, calendarId, eventId) {
    const baseURL = 'https://www.googleapis.com/calendar/v3';
    const eventURL = `${baseURL}/calendars/${calendarId}/events/${eventId}`;

    try {
        // Récupérer l'événement existant
        const response = await axios.get(eventURL, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        if (response.data) {
            // Mise à jour de l'objet de l'événement avec le drapeau de notification
            const eventToUpdate = response.data;
            eventToUpdate.extendedProperties = eventToUpdate.extendedProperties || {};
            eventToUpdate.extendedProperties.private = eventToUpdate.extendedProperties.private || {};
            eventToUpdate.extendedProperties.private.notified = 'true';

            // Mettre à jour l'événement avec les nouvelles données
            const updateResponse = await axios.put(eventURL, eventToUpdate, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (updateResponse.status === 200) {
                console.log('Drapeau de notification ajouté avec succès.');
                return updateResponse.data;
            } else {
                console.error('Erreur lors de lajout du drapeau de notification.');
                return null;
            }
        } else {
            console.error('Impossible de récupérer l\'événement.');
            return null;
        }
    } catch (error) {
        console.error('Add notification flag error: ', error.response ? error.response.data : error.message);
        return null;
    }
}

async function getEventsWithinOneHour(token) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: token
    });

    const currentTime = new Date();
    const oneHourLater = new Date(currentTime.getTime() + 60 * 60000);

    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: currentTime.toISOString(),
            timeMax: oneHourLater.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
            auth: oauth2Client
        });

        const allEvents = response.data.items;

        // Filtrer pour garder uniquement les événements sans le drapeau "notified"
        const events = allEvents.filter(event => {
            const extendedProperties = event.extendedProperties || {};
            const privateProps = extendedProperties.private || {};
            return !privateProps.notified; // Retourne vrai si "notified" est absent ou faux
        });
        if (events.length) {
            console.log('Upcoming events in the next hour without the notified flag:');
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary} ${event.description}`);
            });
        } else {
            return null;
        }
        return events;
    } catch (error) {
        console.log('Error fetching events:', error);
        return null;
    }
}

async function getAllEventFromCalendar() {
    const all_google_user = await getUsersConnectedToAService("Google");

    if (!all_google_user) {
        return;
    }
    try {
        // Utiliser Promise.all pour gérer toutes les Promesses retournées par les fonctions asynchrones à l'intérieur de la boucle
        await Promise.all(all_google_user.items.map(async element => {
            const events = await getEventsWithinOneHour(element.encrypted_credentials); // Utiliser await pour résoudre la Promesse
            if (events && Array.isArray(events)) { // Vérifier si events est un tableau
                console.log("azldn")
                await Promise.all(events.map(async (event) => { // Une autre boucle asynchrone à l'intérieur
                    await addNotificationFlagToEvent(element.encrypted_credentials, 'primary', event.id, "Notifié-par-ZigZag");
                    calendarEventWithinOneHour(element.user_id, event.summary, event.description);
                }));
            }
        }));
    } catch(e) {
        console.log("Error during get all events from calendar: " + e.message);
    }
}


module.exports = {
    getAllEventFromCalendar
}