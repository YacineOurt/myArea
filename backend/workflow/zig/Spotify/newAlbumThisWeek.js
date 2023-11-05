const { launchZag } = require("../../handleZigzag");
const { getZigZagFromZig, getZigFromName, getUserCredentialInfo, getServiceId } = require("../../pocketbase/database");
const {fetchWebApi} = require("../../zag/Spotify/addSongIntoPlaylist");

async function getReleased(token) {  // RECUPERE LES 10 ALBUMS
    const response = await fetchWebApi('v1/browse/new-releases?limit=10', "GET", token, null);
    let infos = "Voici 10 albums sortis cette semaine : \n\n"
    response.albums.items.map( (data) => {
      infos += `${data.name.toUpperCase()} - \
      ${data.artists[0].name} \n\
      Date de sortie : ${data.release_date} \n\
      Nombre de tracks : ${data.total_tracks} \n\n`
    });
    infos += "Bonne écoute :)"
    return infos;
}

async function newAlbumThisWeek() {
  const suggestArtistZig = await getZigFromName("Récupère les 10 nouveaux albums de la semaine");
  const all_zigzag = await getZigZagFromZig(suggestArtistZig.items[0].id);
  const spotifyId = await getServiceId("Spotify");
  let token, response;

  if (!all_zigzag.items) {
      return;
  }

  all_zigzag.items.map(async(element) =>  {
      token = await getUserCredentialInfo(element.owner_id, spotifyId);
      if (token) {
          response = await getReleased(token.encrypted_credentials);
      } else
          console.log("cannot have spotify token")
      if (response) 
          launchZag(element.zag_id, element.owner_id, {message: response});
  })
}

module.exports = {
  getReleased,
  newAlbumThisWeek
}