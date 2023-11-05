import React, { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import styles from "../../public/styles/profile.module.scss";
import ProfileButtons from "@/components/ProfileButtons";
import Cookies from "js-cookie";

const Profile = () => {
    const defaultImageUrl = '../assets/defaultUser.png';

    const [userName, setUserName] = useState("Name");
    const [userEmail, setUserEmail] = useState("Email");
    const [userAvatar, setUserAvatar] = useState(defaultImageUrl);

    const isLogged = !!Cookies.get('userId');

    useEffect(() => {

        if (!isLogged) {
            window.location.href = '/Login';
        }

        const newName = Cookies.get('userName') ? Cookies.get('userName') : "Name";
        const newEmail = Cookies.get('userEmail') ? Cookies.get('userEmail') : "Email";
        setUserAvatar(Cookies.get('userAvatarLink') ? Cookies.get('userAvatar') : defaultImageUrl);

        setUserName(newName);
        setUserEmail(newEmail);
    }, []);

    return (
        <Layout>
            <div className={styles.profileContainer}>
                <img
                    src={userAvatar}
                    alt="User Profile"
                    className={styles.profileImage}
                />
                <div className={styles.profileInfo}>
                    <h2>{userName}</h2>
                    <p>{userEmail}</p>
                </div>
                <div className={styles.editContainer}>
                    <ProfileButtons name={"Edit Profile"} link={"/Edit"} />
                </div>
            </div>
            <div className={styles.navContainer}>
                <ProfileButtons name={"Manager"} link={"/Manager"} />
                <ProfileButtons name={"Dashboard"} link={"/Dashboard"} />
                <ProfileButtons name={"Settings"} link={"/Settings"}/>
            </div>
        </Layout>
    );
}

export default Profile;
