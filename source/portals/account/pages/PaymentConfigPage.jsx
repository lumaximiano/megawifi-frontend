// frontend/src/pages/PaymentConfigPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../css//PaymentConfigPage.module.css';
import PlanSelector from '../components/PlanSelector'; // Componente que vamos criar
import BackgroundPicker from '../components/BackgroundPicker'; // Componente que vamos criar

const PaymentConfigPage = () => {
    const { establishmentId } = useParams();
    const [config, setConfig] = useState({
        title: '',
        description: '',
        selectedPlanIds: [],
        backgroundUrl: ''
    });
    const [establishmentName, setEstablishmentName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            try {
                // Busca os dados do estabelecimento e a configuração de pagamento existente
                const estRes = await axios.get(`/api/establishments/${establishmentId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                const paymentConfig = estRes.data.paymentConfig || {}; // Pega a config existente ou um objeto vazio

                setEstablishmentName(estRes.data.name);
                setConfig({
                    title: paymentConfig.title || 'Bem-vindo!',
                    description: paymentConfig.description || 'Para continuar, escolha um dos planos abaixo.',
                    selectedPlanIds: paymentConfig.selectedPlanIds || [],
                    backgroundUrl: paymentConfig.backgroundUrl || '/backgrounds/bg1.jpg' // Um padrão
                });

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError('Não foi possível carregar a configuração.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [establishmentId]);

    const handleSave = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        try {
            await axios.patch(`/api/establishments/${establishmentId}/payment-config`, 
                { paymentConfig: config },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert('Configuração de pagamento salva com sucesso!');
        } catch (err) {
            console.error("Erro ao salvar:", err);
            alert('Falha ao salvar a configuração.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePlanChange = (planId) => {
        setConfig(prev => {
            const newSelectedPlanIds = prev.selectedPlanIds.includes(planId)
                ? prev.selectedPlanIds.filter(id => id !== planId)
                : [...prev.selectedPlanIds, planId];
            return { ...prev, selectedPlanIds: newSelectedPlanIds };
        });
    };

    if (isLoading) return <div className={styles.container}><p>Carregando...</p></div>;
    if (error) return <div className={styles.container}><p className={styles.error}>{error}</p></div>;

    return (
        <div className={styles.container}>
            <Link to={`/admin/hotspot/config/${establishmentId}`} className={styles.backLink}>
                ← Voltar para as Modalidades
            </Link>
            <h1>Personalizar Acesso via Pagamento</h1>
            <p className={styles.subtitle}>
                Configurando para o estabelecimento: <strong>{establishmentName}</strong>
            </p>

            <div className={styles.formSection}>
                <h3>Mensagem de Boas-Vindas</h3>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Título Principal</label>
                    <input
                        id="title"
                        type="text"
                        value={config.title}
                        onChange={(e) => setConfig({ ...config, title: e.target.value })}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Texto de Descrição</label>
                    <textarea
                        id="description"
                        value={config.description}
                        onChange={(e) => setConfig({ ...config, description: e.target.value })}
                        className={styles.textarea}
                        rows="3"
                    />
                </div>
            </div>

            <div className={styles.formSection}>
                <h3>Planos Disponíveis</h3>
                <p className={styles.description}>Selecione quais planos de acesso pago você quer oferecer neste hotspot. Os planos são criados na aba "Planos".</p>
                <PlanSelector
                    selectedPlanIds={config.selectedPlanIds}
                    onPlanChange={handlePlanChange}
                />
            </div>

            <div className={styles.formSection}>
                <h3>Imagem de Fundo</h3>
                <p className={styles.description}>Escolha uma imagem de fundo para a tela de login do hotspot.</p>
                <BackgroundPicker
                    currentBackground={config.backgroundUrl}
                    onBackgroundChange={(url) => setConfig({ ...config, backgroundUrl: url })}
                />
            </div>

            <div className={styles.infoBox}>
                <h4>Token do Mercado Pago</h4>
                <p>Para receber os pagamentos, seu token de acesso do Mercado Pago precisa estar configurado. Você pode fazer isso na página de integrações.</p>
                <Link to="/admin/integracoes" className={styles.shortcutLink}>Configurar Integração</Link>
            </div>

            <button onClick={handleSave} className={styles.saveButton} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Configurações de Pagamento'}
            </button>
        </div>
    );
};

export default PaymentConfigPage;
