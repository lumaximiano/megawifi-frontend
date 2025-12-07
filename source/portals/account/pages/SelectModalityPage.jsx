// frontend/src/pages/SelectModalityPage.jsx - v2.1 - ATIVA O BOTÃO PERSONALIZAR

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/SelectModalityPage.module.css';

// Ícones (placeholders)
const PaymentIcon = () => <span className={styles.icon}>💳</span>;
const SlidesIcon = () => <span className={styles.icon}>🖼️</span>;
const SurveyIcon = () => <span className={styles.icon}>📊</span>;
const VideoIcon = () => <span className={styles.icon}>🎬</span>;

const modalityDetails = {
    PAYMENT: { title: 'Acesso via Pagamento', description: 'Venda planos de acesso com pagamento via PIX.', icon: <PaymentIcon /> },
    SLIDES: { title: 'Acesso via Slides', description: 'Mostre uma sequência de imagens para dar acesso.', icon: <SlidesIcon /> },
    SURVEY: { title: 'Acesso via Enquete', description: 'Colete feedback valioso em troca de internet.', icon: <SurveyIcon /> },
    VIDEO: { title: 'Acesso via Vídeo', description: 'Libere acesso após o cliente assistir a um vídeo.', icon: <VideoIcon /> },
};

const SelectModalityPage = () => {
    const { establishmentId } = useParams();
    const navigate = useNavigate();

    const [establishment, setEstablishment] = useState(null);
    const [modalities, setModalities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            try {
                const [estRes, modRes] = await Promise.all([
                    axios.get(`/api/establishments/${establishmentId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('/api/modalities', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                setEstablishment(estRes.data);
                setModalities(modRes.data);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError('Não foi possível carregar as configurações. Verifique se o backend está rodando e as rotas existem.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [establishmentId]);

    const handleActivate = async (modalityType) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.patch(`/api/establishments/${establishmentId}/activate-modality`, 
                { modalityType },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setEstablishment(response.data);
            alert(`Modalidade '${modalityDetails[modalityType]?.title || modalityType}' ativada com sucesso!`);
        } catch (err) {
            console.error("Erro ao ativar modalidade:", err);
            alert('Falha ao ativar a modalidade.');
        }
    };

    const handlePersonalizeClick = (modalityType) => {
        // --- A ÚNICA MUDANÇA ESTÁ AQUI ---
        // Se for pagamento, vai para a nova tela. Senão, vai para a tela genérica.
        if (modalityType === 'PAYMENT') {
            navigate(`/admin/hotspot/config/${establishmentId}/payment`);
        } else {
            // Mantém o comportamento antigo para as outras modalidades
            navigate(`/admin/hotspot/config/${modalityType.toLowerCase()}`);
        }
    };

    if (isLoading) return <div className={styles.container}><p>Carregando...</p></div>;
    if (error) return <div className={styles.container}><p className={styles.error}>{error}</p></div>;

    return (
        <div className={styles.container}>
            <Link to="/admin/hotspot" className={styles.backLink}>← Voltar para a lista</Link>
            <h1>Modalidades de Acesso do Hotspot</h1>
            <p className={styles.subtitle}>
                Escolha como os clientes do estabelecimento <strong>{establishment?.name}</strong> se conectarão à sua rede.
            </p>
            <div className={styles.cardGrid}>
                {Object.keys(modalityDetails).map(type => {
                    const details = modalityDetails[type];
                    const isActive = establishment?.activeModalityType === type;
                    
                    return (
                        <div key={type} className={`${styles.card} ${isActive ? styles.activeCard : ''}`}>
                            {details.icon}
                            <h3>{details.title}</h3>
                            <p>{details.description}</p>
                            <div className={styles.cardFooter}>
                                <button 
                                    className={styles.personalizeButton}
                                    onClick={() => handlePersonalizeClick(type)}
                                >
                                    Personalizar
                                </button>
                                <button 
                                    className={`${styles.status} ${isActive ? styles.active : styles.inactive}`}
                                    onClick={() => handleActivate(type)}
                                >
                                    {isActive ? 'ATIVO' : 'ATIVAR'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SelectModalityPage;
