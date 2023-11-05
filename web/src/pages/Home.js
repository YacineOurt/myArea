"use client";
import React, {Suspense, useState, useEffect, useRef} from 'react';
import Layout from "@/components/Layout";
import styles from "../../public/styles/home.module.scss";
import card from "../../public/styles/confirmCard.module.scss";
import {
    fetchServiceData,
    fetchAllZagData,
    fetchAllZigData,
    getServiceIcon, fetchZigZagData
} from "@/auth/pocketbase";

const loadingMarkup = (
    <div className="py-4 text-center">
        <h3>Loading..</h3>
    </div>
)
function Home() {

    const [services, setServices] = useState([]);
    const [zig, setZig] = useState([]);
    const [zag, setZag] = useState([]);
    const [serviceZigZag, setServiceZigZag] = useState([]);
    const containerWidth = 1200;
    const serviceWidth = 300;
    const containerRef = useRef(null);

    const loadServices = () => {
        fetchServiceData().then((data) => {
            setServices((prevServices) => {
                const duplicatedServices = [...prevServices];
                const servicesPerContainer = Math.ceil(containerWidth / serviceWidth);
                for (let i = 0; i < servicesPerContainer; i++) {
                    duplicatedServices.push(...data);
                }
                return duplicatedServices;
            });

            const firstId = 'g1u8zib33v0rxih';
            const secondId = '3pn14rkiav4m1pc';
            const thirdId = 'gboo0aypxx91aiq';
            const combinedServiceZigZag = [];

            data.map((serviceData) => {
                if (serviceData.id === firstId) {
                    combinedServiceZigZag.push(serviceData);
                }
                if (serviceData.id === secondId) {
                    combinedServiceZigZag.push(serviceData);
                }
                if (serviceData.id === thirdId) {
                    combinedServiceZigZag.push(serviceData);
                }
            });

            setServiceZigZag(combinedServiceZigZag);
        });
    };


    const loadZigZag = () => {
        const firstId = "d6gguxdf5x2uyje";
        const secondId = "s6xvrs7c5py7uti";

        fetchZigZagData().then((data) => {
            const combinedZigZag = [];

            data.map((zigZagData) => {
                if (zigZagData.id === firstId) {
                    combinedZigZag.push(zigZagData);
                }
                if (zigZagData.id === secondId) {
                    combinedZigZag.push(zigZagData);
                }
            });

            loadZig(combinedZigZag);
            loadZag(combinedZigZag);
        });
    };

    const loadZig = (combinedZigZag) => {
        fetchAllZigData().then((data) => {
            const combinedZig = [];

            data.map((zigData) => {
                if (combinedZigZag[0] && combinedZigZag[0].zig_id &&
                    zigData && zigData.id && zigData.id === combinedZigZag[0].zig_id) {
                    combinedZig.push(zigData);
                }
                if (combinedZigZag[1] && combinedZigZag[1].zig_id &&
                    zigData && zigData.id && zigData.id === combinedZigZag[1].zig_id) {
                    combinedZig.push(zigData);
                }
            });

            setZig(combinedZig);
        });
    };


    const loadZag = (combinedZigZag) => {
        fetchAllZagData().then((data) => {
            const combinedZag = [];

            data.map((zagData) => {
                if (combinedZigZag[0] && combinedZigZag[0].zag_id &&
                    zagData && zagData.id && zagData.id === combinedZigZag[0].zag_id) {
                    combinedZag.push(zagData);
                }
                if (combinedZigZag[1] && combinedZigZag[1].zag_id &&
                    zagData && zagData.id && zagData.id === combinedZigZag[1].zag_id) {
                    combinedZag.push(zagData);
                }
            });

            setZag(combinedZag);
        });
    }

    useEffect(() => {
        loadServices();
        loadZigZag();
    }, []);

    const handleScroll = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            if (container.scrollLeft === 0) {
                loadServices();
            }
        }
    };

    return (
        <Suspense fallback={loadingMarkup}>
            <Layout>
                <div className={styles.mainContent}>
                    <div className={styles.textContainer}>
                        <h1 className={styles.heading}>
                            Enhance Achievement Through Automation
                        </h1>
                        <p className={styles.description}>
                            Create tailored automated workflows designed to suit your specific role and business needs
                        </p>
                    </div>
                    <img className={styles.heroImage} src="../assets/hero.png" alt="Hero" />
                </div>
                <div className={styles.separator} />
                <div className={styles.featuresContainer}>
                    <div className={styles.featureTextContainer}>
                        <h1 className={styles.featureText}>
                            The foremost mobile no-code platform
                        </h1>
                        <p>
                            Enable automation from any location, at any time.
                            Simplify tasks with our iOS and Android apps
                        </p>
                        <h1 className={styles.featureText}>
                            The strength of connectivity
                        </h1>
                        <p>
                            Transform your business and home apps to serve your needs
                        </p>
                    </div>
                    <div
                        className={styles.container}
                        ref={containerRef}
                        onScroll={handleScroll}
                    >
                        {services.length === 0 ? (
                            <p>No services available at the moment</p>
                        ) : (
                            services.map((service, index) => (
                                <div
                                    key={index}
                                    className={styles.featureContainer}
                                    style={{ background: service.color }}
                                >
                                    <img
                                        className={styles.featureImage}
                                        src={getServiceIcon(service)}
                                        alt={service.name}
                                    />
                                    <h1 className={styles.featureTitle}>{service.name}</h1>
                                </div>
                            )))}
                    </div>
                    <div className={styles.featuresContainer}>
                        <div className={styles.featureTextContainer}>
                            <h1 className={styles.featureText}>
                                There are countless ways to optimize and save time
                            </h1>
                        </div>
                    </div>
                    <div className={styles.ZigZagContainer}>
                        <div className={styles.zigZagCard}>
                            {(serviceZigZag.length > 2 && zig.length > 0 && zag.length > 0) && (
                                <div
                                    style={{
                                        background: `linear-gradient(208deg, ${serviceZigZag[1].color} 1.03%, ${serviceZigZag[0].color} 100%)`,
                                    }}
                                    className={card.actionReactionCard}
                                >
                                    <div className={card.cardHeader}>
                                        <img src={getServiceIcon(serviceZigZag[1])} alt="Action" className={card.actionIcon} />
                                        <img src={getServiceIcon(serviceZigZag[0])} alt="Reaction" className={card.reactionIcon} />
                                    </div>
                                    <div className={card.content}>
                                        <div className={card.servicesName}>
                                            {serviceZigZag[1].name} - {serviceZigZag[0].name}
                                        </div>
                                        <div className={card.description}>{zig[1].name} & {zag[0].name}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.featureTextContainer}>
                            <h1 className={styles.featureText}>Convert leads more efficiently and in record time</h1>
                            <p>Don't miss out on any opportunities. Automate, organize, and monitor every lead without fail</p>
                        </div>
                    </div>
                    <div className={styles.ZigZagContainer}>
                        <div className={styles.featureTextContainer}>
                            <h1 className={styles.featureText}>Share content simultaneously across various social networks</h1>
                            <p>Efficiently save time by composing content once and automating its distribution across multiple networks</p>
                        </div>
                        <div className={styles.cardZigZag}>
                            {(serviceZigZag.length > 2 && zig.length > 0 && zag.length > 0) && (
                                <div
                                    style={{
                                        background: `linear-gradient(208deg, ${serviceZigZag[2].color} 1.03%, ${serviceZigZag[1].color} 100%)`,
                                    }}
                                    className={card.actionReactionCard}
                                >
                                    <div className={card.cardHeader}>
                                        <img src={getServiceIcon(serviceZigZag[2])} alt="Action" className={card.actionIcon} />
                                        <img src={getServiceIcon(serviceZigZag[1])} alt="Reaction" className={card.reactionIcon} />
                                    </div>
                                    <div className={card.content}>
                                        <div className={card.servicesName}>
                                            {serviceZigZag[2].name} - {serviceZigZag[1].name}
                                        </div>
                                        <div className={card.description}>{zig[0].name} & {zag[1].name}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </Suspense>
    );
}

export default Home;
