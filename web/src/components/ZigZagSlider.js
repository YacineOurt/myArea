import React from 'react';
import styles from '../../public/styles/ZigZagSlider.module.scss';
import "swiper/css";
import "swiper/css/effect-coverflow";
import {Swiper, SwiperSlide} from "swiper/react";

const ZigZagSlider = ({ elements, color }) => {

    const getDescription = (description) => {
        const maxDescriptionLength = 160;

        return description.length > maxDescriptionLength
            ? description.slice(0, maxDescriptionLength) + '...'
            : description;
    }

    return (
        <div className={styles.sliderContainer}>
            <Swiper spaceBetween={100} slidesPerView={4} loop={false} autoplay={false}>
                {elements.length > 0 ? (
                    elements.map((element) => (
                        <SwiperSlide key={element.id}>
                            <div className={styles.slide} style={{ background: color }}>
                                <h4>{element.name}</h4>
                                <p>{getDescription(element.description)}</p>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <p className={styles.void}>Nothing available</p>
                )}
            </Swiper>
        </div>
    );
}

export default ZigZagSlider;
