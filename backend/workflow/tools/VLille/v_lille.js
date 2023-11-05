const axios = require('axios');
const { getNearPlaces } = require('./getDistance');
const {getAdressFromUserId} = require("../../pocketbase/database");

const URL = process.env.NODE_APP_OPENDATA_URL;

async function getFromCity (city) {
    let NEW_URL;

    if (city)
        NEW_URL += "refine=commune%3A%22" + city.toUpperCase() + "%22";

    const response = await fetchData(NEW_URL);

    return response.results;
}

async function fetchData(endpoint) {
    try {
        const responseData = await axios.get(URL + endpoint)
        return responseData.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo :', error);
    }
}

function formaterDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('fr-FR', options);
}

async function infoNearPlaces (user_id) {
    const adress = await getAdressFromUserId(user_id);
    const places = getFromCity("Lille");
    const nearPlaces = await getNearPlaces(places, adress);
    const _places = await places;

    let v_lille = "Voici la liste des 5 stations de v_lille les plus proches de vous et le nombre de v_lille disponible : \n\n";

    nearPlaces.map( (place) => {
        v_lille += `${_places[place].nom} ->  \
        ${_places[place].adresse} : \
        ${_places[place].nbvelosdispo} \n\n`
    });
    v_lille += `Date de la dernière mise à jour : ${formaterDate(_places[0].datemiseajour)}`;
    return (v_lille)
}

module.exports = { infoNearPlaces }
