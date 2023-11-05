const { launchZag } = require("../../handleZigzag");
const { getZigZagFromZig, getZigFromName, getUserCredentialInfo, getServiceId } = require("../../pocketbase/database");
const {fetchWebApi} = require("../../zag/Spotify/addSongIntoPlaylist");

async function getTopArtists(token) {
    const response = await fetchWebApi('v1/me/top/artists?limit=10&offset=0', "GET", token);
    console.log(response);
    const artist = response.items[Math.floor(Math.random() * response.items.length)];
  
    return artist;
}
  
async function getNewArtist(token) {  //  RECOMMANDE 1 NOUVEL ARTISTE
    const randomArtist = await getTopArtists(token);
    console.log(randomArtist)
    let infos = `Voici un artiste qui pourrait vous plaire selon ${randomArtist.name}: \n\n`
  
    const response = await fetchWebApi(`v1/artists/${randomArtist.id}/related-artists`, "GET", token);
    const artist = response.artists[Math.floor(Math.random() * response.artists.length)];
  
    infos += `${artist.name}  (${artist.external_urls.spotify})`;
  
    return "infos";
}

async function suggestAllArtist() {
    const suggestArtistZig = await getZigFromName("Vous recommande 1 nouvel artiste chaque jour");
    const all_zigzag = await getZigZagFromZig(suggestArtistZig.items[0].id);
    const spotifyId = await getServiceId("Spotify");
    let token, response;

    if (!all_zigzag.items) {
        console.log("there is no zigzag with suggest artist= " + all_zigzag)
        return;
    }

    all_zigzag.items.map(async(element) =>  {
        token = await getUserCredentialInfo(element.owner_id, spotifyId);
        if (token) {
            response = await getNewArtist(token.encrypted_credentials);
        } else
            console.log("cannot have spotify token")
        if (response) 
            // launchZag(all_zigzag[index].zag_id, all_zigzag[index].user_id, {message: response});
            console.log(response)
    })
}

module.exports = {
    suggestAllArtist
}