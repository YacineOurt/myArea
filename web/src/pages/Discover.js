import React, { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import styles from "../../public/styles/discover.module.scss";
import SearchBar from "@/components/SearchBar";
import DiscoverNavBar from "@/components/DiscoverNavBar";
import ServicesDiscovery from "@/components/ServicesDiscovery";
import ZigzagDiscovery from "@/components/ZigZagDiscovery";
import ServicesInfos from "@/pages/ServicesInfos";
import {fetchServiceData, fetchZigZagData} from "@/auth/pocketbase";

function Discover() {
    const [searchValue, setSearchValue] = useState('');
    const [currentFilter, setCurrentFilter] = useState('All');
    const [selectedService, setSelectedService] = useState(null);
    const [serviceData, setServiceData] = useState([]);
    const [zigZagData, setZigZagData] = useState([]);

    useEffect(() => {
        fetchServiceData().then((serviceResult) => {
            setServiceData(serviceResult);
        });
        fetchZigZagData().then((zigzagResult) => {
            setZigZagData(zigzagResult);
        });
    }, []);

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    let content;

    if (selectedService) {
        content = (
            <ServicesInfos service={selectedService} setSelectedService={setSelectedService} />
        )
    } else {
        content = (
            <Layout>
                <div className={styles.discoverContainer}>
                    <h1>Discover</h1>
                    <DiscoverNavBar currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />
                    <SearchBar searchValue={searchValue} handleSearchChange={handleSearchChange} />
                    {currentFilter === 'All' && (
                        <>
                            <ZigzagDiscovery  serviceData={serviceData} zigZagData={zigZagData} searchValue={searchValue} currentFilter={currentFilter} />
                            <ServicesDiscovery serviceData={serviceData} setSelectedService={setSelectedService} searchValue={searchValue} currentFilter={currentFilter} />
                        </>
                    )}

                    {currentFilter === 'ZigZag' && (
                        <ZigzagDiscovery serviceData={serviceData} zigZagData={zigZagData} searchValue={searchValue} currentFilter={currentFilter} />
                    )}

                    {currentFilter === 'Services' && (
                        <ServicesDiscovery serviceData={serviceData} setSelectedService={setSelectedService} searchValue={searchValue} currentFilter={currentFilter} />
                    )}
                </div>
            </Layout>
        );
    }

    return (
        <>
            {content}
        </>
    );
}

export default Discover;
