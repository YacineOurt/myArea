import React, { useEffect } from 'react';
import styles from '../../public/styles/card.module.scss';
import {CustomIcon} from "@/components/CustomColor";

const ZigZag = ({ card, zigZagData, setOnlyServiceZigZag, title, currentStep, updateStep, setSelectedZig, setSelectedZag, selectedServices }) => {

    const selectedService = currentStep === 2 ? selectedServices[0] : selectedServices[1];

    const handleConnectClick = () => {
        updateStep(currentStep + 1);
        if (card.type === "zig") {
            setSelectedZig(card);
        } else if (card.type === "zag") {
            setSelectedZag(card);
        } else {
            console.log("Error: Card type not found");
        }
    }

    const description = card.description;

    const maxDescriptionLength = 160;

    const truncatedDescription =
        description.length > maxDescriptionLength
            ? description.slice(0, maxDescriptionLength) + '...'
            : description;

    useEffect(() => {
        setOnlyServiceZigZag(zigZagData.filter((zigzag) => zigzag.service_id === selectedService.id));
    }, [selectedService.id, zigZagData, setOnlyServiceZigZag]);

    const ZigZagCard = ({ card, title, selectedService }) => {

        return (
            <div className={styles.cardContainer}>
                <div className={styles.card} key={card.id}>
                    <label>
                        <input type="checkbox" />
                        <article>
                            <div className={styles.cardFront} style={{ backgroundColor: selectedService.color }}>
                                <header>
                                    <h2>{title}</h2>
                                    <CustomIcon name="ellipsis-vertical" color="white" />
                                </header>
                                <var style={{fontSize: '30px', lineHeight: '1'}}>{card.name}</var>
                                <button className={styles.connectButton} style={{marginTop: '50px'}} onClick={handleConnectClick}>
                                    Select
                                </button>
                            </div>
                            <div className={styles.cardBack} style={{ backgroundColor: selectedService.color }}>
                                <header>
                                    <h2>{card.name}</h2>
                                    <CustomIcon name="close" color="red" />
                                </header>
                                <p>{truncatedDescription}</p>
                            </div>
                        </article>
                    </label>
                </div>
            </div>
        );
    }

    return (
        <ZigZagCard card={card} title={title} selectedService={selectedService} />
    );
};

export default ZigZag;
