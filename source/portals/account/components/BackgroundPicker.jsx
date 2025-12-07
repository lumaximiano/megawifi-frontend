// frontend/src/components/BackgroundPicker.jsx
import React from 'react';
import styles from '../css/BackgroundPicker.module.css';

const backgrounds = [
    '/backgrounds/bg1.jpg',
    '/backgrounds/bg2.jpg',
    '/backgrounds/bg3.jpg',
    '/backgrounds/bg4.jpg',
    '/backgrounds/bg5.jpg',
    '/backgrounds/bg6.jpg',
];

const BackgroundPicker = ({ currentBackground, onBackgroundChange }) => {
    return (
        <div className={styles.pickerGrid}>
            {backgrounds.map(bg => (
                <div
                    key={bg}
                    className={`${styles.thumbnail} ${currentBackground === bg ? styles.selected : ''}`}
                    onClick={() => onBackgroundChange(bg)}
                >
                    <img src={bg} alt={`Fundo ${bg}`} />
                </div>
            ))}
        </div>
    );
};

export default BackgroundPicker;
