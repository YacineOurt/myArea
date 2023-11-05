import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ServiceCard from "@/components/ServiceCard";
import ZigZag from "@/components/ZigZag";
import ConfirmCard from "@/components/ConfirmCard";
import "swiper/css";
import "swiper/css/effect-coverflow";
import styles from "../../public/styles/carousel.module.scss";
import {
    fetchServicesForConnectedUsers,
    fetchZigData,
    fetchZagData,
} from "@/auth/pocketbase";

const Carousel = ({ selectedServices, setSelectedServices, selectedZig, setSelectedZig, selectedZag, setSelectedZag, searchTerm, currentStep, updateStep }) => {
    const [serviceData, setServiceData] = useState([]);
    const [zigData, setZigData] = useState([]);
    const [zagData, setZagData] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [onlyServiceZig, setOnlyServiceZig] = useState([]);
    const [onlyServiceZag, setOnlyServiceZag] = useState([]);
    let [cardsToMap, setCardsToMap] = useState([]);

    const stepToCardType = {
        1: ServiceCard,
        2: ZigZag,
        3: ServiceCard,
        4: ZigZag,
    };

    useEffect(() => {
        if (selectedServices.length > 0) {
            if (currentStep === 2) {
                fetchZigData(selectedServices[0].id).then((zigResult) => {
                    setZigData(zigResult);
                });
            }
            if (currentStep === 4) {
                fetchZagData(selectedServices[1].id).then((zagResult) => {
                    setZagData(zagResult);
                });
            }
        }
    }, [selectedServices, currentStep]);

    useEffect(() => {
        fetchServicesForConnectedUsers().then((serviceResult) => {
            setServiceData(serviceResult);
        });
    }, []);

    useEffect(() => {
        if (serviceData.length > 0) {
            const filtered = serviceData.filter((service) =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredServices(filtered);
        }
        if (zigData.length > 0) {
            const filtered = zigData.filter((zig) =>
                zig.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setOnlyServiceZig(filtered);
        }
        if (zagData.length > 0) {
            const filtered = zagData.filter((zag) =>
                zag.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setOnlyServiceZag(filtered);
        }
    }, [searchTerm, serviceData, zigData, zagData]);

    useEffect(() => {
        if (currentStep === 2) {
            setCardsToMap(onlyServiceZig);
        } else if (currentStep === 4) {
            setCardsToMap(onlyServiceZag);
        } else {
            setCardsToMap(filteredServices);
        }
    }, [currentStep, filteredServices, onlyServiceZig, onlyServiceZag]);

    const handleSwiperSlide = (card) => {
        return (
            card.length > 0 ? (
                card.map((elements) => (
                    <SwiperSlide key={elements.id}>
                        {currentStep <= 4 ? (
                            React.createElement(stepToCardType[currentStep], {
                                card: elements,
                                filteredServices: filteredServices,
                                zigZagData: currentStep === 2 ? zigData : zagData,
                                onlyServiceZigZag: currentStep === 2 ? onlyServiceZig : onlyServiceZag,
                                setOnlyServiceZigZag: currentStep === 2 ? setOnlyServiceZig : setOnlyServiceZag,
                                title: currentStep === 2 ? "Zig" : "Zag",
                                currentStep: currentStep,
                                updateStep: updateStep,
                                selectedServices: selectedServices,
                                setSelectedServices: setSelectedServices,
                                setSelectedZig: setSelectedZig,
                                setSelectedZag: setSelectedZag,
                            })
                        ) : (
                            <p key={elements.id}>Step not found.</p>
                        )}
                    </SwiperSlide>
                ))
            ) : (
                <p>Nothing found.</p>
            )
        );
    };

    const swiperSlides = handleSwiperSlide(cardsToMap);

    return (
        currentStep < 5 ? (
            <div className={styles.carouselContainer}>
                <Swiper spaceBetween={10} slidesPerView={4} loop={false} autoplay={false}>
                    {swiperSlides}
                </Swiper>
            </div>
        ) : (
            <ConfirmCard selectedServices={selectedServices} selectedZig={selectedZig} selectedZag={selectedZag} whichButton={"Connect"} />
        )
    );
};

export default Carousel;
