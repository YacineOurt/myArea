"use client";
import React, { useEffect, useState } from 'react';
import styles from '../../public/styles/header.module.scss';
import Link from 'next/link';
import Cookies from 'js-cookie';
import HeaderLogout from "@/components/HeaderLogout";
import HeaderLogged from "@/components/HeaderLogged";
import {fetchData} from "@/auth/pocketbase";

function Header() {

    const [isTokenValid, setIsTokenValid] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            try {
                if (Cookies.get('userToken')) {
                    await fetchData();
                    setIsTokenValid(true);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        checkToken()
            .catch((error) => {
                console.error('Erreur lors de l\'exécution de checkToken :', error);
            });
    }, []);

    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerLogo}>
                <img
                    src="../assets/logoLight.png"
                    alt="Logo"
                    style={{ width: '100px', height: 'auto' }}
                />
            </div>
            <div className={styles.navListContainer}>
                <ul className={styles.navList}>
                    <Link href="/Discover" className={styles.link}>Discover</Link>
                    {isTokenValid ? <Link href="/Dashboard" className={styles.mainLink}>Dashboard</Link> : <Link href="/Home" className={styles.mainLink}>Home</Link>}
                    {isTokenValid ? <Link href="/Manager" className={styles.link}>Manager</Link> : <Link href="/Developers" className={styles.link}>Developers</Link>}
                </ul>
            </div>
            <div className={styles.buttonOrProfile}>
                {isTokenValid ? <HeaderLogged /> : <HeaderLogout />}
            </div>
        </div>
    );
}

export default Header;
