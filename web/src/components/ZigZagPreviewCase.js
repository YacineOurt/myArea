import React from 'react';
import styles from '../../public/styles/zigZagPreview.module.scss';

const ZigzagPreviewCase = ({ data, icon, service }) => {

    const name = data ? data.name : '...'
    const color = service ? service.color : '#E2E2E2';

    return (
        <div className={styles.zigzagCase} style={{background: color}}>
            <img src={icon} alt={name} />
            <h4>{name}</h4>
        </div>
    );
};

export default ZigzagPreviewCase;
