const dotenv = require('dotenv');
dotenv.config({ path: '../../../.env' });
const turf = require('@turf/turf');
const opencage = require('opencage-api-client');

const getCoordinates = async (adresse) => {
    try {
      const data = await opencage.geocode({ 
        q: adresse, 
        key: process.env.NODE_APP_OPENCAGE_API_KEY 
      });
  
      if (data.status.code === 200 && data.results.length > 0) {
        return data.results[0].geometry;
      } else {
        console.log('Status', data.status.message);
        console.log('total_results', data.total_results);
        return null;
      }
    } catch (error) {
      console.log('Error', error.message);
      if (error.status && error.status.code === 402) {
        console.log('hit free trial daily limit');
      }
      return null;
    }
};

function getIndicesOfSmallestValues(arr) {
    const indexedArray = arr.map((value, index) => ({ value, index }));
    indexedArray.sort((a, b) => a.value - b.value);
    const smallestIndices = indexedArray.slice(0, 5).map(item => item.index);

    return smallestIndices;
}

async function getNearPlaces (places, adress) {
    const _places = await places
    const coord = await getCoordinates(adress);
    const distances = _places.map((place) => {
        return turf.distance([place.geo.lon, place.geo.lat], [coord.lng, coord.lat]);
    })
    return getIndicesOfSmallestValues(distances);
}

module.exports = { getNearPlaces }

