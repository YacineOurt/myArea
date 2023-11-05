import React, {useEffect} from 'react';
import Layout from "@/components/Layout";
import { logout, deleteAccount } from "@/auth/pocketbase";
import styles from '../../public/styles/settings.module.scss';
import Cookies from "js-cookie";

function Settings() {

    const isLogged = !!Cookies.get('userId');

    useEffect(() => {
            if (!isLogged) {
                window.location.href = '/Login';
            }
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    const handleDeleteAccount = async () => {
        await deleteAccount();
    }

    return (
        <Layout>
            <div className={styles.settingsContainer}>
                <h1 className={styles.title}>Settings</h1>
                <div className={styles.settings}>
                    <button onClick={handleLogout} className={styles.button} style={{ marginRight: '30px' }}>
                        Logout
                    </button>
                    <button onClick={handleDeleteAccount} className={styles.button}>
                        Delete Account
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default Settings;
