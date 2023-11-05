import React from 'react';
import styles from "../../public/styles/confirmCard.module.scss";
import button from '../../public/styles/card.module.scss';
import {deleteZigZag, getServiceIcon, postZigZagData} from "@/auth/pocketbase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const ConfirmCard = ({ zigZagId, selectedServices, selectedZig, selectedZag, whichButton }) => {

    if (selectedServices.length < 2 || !selectedZig || !selectedZag) {
        return <div className={styles.confirmCard}>Loading...</div>;
    }

    const [service1, service2] = selectedServices;
    const combinedDescription = `${selectedZig.description} & ${selectedZag.description}`;

    const maxDescriptionLength = 160;

    const truncatedDescription =
        combinedDescription.length > maxDescriptionLength
            ? combinedDescription.slice(0, maxDescriptionLength) + '...'
            : combinedDescription;

    const handleConfirmClick = async () => {
        try {
            await postZigZagData(selectedZig, selectedZag);
            window.location.href = '/Manager';
            alert('ZigZag created successfully!');

        } catch (error) {
            console.error('Error creating ZigZag:', error);
            alert('Error creating ZigZag');
        }
    };

    let buttonChoice;

    if (whichButton === "Connect") {
        buttonChoice =  (
            <button className={button.connectButton} style={{marginTop: '20px'}} onClick={handleConfirmClick}>
                Confirm
            </button>
        );
    } else if (whichButton === "Delete") {
        buttonChoice = (
            <div className={button.deleteButtonContainer}>
                <button className={button.deleteButton} style={{ marginTop: '20px' }} onClick={() => deleteZigZag(zigZagId)}>
                    <FontAwesomeIcon icon={faTimes} className={button.icon} />
                    Delete
                </button>
            </div>
        );
    }

    return (
        <div className={styles.confirmCard}>
            <div
                style={{ background: `linear-gradient(208deg, ${service1.color} 1.03%, ${service2.color} 100%)` }}
                className={styles.actionReactionCard}
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
                {buttonChoice}
            </div>
        </div>
    );
};

export default ConfirmCard;
