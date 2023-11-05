import React, { useEffect } from 'react';
import Axios from "axios";
import Cookies from "js-cookie";

export const handleCredentials = async (service) => {
    if (service.name === 'Discord') {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await Axios.post(`${url}/discord/setWaiting`, {
            userId: Cookies.get('userId'),
        })
            .then(() => {
                window.open(service.credentials, '_blank');
            })
            .catch(error => {
                console.error("Une erreur s'est produite lors de l'envoi de la demande à l'API Discord:", error);
            });
    } else {
        window.open(service.credentials, '_self');
    }
}

const ServiceCredentials = () => {

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const serviceType = urlParams.get('service');
        if (serviceType === 'spotify') {
            if (code) {
                console.log('code:', code)
                handleSpotifyCredentials(code).then(r => console.log('Response backend:', r));
            }
        }
        if (serviceType === 'google') {
            if (code) {
                console.log('code:', code)
                handleGoogleCredentials(code).then(r => console.log('Response backend:', r));
            }
        }
    }, []);

    const handleSpotifyCredentials = async (code) => {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL;
        try {
            const response = await Axios.post(`${url}/spotify/setCode`, {
                userId: Cookies.get('userId'),
                code: code,
            });
            window.location.reload();
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'envoi de la demande à l'API Spotify:", error);
        }
    }

    const handleGoogleCredentials = async (code) => {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL;
        try {
            const response = await Axios.post(`${url}/google/setCode`, {
                userId: Cookies.get('userId'),
                code: code,
            });
            window.location.reload();
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'envoi de la demande à l'API Google:", error);
        }
    }

};

export default ServiceCredentials;