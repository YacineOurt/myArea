import PocketBase from "pocketbase";
import Cookies from 'js-cookie';

const url = process.env.NEXT_PUBLIC_POCKETBASE;
const client = new PocketBase(url);

export async function fetchData () {
    Cookies.set('userToken', client.authStore.token, { expires: 7, sameSite: 'None', secure: true })
    Cookies.set('userId', client.authStore.model.id, { expires: 7, sameSite: 'None', secure: true })
    Cookies.set('userCollectionId', client.authStore.model.collectionId, { expires: 7, sameSite: 'None', secure: true })
    Cookies.set('userName', client.authStore.model.name, { expires: 7, sameSite: 'None', secure: true })
    Cookies.set('userEmail', client.authStore.model.email, { expires: 7, sameSite: 'None', secure: true })
    Cookies.set('userAvatarLink', client.authStore.model.avatar, { expires: 7, sameSite: 'None', secure: true })
    Cookies.set('userAvatar', `${url}/api/files/${Cookies.get('userCollectionId')}/${Cookies.get('userId')}/${Cookies.get('userAvatarLink')}`, { expires: 7, sameSite: 'None', secure: true })
    Cookies.set('isOAuth', client.authStore.model.isOAuth, { expires: 7, sameSite: 'None', secure: true })
}

export async function fetchDataOAuth () {
    try {
        return await client.collection('users').listExternalAuths(
            client.authStore.model.id,
        );
    } catch (error) {
        console.error('Error fetching OAuth data:', error);
        return [];
    }
}

const isPngImage = (url) => {
    return /\.png$/.test(url);
};

export const getServiceIcon = (service) => {

    if (!service) {
        return '../assets/defaultIcon.png';
    }

    const iconUrl = `${url}/api/files/${service.collectionId}/${service.id}/${service.icon}`;

    if (isPngImage(iconUrl)) {
        return iconUrl;
    } else {
        return '../assets/defaultIcon.png';
    }
}

export const fetchUsersData = async () => {
    try {
        return await client.collection('users').getFullList({
            sort: '-created',
        });
    } catch (error) {
        console.error('Error fetching users data:', error);
        return [];
    }
}

export const fetchServiceData = async () => {
    try {
        return await client.collection('services').getFullList({
            sort: '-created',
        });
    } catch (error) {
        console.error('Error fetching service data:', error);
        return [];
    }
};

export const fetchConnectedServiceData = async () => {
    try {
        const filter = `user_id = '${Cookies.get('userId')}'`;
        return await client.collection('users_credentials').getFullList({
            sort: '-created',
            filter: filter,
        });
    } catch (error) {
        console.error('Error fetching connected service data:', error);
        return [];
    }
};

export const fetchServicesForConnectedUsers = async () => {
    try {
        const connectedServices = await fetchConnectedServiceData();

        const serviceIds = connectedServices.map(serviceId => serviceId.service_id);

        const filter = `(${serviceIds.map((id) => `id='${id}'`).join(' || ')})`;

        if (filter === '()') {
            return [];
        }

        return await client.collection('services').getFullList({
            filter: filter,
        });
    } catch (error) {
        console.error('Error fetching services for connected users:', error);
        return [];
    }
};

export const fetchZigZagForConnectedUsers = async () => {
    try {
        const filter = `owner_id = '${Cookies.get('userId')}'`;
        return await client.collection('zigzag').getFullList({
            sort: '-created',
            filter: filter,
        });
    } catch (error) {
        console.error('Error fetching zigzag data:', error);
        return [];
    }
}

export const fetchZigZagData = async () => {
    try {
        return await client.collection('zigzag').getFullList({
            sort: '-created',
        });
    } catch (error) {
        console.error('Error fetching zigzag data:', error);
        return [];
    }
}

export const fetchAllZigData = async () => {
    try {
        return await client.collection('zig').getFullList({
            sort: '-created',
        });
    } catch (error) {
        console.error('Error fetching zig data:', error);
        return [];
    }
}

export const fetchAllZagData = async () => {
    try {
        return await client.collection('zag').getFullList({
            sort: '-created',
        });
    } catch (error) {
        console.error('Error fetching zag data:', error);
        return [];
    }
}

export const fetchZigData = async (service_id) => {
    try {
        const filter = `service_id = '${service_id}'`;
        return await client.collection('zig').getFullList({
            sort: '-created',
            filter: filter,
        });
    } catch (error) {
        console.error('Error fetching zig data:', error);
        return [];
    }
}

export const fetchZagData = async (service_id) => {
    try {
        const filter = `service_id = '${service_id}'`;
        return await client.collection('zag').getFullList({
            sort: '-created',
            filter: filter,
        });
    } catch (error) {
        console.error('Error fetching zag data:', error);
        return [];
    }
}

export const postZigZagData = async (zig, zag) => {
    try {
        const data = {
            "isActive": true,
            "zig_id": zig.id,
            "zag_id": zag.id,
            "owner_id": Cookies.get('userId'),
            "metadata": "test"
        }
        await client.collection('zigzag').create(data);
    } catch (error) {
        console.error('Error posting zigzag data:', error);
        return [];
    }
}

export const getVlilleService = async () => {
    try {
        const filter = `name = 'VLille'`;
        return await client.collection('services').getFullList({
            filter: filter,
        });
    } catch (error) {
        console.error('Error fetching vlille service id:', error);
        return [];
    }
}

export const postLocalisation = async (localisation) => {

    const services = await getVlilleService();

    if (services.length > 0) {
        const service_id = services[0].id;
        const data = {
            "encrypted_credentials": localisation,
            "service_id": service_id,
            "user_id": Cookies.get('userId'),
            "refresh_token": "token",
        };
        await client.collection('users_credentials').create(data);
        window.location.href = '/Manager';
    }
}

export const postNewUserInfo = async (info) => {
    const data = new FormData();
    if (info.username) {
        data.append("username", info.username);
    }
    data.append("emailVisibility", true);
    if (info.name) {
        data.append("name", info.name);
    }
    if (info.avatar.length > 0) {
        data.append("avatar", info.avatar[0]);
    }

    const elementsToCheck = ["username", "avatar", "name"];
    let dataLength = 0;

    for (const elementName of elementsToCheck) {
        dataLength += data.getAll(elementName).length;
    }

    if (dataLength > 0) {
        const response = await client.collection('users').update(Cookies.get('userId'), data);
        window.location.href = '/Profile';
        return true;
    } else {
        return false;
    }
};

export const postNewEmail = async (info) => {
    try {
        await client.collection('users').authWithPassword(info.email, info.emailPassword);
        await client.collection('users').requestEmailChange(info.newEmail, {
            headers: {
                'Authorization': Cookies.get('userToken'),
            }
        });
        window.location.href = '/Profile';
        return false
    } catch (error) {
        console.log("Error: ", error);
        return true
    }
}

export const postNewPassword = async (info) => {
    const data = {
        "oldPassword": info.password,
        "password": info.newPassword,
        "passwordConfirm": info.confirmNewPassword
    };

    if (data.oldPassword && data.password && data.passwordConfirm) {
        await client.collection('users').update(Cookies.get('userId'), data);
        window.location.href = '/Profile';
        return true
    } else {
        return false
    }
}

export const postChangerDefaultPassword = async (info) => {
    try {
        const data = {
            "password": info.password,
            "passwordConfirm": info.confirmPassword,
            "oldPassword": 'password',
        };
        await client.collection('users').update(Cookies.get('userId'), data);
        window.location.href = '/Profile';
        return false
    } catch (error) {
        console.log("Error: ", error);
        return true
    }
}


export function getToken () {
    return client.authStore.token;
}

export async function logout() {
    await client.authStore.clear();
    Cookies.remove('userToken', { sameSite: 'None', secure: true });
    Cookies.remove('userModel', { sameSite: 'None', secure: true });
    Cookies.remove('userId', { sameSite: 'None', secure: true });
    Cookies.remove('userCollectionId', { sameSite: 'None', secure: true });
    Cookies.remove('userName', { sameSite: 'None', secure: true });
    Cookies.remove('userEmail', { sameSite: 'None', secure: true });
    Cookies.remove('userAvatarLink', { sameSite: 'None', secure: true });
    Cookies.remove('userAvatar', { sameSite: 'None', secure: true });
    window.location.href = '/Home';
}

export async function login(email, password) {
    await client.collection("users").authWithPassword(email, password);
    const userToken = getToken();
    Cookies.set('userToken', userToken, { expires: 7, sameSite: 'None', secure: true });
    await fetchData();
    window.location.href = '/Profile';
}

export async function registerUser(username, email, password) {
    const authData = {
        "username": username,
        "email": email,
        "emailVisibility": true,
        "password": password,
        "passwordConfirm": password,
        "name": username,
        "isOAuth": false
    };
    await client.collection("users").create(authData);
    await login(email, password);
}

export async function registerWithGoogle() {
    const authData = await client.collection('users').authWithOAuth2({ provider: 'google' });
    Cookies.set('userAccessToken', authData.meta.accessToken, { expires: 7, sameSite: 'None', secure: true });
    const data = {
        "isOAuth": true,
    }
    await fetchData();
    await client.collection('users').update(Cookies.get('userId'), data);
    window.location.href = '/Profile';
}

export async function deleteZigZag(id) {
    try {
        await client.collection('zigzag').delete(id);
        window.location.href = '/Manager';
    } catch (error) {
        console.error('Error deleting zigzag data:', error);
        return [];
    }
}

export async function deleteAccount() {
    try {
        const getUserZigZag = await fetchZigZagForConnectedUsers();
        for (const zigzag of getUserZigZag) {
            await client.collection('zigzag').delete(zigzag.id);
        }
        const getUserConnectedServices = await fetchConnectedServiceData();
        for (const service of getUserConnectedServices) {
            await client.collection('users_credentials').delete(service.id);
        }
        await client.collection('users').delete(Cookies.get('userId'));
        await logout();
    } catch (error) {
        console.error('Error deleting account:', error);
        return [];
    }
}
