// frontend/src/components/StatCard.jsx

import React from 'react';
import styles from '../../../styles/StatCard.module.css'; // Importa seu próprio CSS dedicado

const StatCard = ({ title, mainValue, details, icon, onClick }) => {
    // Adiciona a classe 'clickable' apenas se a função onClick for fornecida
    const cardClassName = `${styles.statCard} ${onClick ? styles.clickable : ''}`;
    
    return (
        <div className={cardClassName} onClick={onClick}>
            <div className={styles.cardIcon}>{icon}</div>
            <div className={styles.cardContent}>
                <p className={styles.cardTitle}>{title}</p>
                
                {/* Lógica para renderizar o valor principal de forma segura */}
                <div className={styles.cardValueContainer}>
                    {/* Se mainValue for um objeto (JSX), renderiza. Se for string/número, envolve em um <p> */}
                    {typeof mainValue === 'object' ? mainValue : <p className={styles.cardValue}>{mainValue}</p>}
                </div>

                {/* Renderiza os detalhes apenas se o array existir e não estiver vazio */}
                {details && details.length > 0 && (
                    <div className={styles.cardDetails}>
                        {details.map(detail => (
                            <span key={detail.label}>{detail.label}: <strong>{detail.value}</strong></span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
