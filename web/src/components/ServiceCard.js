import React from 'react';
import styles from '../../public/styles/card.module.scss';
import {CustomIcon} from "@/components/CustomColor";
import {getServiceIcon} from "@/auth/pocketbase";

export const Service = ({ card, handleConnectClick }) => {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.card} key={card.id}>
                <label>
                    <input type="checkbox" />
                    <article>
                        <div className={styles.cardFront} style={{ backgroundColor: card.color }}>
                            <header>
                                <img
                                    src={getServiceIcon(card)}
                                    alt="Service"
                                    className={styles.serviceIcon}
                                />
                                <CustomIcon name="ellipsis-vertical" color="white" />
                            </header>
                            <var>{card.name}</var>
                            <button className={styles.connectButton} onClick={() => handleConnectClick()}>
                                Select
                            </button>
                        </div>
                        <div className={styles.cardBack} style={{ backgroundColor: card.color }}>
                            <header>
                                <h2>{card.name}</h2>
                                <CustomIcon name="close" color="red" />
                            </header>
                            <p>{card.description}</p>
                        </div>
                    </article>
                </label>
            </div>
        </div>
    )
}

const ServiceCard = ({ card, currentStep, updateStep, selectedServices, setSelectedServices }) => {

    const handleConnectClick = () => {
        updateStep(currentStep + 1);
        const newSelectedServices = [...selectedServices];

        if (currentStep - 1 < newSelectedServices.length) {
            newSelectedServices[currentStep - 1] = card;
        } else if (currentStep === 3) {
            newSelectedServices[1] = card;
        } else {
            newSelectedServices.push(card);
        }
        setSelectedServices(newSelectedServices);
    };

    return (
        <Service card={card} handleConnectClick={handleConnectClick} />
    )
};

export default ServiceCard;
