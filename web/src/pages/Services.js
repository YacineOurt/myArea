import React, { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import styles from '../../public/styles/services.module.scss';
import {getServiceIcon, fetchServiceData, fetchServicesForConnectedUsers} from "@/auth/pocketbase";
import 'font-awesome/css/font-awesome.min.css';
import ServicesInfos from "@/pages/ServicesInfos";
import SearchBar from "@/components/SearchBar";
import Cookies from "js-cookie";

const Services = () => {
    const [serviceData, setServiceData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedService, setSelectedService] = useState(false);

    const isLogged = !!Cookies.get('userId');

    useEffect(() => {

        if (!isLogged) {
            window.location.href = '/Login';
        }

        fetchServiceData().then((serviceResult) => {
            setServiceData(serviceResult);
        });
    }, []);

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleServiceClick = (service) => {
        setSelectedService(service);
    };

    const filteredServices = serviceData.filter((service) => {
        return service.name.toLowerCase().includes(searchValue.toLowerCase());
    });

    let content;

    if (selectedService) {
        content = (
            <ServicesInfos service={selectedService} setSelectedService={setSelectedService} />
        );
    } else {
        content = (
            <Layout>
                <div className={styles.servicesContainer}>
                    <h2 className={styles.servicesHeading}>Choose a service</h2>
                    <SearchBar searchValue={searchValue} handleSearchChange={handleSearchChange} />
                    <div className={styles.servicesGrid}>
                        {filteredServices.map((service, index) => (
                            <div
                                onClick={() => handleServiceClick(service)}
                                key={index}
                                className={styles.serviceCard}
                                style={{ background: service.color }}
                            >
                                <div className={styles.cardContent}>
                                    <img src={getServiceIcon(service)} alt="ServiceIcon" />
                                    <h3>{service.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <>
            {content}
        </>
    );
};

export default Services;
