import React, {useEffect, useState} from 'react';
import styles from "../../public/styles/discover.module.scss";
import {getServiceIcon} from "@/auth/pocketbase";

const ZigZagDiscoverCard = ({ zigId, zagId, allZigData, allZagData, serviceData }) => {

    const [services, setServices] = useState([]);
    const [zig, setZig] = useState([]);
    const [zag, setZag] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const matchingZig = allZigData.find((zigData) => zigData.id === zigId);
        const matchingZag = allZagData.find((zagData) => zagData.id === zagId);

        if (matchingZig && matchingZag) {
            setZig(matchingZig);
            setZag(matchingZag);

            const matchingZigServices = serviceData.filter((serviceData) => {
                return serviceData.id === matchingZig.service_id;
            });

            const matchingZagServices = serviceData.filter((serviceData) => {
                return serviceData.id === matchingZag.service_id;
            });

            const matchingServices = [...matchingZigServices, ...matchingZagServices];

            if (matchingServices.length === 2) {
                setServices(matchingServices);
                setIsLoading(false);
            }
        }
    }, [allZigData, allZagData, serviceData]);

    const [service1, service2] = services;

    const combinedDescription = `${zig.description} & ${zag.description}`;

    const maxDescriptionLength = 100;

    const truncatedDescription =
        combinedDescription.length > maxDescriptionLength
            ? combinedDescription.slice(0, maxDescriptionLength) + '...'
            : combinedDescription;

    const content = () => {
        if (isLoading) {
            return <div>Loading...</div>;
        } else {
            return (
                <div
                    style={{ background: `linear-gradient(208deg, ${service1.color} 1.03%, ${service2.color} 100%)` }}
                    className={styles.zigzagCard}
                >
                    <div className={styles.cardHeader}>
                        <img
                            src={getServiceIcon(service1)}
                            alt="Action"
                            className={styles.actionIcon}
                        />
                        <img
                            src={getServiceIcon(service2)}
                            alt="Reaction"
                            className={styles.reactionIcon}
                        />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.servicesName}>
                            {service1.name} - {service2.name}
                        </div>
                        <div className={styles.description}>
                            {truncatedDescription}
                        </div>
                    </div>
                </div>
            )
        }
    }

    return content();
};

export default ZigZagDiscoverCard;
