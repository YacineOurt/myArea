import React from 'react';
import styles from "../../public/styles/headerLogout.module.scss";
import Link from "next/link";

function HeaderLogout() {
    return (
        <div className={styles.buttonsContainer}>
            <Link href="/Login" className={styles.logInButton}>Log In</Link>
            <Link href="/Register" className={styles.getStartedButton}>Get Started</Link>
        </div>
    );
}

export default HeaderLogout;