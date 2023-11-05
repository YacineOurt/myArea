import React, {useEffect, useState} from 'react';
import styles from "../../public/styles/discover.module.scss";
import ZigZagDiscoverCard from "@/components/ZigZagDiscoverCard";
import {fetchAllZagData, fetchAllZigData, fetchServiceData} from "@/auth/pocketbase";

const ZigZagDiscovery = ( { serviceData, zigZagData, searchValue, currentFilter } ) => {

    const [allZigData, setAllZigData] = useState([]);
    const [allZagData, setAllZagData] = useState([]);

    useEffect(() => {
        fetchAllZigData().then((zigResult) => {
            setAllZigData(zigResult);
        });
        fetchAllZagData().then((zagResult) => {
            setAllZagData(zagResult);
        });
    }, []);
    const divideZigZagIntoRows = (zigzags) => {
        const rows = [];
        for (let i = 0; i < zigzags.length; i += 3) {
            rows.push(zigzags.slice(i, i + 3));
        }
        return rows;
    };

    const filteredZigZag = zigZagData.filter((zigzag) => {
        return zigzag.id.toLowerCase().includes(searchValue.toLowerCase()) && (currentFilter === 'All' || currentFilter === 'ZigZag');
    });

    return (
        <div className={styles.zigZagContainer}>
            <a>The limits of ZigZags are imagination</a>
            <div className={styles.serviceCardContainer}>
                {divideZigZagIntoRows(filteredZigZag).map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.serviceRow}>
                        {row.map((zigzag, index) => (
                            <div key={index}>
                                <ZigZagDiscoverCard zigId={zigzag.zig_id} zagId={zigzag.zag_id} allZigData={allZigData} allZagData={allZagData} serviceData={serviceData} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {filteredZigZag.length === 0 && (
                <p>No matching zigzag found.</p>
            )}
        </div>
    );
};

export default ZigZagDiscovery;