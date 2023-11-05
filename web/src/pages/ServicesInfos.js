import React, { useEffect, useState } from 'react';
import styles from '../../public/styles/servicesInfo.module.scss';
import {fetchServicesForConnectedUsers, fetchZagData, fetchZigData, getServiceIcon} from '@/auth/pocketbase';
import ZigZagSlider from "@/components/ZigZagSlider";
import { handleCredentials } from "@/auth/ServiceCredentials";
import Cookies from "js-cookie";

const ServicesInfos = ({ service, setSelectedService }) => {

    const isLogged = !!Cookies.get('userId');

    useEffect(() => {
        if (!isLogged) {
            window.location.href = '/Login';
        }
    }, []);

    if (!service) {
        return;
    }

    const selectedServiceId = service.id;
    const [zigData, setZigData] = useState([]);
    const [zagData, setZagData] = useState([]);
    const [connectedServices, setConnectedServices] = useState([]);

    useEffect(() => {
        if (selectedServiceId) {
            fetchZigData(selectedServiceId).then((zigResult) => {
                setZigData(zigResult);
            });
            fetchZagData(selectedServiceId).then((zagResult) => {
                setZagData(zagResult);
            });
        }
    }, [selectedServiceId]);

    useEffect(() => {
        fetchServicesForConnectedUsers().then((serviceResult) => {
            setConnectedServices(serviceResult);
        });
    }, []);

    const isServiceConnected = connectedServices.some((connectedService) => connectedService.id === selectedServiceId);

    return (
        <div className={styles.serviceInfoContainer}>
            <div className={styles.headerContainer} style={{ background: service.color }}>
                <button onClick={() => setSelectedService(false)}>
                    <span>Back</span>
                    <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0"/>
                    </svg>
                </button>
                <div className={styles.headerContent}>
                    <h1>Trigger & Actions</h1>
                </div>
            </div>
            <div className={styles.serviceInfoContent} style={{ background: service.color }}>
                <div className={styles.serviceInfoCard}>
                    <div className={styles.serviceIconName}>
                        <img
                            src={getServiceIcon(service)}
                            alt="ServiceIcon"
                            className={styles.serviceIcon}
                        />
                        <h2>{service.name}</h2>
                    </div>
                </div>
                <div className={styles.buttonConnectContainer}>
                    <span className={styles.mas} style={{ marginTop: isServiceConnected ? '10px' : '17px' }}>{isServiceConnected ? 'Already Connected' : 'Connect'}</span>
                    <button id='work' type="button" name="Hover" disabled={isServiceConnected} style={{cursor: isServiceConnected ? "" : "pointer"}} onClick={() => handleCredentials(service)}>
                        {isServiceConnected ? 'Already Connected' : 'Connect'}
                    </button>
                </div>
            </div>
            <div className={styles.serviceZigsZags}>
                <h3 style={{ color: service.color }}>Trigger</h3>
                <ZigZagSlider elements={zigData} color={service.color} />
                <h3 style={{ color: service.color }}>Actions</h3>
                <ZigZagSlider elements={zagData} color={service.color} />
            </div>
        </div>
    );
};

export default ServicesInfos;
