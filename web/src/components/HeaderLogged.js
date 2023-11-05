import React from 'react';
import styles from '../../public/styles/headerLogged.module.scss';
import Link from "next/link";
import Cookies from "js-cookie";

const HeaderLogged = () => {

    const defaultImageUrl = '../assets/defaultUser.png';

    const userAvatar = Cookies.get('userAvatarLink') ? Cookies.get('userAvatar')  : defaultImageUrl;
    const userName = Cookies.get('userName') ? Cookies.get('userName') : "Name"

    return (
        <div className={styles.headerLoggedContainer}>
            <span className={styles.userName}>{userName}</span>
            <Link href="/Profile" className={styles.profileButton}>
                <div className={styles.profileImageContainer}>
                    <img
                        src={userAvatar}
                        alt="User Profile"
                        className={styles.profileImage}
                    />
                </div>
            </Link>
        </div>
    );
}

export default HeaderLogged;
