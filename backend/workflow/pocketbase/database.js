const axios = require("axios");

async function setDiscordCredential(user) {
    if (!user.items[0].id) {
        console.log("Cannot set discord Credential: user is missing");
    } else {
        postUserCredentials("fake token", "fake refresh token", user.items[0].id, await getServiceId("Discord"));
    }
}

async function postUserCredentials(token, refresh_token, user_id, service_id){
    const data = {
        "encrypted_credentials": token,
        "service_id": service_id,
        "user_id": user_id,
        "refresh_token": refresh_token
    };
    try {
        const response = await axios({
            method: 'post',
            url: process.env.NODE_APP_POCKETBASE_URL + "/collections/users_credentials/records",
            headers: {},
            data
        });
        return true;
    } catch (error) {
        console.log('cannot push token in db: ' + error.message);
        return false;
    }
    return true;
}


async function postNewToken(new_token, user_id, service_id) {
    const user_credentials_info = await getUserCredentialInfo(user_id, service_id);
    if (user_credentials_info == null) {
        console.log("post new token had userCredential record id by getUserCredentialInfo");
        return null;
    }
    const url = `${process.env.NODE_APP_POCKETBASE_URL}/collections/users_credentials/records/${user_credentials_info.id}`
    const data = {
        "encrypted_credentials":new_token
    }
    try {
        const response = await axios.patch(url, data);
    } catch(error) {
        console.log("Cannot update user token " + error.message);
    }
}

async function getUserCredentialInfo(user_id, service_id) {
    try {
        const url = `${process.env.NODE_APP_POCKETBASE_URL}/collections/users_credentials/records?filter=`
        const str = `(service_id="${service_id}"&&user_id="${user_id}")`;
        const option = encodeURIComponent(str);
        const response = await axios.get(url + option);
        if (response.data.totalItems > 0) {
            const new_token = response.data.items[0];
            return new_token;
        }
        else {
            console.log("cannot get token with userid: " + user_id + " service_id: " + service_id)
            return null;
        }
    } catch(error) {
        console.log("Cannot get refresh token: " + error.message);
    }
}

async function getUserFromEmail(email) {
    try {
        const url = `${process.env.NODE_APP_POCKETBASE_URL}/collections/users/records?filter=`
        const str = `(email="${email}")`;
        const option = encodeURIComponent(str);
        const response = await axios.get(url + option);
        if (response.data.totalItems > 0) {
            const mail = response.data.items[0];
            return mail;
        }
        else
            return null;
    } catch(error) {
        console.log("Cannot get user from email: " + error.message);
    }
}


async function setZigZagToTrue(zigzag_to_set_true) {
    let data = JSON.stringify({
        "isActive": true
    });
    
    let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: '',
        headers: { 
            'Content-Type': 'application/json'
        },
        data: data
    };

    zigzag_to_set_true.forEach(zigzag => {
        config.url = `${process.env.NODE_APP_POCKETBASE_URL}/collections/zigzag/records/${zigzag.id}`;
        axios.request(config)
        .then((response) => {
            console.log("Set zigzag " + zigzag.id + " to true")
        })
        .catch((error) => {
            console.log(error);
        });
    });
}


async function getZigZagFromZig(id) {
    const url = `${process.env.NODE_APP_POCKETBASE_URL}/collections/zigzag/records?filter=(zig_id="${id}")`
    let config = {
      method: 'GET',
      url: url
    };
    const response = await axios.request(config)
    
    if (response.data.totalItems > 0) {
        return response.data
    } else {        
        console.log("there is no zigzag with this id: " + id);
        return null;
    }
}

async function getServiceId(service) {
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/services/records?filter=name%3D"${service}"`,
            headers: {}
        };

        const response = await axios.request(config);

        if (response.data.totalItems === 1) {
            return response.data.items[0].id;
        } else {
            console.log("Unable to get service id: " + service);
            return null;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function setDiscordWaiting(userId)
{
    try {
        const data = {
            "discord_id": "discord_waiting"
        };

        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/users/records/${userId}`,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
        };
      
        const response = await axios.request(config);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getUserInfo(userId) {
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/users/records/${userId}`,
            headers: { }
        };
      
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.log("cannot get user info from user id" + error);
        return null;
    }
}

async function setMetadata(zigzag, metadata) {
    try {
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/zigzag/records/${zigzag.id}`,
            headers: { },
            data: {
                "metadata" : metadata
            }
        };
      
        const response = await axios.request(config);
        return response.status;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getUserWaitingForDiscord() {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/users/records?filter=discord_id%3D"discord_waiting"`,
        headers: {}
    };

    try {
        const response = await axios.request(config);
        return response.data.items[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function setDiscordInfo(discordId, discordChannel) {
    const waitingDiscord = await getUserWaitingForDiscord();

    if (!waitingDiscord) {
        console.log("Error: No user found waiting for Discord.");
        return false;
    }

    const data = {
        "discord_id": discordId,
        "discord_channel": discordChannel
    }
    let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/users/records/${waitingDiscord.id}`,
        headers: { 
            'Content-Type': 'application/json'
        },
        data: data
    };
    
    try {
        const response = await axios.request(config);
        if (response.status == 200) {
            const discordServiceId = await getServiceId("Discord");
            postUserCredentials("fake token", "fake refresh token", waitingDiscord.id, discordServiceId);
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getZagFromName(zag_name) {
    const encoded_zag_name = encodeURI(zag_name)
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/zag/records?filter=name%3D"${encoded_zag_name}"`,
        headers: { }
    };
    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error("Error in getZagFromName:", error.response?.data || error.message);
        throw error;
    }
    
}

async function getZigFromName(zig_name) {
    const encoded_zig_name = encodeURI(zig_name)
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/zig/records?filter=name%3D"${encoded_zig_name}"`,
        headers: { }
    };
    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error("Error in getZigFromName:", error.response?.data || error.message);
        throw error;
    }
    
}

async function getZagFromName(zag_name) {
    const encoded_zag_name = encodeURI(zag_name)
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/zag/records?filter=name%3D"${encoded_zag_name}"`,
        headers: { }
    };
    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error("Error in getZagFromName:", error.response?.data || error.message);
        throw error;
    }
    
}

async function getZagFromZigAndUser(user_id, zig_id)
{
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.NODE_APP_POCKETBASE_URL}/collections/zigzag/records?filter=(owner_id%3D"${user_id}"%20%26%26%20zig_id%3D"${zig_id}")`,
            headers: { }
        };
        
        const response = await axios.request(config);
        return response.data;
    } catch(error) {
        console.log(error.response.data);
    }
}

async function getUsersConnectedToAService(serviceName) {
    const serviceId = await getServiceId(serviceName);
    const url = `${process.env.NODE_APP_POCKETBASE_URL}/collections/users_credentials/records?filter=(service_id%3D"${serviceId}")`
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: url,
            headers: { }
        };
        
        const response = await axios.request(config);
        return response.data;
    } catch(error) {
        console.log("Cannot get users connected to service: ", serviceName, error.message);
    }
}

async function getChannelFromUserId(userId) {
    const url = `${process.env.NODE_APP_POCKETBASE_URL}/collections/users/records/${userId}`
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: url,
            headers: { }
        };
        
        const response = await axios.request(config);
        if (response.status == 200) {
            return response.data.discord_channel;
        } else {
            console.log("Cannot get channel from user id" + response.status);
            return null;
        }
    } catch(error) {
        console.log("Cannot get channel from userId: ", error.message);
    }
}

async function getDiscordIdFromUserId(userId) {
    const url = `${process.env.NODE_APP_POCKETBASE_URL}/collections/users/records/${userId}`
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: url,
            headers: { }
        };
        
        const response = await axios.request(config);
        if (response.status == 200) {
            return response.data.discord_id;
        } else {
            console.log("Cannot get discord from user id: " + response.status);
            return null;
        }
    } catch(error) {
        console.log("Cannot get discord from userId: ", error.message);
    }
}

async function getAdressFromUserId(user_id) {
    try {
        const service_id = await getServiceId(`VLille`);
        const adress = await getUserCredentialInfo(user_id, service_id);
        if (adress!= null) {
            return adress.encrypted_credentials;
        } else {
            return null;
        }
    } catch(e) {
        console.log("Get adress from user id error: " + e.message);
    }
}

module.exports={
    postUserCredentials, 
    getUserCredentialInfo,
    postNewToken,
    getZigZagFromZig,
    getServiceId,
    setDiscordInfo,
    setDiscordWaiting,
    getZigFromName,
    getZagFromZigAndUser,
    getUsersConnectedToAService,
    getChannelFromUserId,
    getDiscordIdFromUserId,
    getUserInfo,
    getZagFromName,
    getAdressFromUserId,
    getUserFromEmail,
    setDiscordCredential
}