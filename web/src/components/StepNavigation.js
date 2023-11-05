import React from "react";
import Step from "./Step";
import styles from '../../public/styles/progressBar.module.scss';

export default function StepNavigation(props) {
    return (
        <div className={styles.progressBar}>
            {props.labelArray.map((item, index) => (
                <Step
                    key={index}
                    index={index}
                    label={item}
                    updateStep={props.updateStep}
                    selected={props.currentStep === index + 1}
                />
            ))}
        </div>
    );
}
