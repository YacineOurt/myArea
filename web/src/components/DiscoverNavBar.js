import React from 'react';
import styles from '../../public/styles/discoverNavBar.module.scss';

const DiscoverNavBar = ({ currentFilter, setCurrentFilter }) => {
    const handleCategoryClick = (category) => {
        setCurrentFilter(category);
    };

    return (
        <nav className={styles.nav}>
            <ul className={styles.ul}>
                <li className={styles.li}>
                    <button
                        className={`${styles.button} ${currentFilter === 'All' ? styles.active : ''}`}
                        onClick={() => handleCategoryClick('All')}
                    >
                        All
                    </button>
                </li>
                <li>
                    <button
                        className={`${styles.button} ${currentFilter === 'ZigZag' ? styles.active : ''}`}
                        onClick={() => handleCategoryClick('ZigZag')}
                    >
                        ZigZag
                    </button>
                </li>
                <li>
                    <button
                        className={`${styles.button} ${currentFilter === 'Services' ? styles.active : ''}`}
                        onClick={() => handleCategoryClick('Services')}
                    >
                        Services
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default DiscoverNavBar;
