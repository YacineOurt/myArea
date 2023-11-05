import React, { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import styles from "../../public/styles/manager.module.scss";
import {
    fetchAllZagData,
    fetchAllZigData,
    fetchServicesForConnectedUsers,
    fetchZigZagForConnectedUsers
} from "@/auth/pocketbase";
import Link from "next/link";
import ServiceCredentials from "@/auth/ServiceCredentials";
import ZigZagCard from "@/components/ZigZagCard";
import Cookies from "js-cookie";

function Manager() {
    const [connectedServices, setConnectedServices] = useState([]);
    const [connectedZigZag, setConnectedZigZag] = useState([]);
    const [allZigData, setAllZigData] = useState([]);
    const [allZagData, setAllZagData] = useState([]);

    const isLogged = !!Cookies.get('userId');

    useEffect(() => {

        if (!isLogged) {
            window.location.href = '/Login';
        }

        fetchServicesForConnectedUsers().then((serviceResult) => {
            setConnectedServices(serviceResult);
        });
        fetchZigZagForConnectedUsers().then((zigzagResult) => {
            setConnectedZigZag(zigzagResult);
        });
        fetchAllZigData().then((zigResult) => {
            setAllZigData(zigResult);
        });
        fetchAllZagData().then((zagResult) => {
            setAllZagData(zagResult);
        });
    }, []);

    ServiceCredentials();

    const groupSize = 3;
    const groupedServices = [];
    for (let i = 0; i < connectedServices.length; i += groupSize) {
        groupedServices.push(connectedServices.slice(i, i + groupSize));
    }

    const groupedZigZags = [];
    for (let i = 0; i < connectedZigZag.length; i += groupSize) {
        groupedZigZags.push(connectedZigZag.slice(i, i + groupSize));
    }

    return (
        <Layout>
            <div className={styles.managerContainer}>
                <h1 className={styles.managerHeading}>Manager</h1>
                <p>Welcome to your manager page</p>
            </div>
            <div className={styles.boxContainer}>
                <h2 className={styles.boxHeading}>My ZigZag</h2>
                <div className={styles.boxRow}>
                    <Link href="/Dashboard" className={styles.serviceCardAdd}>
                        <div className={styles.addServiceCircle}>
                            <span className={styles.addServicePlus}>+</span>
                        </div>
                        <p>Create ZigZag</p>
                    </Link>
                </div>
                <div className={styles.grid}>
                    {groupedZigZags.map((group, index) => (
                        <div key={index} className={styles.zigzagRow}>
                            {group.map((zigzag) => (
                                <div key={zigzag.id}>
                                    <ZigZagCard zigZagId={zigzag.id} zigId={zigzag.zig_id} zagId={zigzag.zag_id} allZigData={allZigData} allZagData={allZagData} connectedServices={connectedServices} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.boxContainer}>
                <h2 className={styles.boxHeading}>Services Connected </h2>
                <div className={styles.boxRow}>
                    <Link href="/Services" className={styles.serviceCardAdd}>
                        <div className={styles.addServiceCircle}>
                            <span className={styles.addServicePlus}>+</span>
                        </div>
                        <p>Add Service</p>
                    </Link>
                </div>
                <div className={styles.grid}>
                    {groupedServices.map((group, index) => (
                        <div key={index} className={styles.serviceRow}>
                            {group.map((service) => (
                                <div
                                    key={service.id}
                                    className={styles.serviceCard}
                                    style={{ backgroundColor: service.color }}
                                >
                                    <h3>{service.name}</h3>
                                    <p>{service.description}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Manager;
