import React from 'react';
import styles from "../../public/styles/searchBar.module.scss";

function SearchBar( {searchValue, handleSearchChange} ) {
    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Search services"
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                    value={searchValue}
                />
            </div>
        </div>
    );
}

export default SearchBar;