const {getUserCredentialInfo} = require("../../pocketbase/database");
const {getServiceId} = require("../../pocketbase/database");
const axios = require('axios');


async function fetchWebApi(endpoint, method, token) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
  });
  if (endpoint == "v1/me/top/artists?limit=10&offset=0")
    return res;
  return res.json();
}



async function addSong(tracksUri, userId){
  const spotify_service_id = await getServiceId("Spotify")
  const token_info = await getUserCredentialInfo(userId, spotify_service_id);
  const token = token_info.encrypted_credentials;
  const { id: user_id } = await fetchWebApi('v1/me', 'GET', token)
  const playlist = await fetchWebApi( `v1/users/${user_id}/playlists`, 'GET', token);
  console.log(playlist)
  try {
    const response = await fetchWebApi(
        `v1/playlists/${playlist.items[0].id}/tracks?uris=spotify:track:${tracksUri}`,
        'POST',
        token
      );
    if (response.status < 200 || response.status >= 300)
        console.error(`Error response from server: ${response.status} - ${response.statusText}`);
  } catch(e) {
    console.log("Cannot add song into playlist: " + e.message)
  }

  return playlist;
}

module.exports = {
  addSong,
  fetchWebApi
}