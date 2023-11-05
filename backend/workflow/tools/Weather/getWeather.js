require('dotenv').config()
const axios = require('axios');


async function getWeather() {
    const weather = await fetchWeatherData();
    const code = weather.weathercode;
    const temperature = await getTemperature();
    if (code <= 19)
        return "Il fait beau aujourd'hui ! ☀️ " + temperature
    if (code > 19 && code <= 29)
        return "L'eau ça mouille 🌧️ " + temperature
    if (code > 29 && code <= 49)
        return "La tête dans les nuages 🌁 " + temperature
    if (code > 49 && code <= 69)
        return "Grosse tempête ! 🌧️ " + temperature
    if (code > 69 && code <= 79)
        return "C'est beau ! 🌨️ " + temperature
    if (code > 79 && code <= 99)
        return "Quelques goutelettes 🌦️ " + temperature
    return temperature
}

async function getTemperature() {
    const weather = await fetchWeatherData();
    return("Il fait actuellement : " + weather.temperature + "°C");
}

async function fetchWeatherData () {
    try {
        return await axios.get(process.env.NODE_APP_WEATHER_URL).then( (response) => {
            return response.data.current_weather
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo :', error);
    }
}

module.exports = { getWeather, getTemperature }