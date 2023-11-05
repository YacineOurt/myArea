import React from "react";
import styles from '../../public/styles/progressBar.module.scss';

export default function Step(props) {
    const stepClasses = `${styles.stepBlock} ${props.selected ? styles.selected : ""}`;

    return (
        <div className={stepClasses}>
            <div className={styles.circleWrapper}>
                <div className={styles.circle}>{props.index + 1}</div>
            </div>
            <span className={styles.stepLabel}>{props.label}</span>
        </div>
    );
}

