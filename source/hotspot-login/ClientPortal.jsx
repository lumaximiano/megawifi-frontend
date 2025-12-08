// lmx-megawifi/frontend/src/components/ClientPortal.jsx - v4.1 (Padrão CSS Corrigido)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ClientPortal.module.css'; // <-- Importando os estilos do arquivo correto

const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} Minutos`;
    if (minutes === 60) return '1 Hora';
    if (minutes < 1440) return `${minutes / 60} Horas`;
    if (minutes === 1440) return '1 Dia';
    return `${minutes / 1440} Dias`;
};

const ClientPortal = ({ previewData = null }) => {
    const [plans, setPlans] = useState(previewData?.plans || []);
    const [appearance, setAppearance] = useState(previewData?.appearance || { title: 'Bem-vindo!', backgroundUrl: '' });
    const [modalities, setModalities] = useState(previewData?.modalities || []);
    
    const [loading, setLoading] = useState(!previewData);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copiar Código');
    const [macAddress, setMacAddress] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [expiredModalVisible, setExpiredModalVisible] = useState(false);

    useEffect(() => {
        if (previewData) {
            // Em modo preview, apenas atualiza o estilo do body
            document.body.style.backgroundImage = `url(${appearance.backgroundUrl})`;
            return;
        };

        const params = new URLSearchParams(window.location.search);
        const mac = params.get('mac');
        if (!mac) {
            setError('Endereço MAC não encontrado.');
            setLoading(false);
            return;
        }
        setMacAddress(mac);

        const fetchInitialData = async () => {
            try {
                const [sessionStatusRes, plansRes, appearanceRes, modalitiesRes] = await Promise.all([
                    axios.get(`/api/sessions/status/${mac}`),
                    axios.get('/api/plans'),
                    axios.get('/api/settings/hotspotAppearance'),
                    axios.get('/api/hotspot/modalities')
                ]);

                if (sessionStatusRes.data.status === 'expired') setExpiredModalVisible(true);
                setPlans(plansRes.data);
                if (appearanceRes.data && appearanceRes.data.value) {
                    const parsedAppearance = JSON.parse(appearanceRes.data.value);
                    setAppearance(parsedAppearance);
                    document.body.style.backgroundImage = `url(${parsedAppearance.backgroundUrl})`;
                }
                setModalities(modalitiesRes.data);

            } catch (err) {
                setError('Não foi possível carregar o portal.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchInitialData();
    }, [previewData, appearance.backgroundUrl]);

    const handlePurchase = async (planId) => {
        if (!macAddress) { setError('Erro: Endereço MAC do cliente não encontrado.'); return; }
        setIsProcessing(true); setError('');
        try {
            const res = await axios.post('/api/payments/pix', { planId, macAddress });
            setPaymentData(res.data); setPaymentStatus('pending'); setShowModal(true);
        } catch (err) { setError(err.response?.data?.message || 'Falha ao iniciar pagamento.'); } finally { setIsProcessing(false); }
    };

    const copyToClipboard = () => {
        const codeToCopy = paymentData?.qrCode;
        if (!codeToCopy) return;
        navigator.clipboard.writeText(codeToCopy).then(() => {
            setCopyButtonText('Copiado!');
            setTimeout(() => setCopyButtonText('Copiar Código'), 2500);
        }).catch(err => console.error('Erro ao copiar:', err));
    };

    const handleSuccessConfirmation = () => { window.location.reload(true); };

    const renderContent = () => {
        const activeModalities = modalities.filter(m => m.isActive);
        return (
            <div>
                {activeModalities.map(modality => {
                    if (modality.type === 'PAYMENT') {
                        return (
                            <div key="payment-section">
                                <p className={styles.subHeader}>{modality.title || 'Escolha um plano para se conectar'}</p>
                                <div className={styles.planGrid}>
                                    {plans.map(plano => (
                                        <div key={plano.id} className={styles.planCard}>
                                            <div>
                                                <div className={styles.planName}>{plano.name}</div>
                                                <div className={styles.planDuration}>{formatDuration(plano.durationMinutes || plano.duration_minutes)}</div>
                                                <div className={styles.planPrice}>R$ {(plano.price || 0).toFixed(2).replace('.', ',')}</div>
                                            </div>
                                            <button onClick={() => handlePurchase(plano.id)} className={styles.buyButton} disabled={isProcessing || !macAddress}>
                                                {isProcessing ? 'Processando...' : 'Adquirir'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    if (modality.type === 'VIDEO') {
                        return (
                            <button key="video-button" className={styles.modalityButton}>
                                🎥 {modality.title || 'Acesso Grátis via Vídeo'}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    if (loading) return <div className={styles.statusMessage}>Carregando...</div>;

    return (
        <>
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        {paymentStatus === 'approved' ? (
                            <div className={styles.successContent}>
                                <p>✅</p><p>Pagamento Aprovado!</p><p>Seu acesso à internet está liberado.</p>
                                <button onClick={handleSuccessConfirmation} className={styles.successButton}>OK, NAVEGAR AGORA!</button>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => setShowModal(false)} className={styles.closeButton}>&times;</button>
                                <h3>Pague com PIX para liberar seu acesso</h3>
                                <img src={`data:image/jpeg;base64,${paymentData.qrCodeBase64}`} alt="QR Code PIX" className={styles.qrCodeImage} />
                                <input type="text" readOnly value={paymentData.qrCode} className={styles.copyCodeInput} />
                                <button onClick={copyToClipboard} className={styles.copyButton}>{copyButtonText}</button>
                            </>
                        )}
                    </div>
                </div>
            )}
            {expiredModalVisible && (
                 <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.expiredTitle}>Tempo Esgotado</h3>
                        <p className={styles.expiredText}>Seu tempo de acesso à internet expirou.</p>
                        <p className={styles.expiredText}>Por favor, escolha um novo plano para continuar navegando.</p>
                        <button onClick={() => setExpiredModalVisible(false)} className={`${styles.successButton} ${styles.expiredButton}`}>OK</button>
                    </div>
                </div>
            )}

            <div className={styles.container}>
                <h1 className={styles.header}>{appearance.title}</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {renderContent()}
            </div>
        </>
    );
};

export default ClientPortal;
