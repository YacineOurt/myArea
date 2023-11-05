import React, {useEffect, useState} from 'react';
import styles from "../../public/styles/discover.module.scss";
import {fetchServicesForConnectedUsers, getServiceIcon} from "@/auth/pocketbase";

const ServicesDiscovery = ({ serviceData, setSelectedService, searchValue, currentFilter }) => {
    const handleServiceClick = (service) => {
        setSelectedService(service);
    };

    const divideServicesIntoRows = (services) => {
        const rows = [];
        for (let i = 0; i < services.length; i += 3) {
            rows.push(services.slice(i, i + 3));
        }
        return rows;
    };

    const filteredServices = serviceData.filter((service) => {
        return service.name.toLowerCase().includes(searchValue.toLowerCase()) && (currentFilter === 'All' || currentFilter === 'Services');
    });

    const [connectedServices, setConnectedServices] = useState([]);

    useEffect(() => {
        if (currentFilter === 'Services') {
            fetchServicesForConnectedUsers().then((serviceResult) => {
                setConnectedServices(serviceResult);
            });
        }
    }, []);

    const isServiceConnected = (service) => {
        return connectedServices.some((connectedService) => connectedService.id === service.id);
    }

    return (
        <div className={styles.serviceContainer}>
            <a>Many services</a>
            <div className={styles.serviceCardContainer}>
                {divideServicesIntoRows(filteredServices).map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.serviceRow}>
                        {row.map((service, index) => (
                            <div key={index} className={styles.serviceCard} style={{ background: service.color }}>
                                <img src={getServiceIcon(service)} alt="ServiceIcon" />
                                <h3>{service.name}</h3>
                                <button
                                    onClick={() => handleServiceClick(service)}
                                    className={isServiceConnected(service) ? styles.connectedButton : styles.connectButton}
                                    disabled={isServiceConnected(service)}
                                >
                                    {isServiceConnected(service) ? "Already Connected" : "Connect"}
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {filteredServices.length === 0 && (
                <p>No matching services found.</p>
            )}
        </div>
    );
};

export default ServicesDiscovery;
