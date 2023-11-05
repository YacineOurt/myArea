const dotenv = require('dotenv');
dotenv.config({ path: '../../../.env' });
const turf = require('@turf/turf');
const opencage = require('opencage-api-client');
const adresse = "101 rue Hospital Militaire, 59800, Lille"; // a supprimer

const coordAdress = opencage
    .geocode({ q: adresse, key :process.env.OPENCAGE_API_KEY })
    .then((data) => {
    if (data.status.code === 200 && data.results.length > 0) {
        return data.results[0].geometry;
    } else {
        console.log('Status', data.status.message);
        console.log('total_results', data.total_results);
    }
    })
    .catch((error) => {
        console.log('Error', error.message);
    if (error.status.code === 402) { // Si ca bug à cette ligne c'est parce que j'ai pas push je .env avec la clé API
        console.log('hit free trial daily limit');
    }
});

function getIndicesOfSmallestValues(arr) {
    const indexedArray = arr.map((value, index) => ({ value, index }));
    indexedArray.sort((a, b) => a.value - b.value);
    const smallestIndices = indexedArray.slice(0, 5).map(item => item.index);

    return smallestIndices;
}

async function getNearPlaces (places) {
    const _places = await places
    const coord = await coordAdress;
    const distances = _places.map((place) => {
        return turf.distance([place.geo.lon, place.geo.lat], [coord.lng, coord.lat]);
    })
    return getIndicesOfSmallestValues(distances);
}

module.exports = { getNearPlaces }

