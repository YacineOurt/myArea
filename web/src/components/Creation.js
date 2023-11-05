import React, { useEffect, useState } from 'react';
import styles from "../../public/styles/creation.module.scss";
import StepNavigation from "@/components/StepNavigation";
import Carousel from "@/components/Carousel";
import ZigzagPreviewCase from "@/components/ZigZagPreviewCase";
import { getServiceIcon } from "@/auth/pocketbase";

const Creation = ( { searchTerm, labelArray, currentStep, updateStep, handleSearchChange } ) => {

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedZig, setSelectedZig] = useState(null);
    const [selectedZag, setSelectedZag] = useState(null);

    return (
        <div className={styles.creationContainer}>
            <h2 className={styles.creationHeading}>Create a ZigZag</h2>
            <div className={styles.progressBarContainer}>
                <button
                    className={styles.previousButton}
                    disabled={currentStep === 1}
                    onClick={() => {updateStep(currentStep - 1)}}
                >
                    Previous Step
                </button>
                <StepNavigation labelArray={labelArray} currentStep={currentStep} updateStep={updateStep}></StepNavigation>
                <button
                    className={styles.nextButton}
                    disabled={currentStep === labelArray.length || (currentStep === 1 && !selectedServices[0] || currentStep === 3 && !selectedServices[1])}
                    onClick={() => {updateStep(currentStep + 1)}}
                >
                    Next Step
                </button>
            </div>
            {currentStep !== 5 && (
                <div className={styles.searchContainer}>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>
                            <i className="fa fa-search" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                    </div>
                </div>
            )}
            <Carousel
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                selectedZig={selectedZig}
                setSelectedZig={setSelectedZig}
                selectedZag={selectedZag}
                setSelectedZag={setSelectedZag}
                searchTerm={searchTerm}
                currentStep={currentStep}
                updateStep={updateStep}
            />
            <div className={styles.zigzagPreview}>
                <h3 className={styles.zigzagPreviewHeading}>ZigZag Preview</h3>
                <div className={styles.rowContainer}>
                    <div className={styles.rowPreview}>
                        <a>Services</a>
                        <ZigzagPreviewCase data={selectedServices[0]} icon={getServiceIcon(selectedServices[0])} service={selectedServices[0]} />
                        <ZigzagPreviewCase data={selectedServices[1]} icon={getServiceIcon(selectedServices[1])} service={selectedServices[1]} />
                    </div>
                    <div className={styles.rowPreview}>
                        <a>Triggers & Actions</a>
                        <ZigzagPreviewCase data={selectedZig} icon={getServiceIcon(selectedServices[0])} service={selectedServices[0]} />
                        <ZigzagPreviewCase data={selectedZag} icon={getServiceIcon(selectedServices[1])} service={selectedServices[1]} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Creation;
