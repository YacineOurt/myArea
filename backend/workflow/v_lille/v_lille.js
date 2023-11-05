const axios = require('axios');
const { getNearPlaces } = require('./getDistance');

const URL = "https://opendata.lillemetropole.fr/api/explore/v2.1/catalog/datasets/vlille-realtime/records?limit=20&"

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

async function infoNearPlaces () {
    const places = getFromCity("Lille");
    const nearPlaces = await getNearPlaces(places);
    const _places = await places

    let v_lille = "Voici la liste des 5 stations de v_lille les plus proches de vous et le nombre de v_lille disponible : \n\n";

    nearPlaces.map( (place) => {
        v_lille += `${_places[place].nom} ->  \
${_places[place].adresse} : \
${_places[place].nbvelosdispo} \n\n`
    });
    v_lille += `Date de la dernière mise à jour : ${_places[0].datemiseajour}`
    return (v_lille)
}

module.exports = { infoNearPlaces }
