// frontend/src/pages/ConfigurationMasterPage.jsx - v2 - SEÇÃO DE PLANOS REMOVIDA

import React from 'react';
import styles from "../../css/ConfigurationMasterPage.module.css";

const ConfigurationMasterPage = () => {
    return (
        <div className={styles.configContainer}>
            <h1 className={styles.pageTitle}>Configurações da Plataforma</h1>

            {/* --- Seção 1: Identidade da Plataforma --- */}
            <div className={styles.configSection}>
                <h2>Identidade da Plataforma</h2>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="platformName">Nome da Plataforma</label>
                        <input type="text" id="platformName" defaultValue="MegaWifi" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="platformLogo">Logo da Plataforma</label>
                        <input type="file" id="platformLogo" />
                        <p className={styles.inputHint}>Use uma imagem PNG com fundo transparente.</p>
                    </div>
                </div>
                <button className={styles.saveButton} onClick={(e) => e.preventDefault()}>Salvar Identidade</button>
            </div>

            {/* --- Seção 2: Termos Legais --- */}
            <div className={styles.configSection}>
                <h2>Termos Legais</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="termsOfService">Termos de Serviço</label>
                    <textarea id="termsOfService" rows="10" placeholder="Cole aqui os termos de serviço da sua plataforma..."></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="privacyPolicy">Política de Privacidade</label>
                    <textarea id="privacyPolicy" rows="10" placeholder="Cole aqui a política de privacidade da sua plataforma..."></textarea>
                </div>
                <button className={styles.saveButton} onClick={(e) => e.preventDefault()}>Salvar Documentos</button>
            </div>
        </div>
    );
};

export default ConfigurationMasterPage;
