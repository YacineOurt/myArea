import React from 'react';
import styles from "../../public/styles/profile.module.scss";

const ProfileButtons = ({ name, link }) => (
    <div className={styles.navButton}>
        <a href={link} className={styles.btn}>
            <svg width="277" height="62">
                <defs>
                    <linearGradient id="grad2">
                        <stop offset="0%" stopColor="#A3B0A0" />
                        <stop offset="100%" stopColor="#232323" />
                    </linearGradient>
                </defs>
                <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad2)" width="266" height="50" />
            </svg>
            <span>{name}</span>
        </a>
    </div>
);

export default ProfileButtons;
