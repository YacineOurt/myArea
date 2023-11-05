import React from 'react';
import Link from 'next/link';
import styles from '../../public/styles/footer.module.scss';

function Footer() {
    return (
        <footer className={styles.footerStyle}>
            <div className={styles.footerContainer}>
                <div className={styles.headerLogo}>
                    <img
                        src="../assets/logoLight.png"
                        alt="Logo"
                        style={{ width: '100px', height: 'auto' }}
                    />
                </div>
                <div className={styles.footerContent}>
                    <div className={styles.footerText}>
                        &copy; 2023 ZigZag Inc.
                    </div>
                    <div className={styles.footerLinks}>
                        <span className={styles.separator}>|</span>
                        <Link href="/Contact" className={styles.link}>Contact</Link>
                        <span className={styles.separator}>|</span>
                        <Link href="/Privacy" className={styles.link}>Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
