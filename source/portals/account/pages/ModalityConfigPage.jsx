// frontend/src/pages/ModalityConfigPage.jsx - v2.0 (Inteligente e Adaptável)

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/ModalityConfigPage.module.css';

const ModalityConfigPage = () => {
    const { modalityType } = useParams(); // "payment", "video", etc.
    const navigate = useNavigate();

    const [config, setConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Busca os dados desta modalidade específica na API
    useEffect(() => {
        const fetchConfig = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                // A API nos retorna um array, então precisamos encontrar a config certa
                const response = await axios.get('/api/hotspot/modalities', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const specificConfig = response.data.find(m => m.type.toLowerCase() === modalityType);
                if (specificConfig) {
                    setConfig(specificConfig);
                } else {
                    console.error(`Configuração para ${modalityType} não encontrada.`);
                }
            } catch (error) {
                console.error("Erro ao buscar configuração da modalidade:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, [modalityType]);

    // Função para salvar as alterações
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            // A API espera um array, então enviamos apenas a config modificada dentro de um array
            await axios.post('/api/hotspot/modalities', [config], {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Configuração salva com sucesso!');
            navigate('/admin/hotspot'); // Volta para o Hub após salvar
        } catch (error) {
            alert('Erro ao salvar a configuração.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Função para atualizar o estado do formulário
    const handleInputChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    // --- RENDERIZAÇÃO CONDICIONAL ---
    const renderPaymentConfig = () => {
        return (
            <>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Título na Página de Login</label>
                    <p className={styles.description}>Este é o texto que aparecerá acima dos planos de pagamento.</p>
                    <input
                        type="text"
                        className={styles.input}
                        value={config.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        disabled={!config.isActive}
                    />
                </div>

                <div className={styles.infoBox}>
                    <h4>Gerenciamento de Planos e Pagamentos</h4>
                    <p>As configurações de preço, duração e a sua chave do Mercado Pago são gerenciadas em suas respectivas seções para manter tudo organizado.</p>
                    <div className={styles.linkContainer}>
                        <Link to="/admin/planos" className={styles.shortcutLink}>Gerenciar Planos</Link>
                        <Link to="/admin/integracoes" className={styles.shortcutLink}>Configurar Mercado Pago</Link>
                    </div>
                </div>
            </>
        );
    };

    if (isLoading) return <p>Carregando configuração...</p>;
    if (!config) return <p>Não foi possível carregar a configuração para esta modalidade.</p>;

    return (
        <div className={styles.container}>
            <Link to="/admin/hotspot" className={styles.backLink}>
                ← Voltar para Todas as Modalidades
            </Link>
            
            <div className={styles.header}>
                <h2>Configuração: {config.title}</h2>
                <div className={styles.switchContainer}>
                    <span>Ativar esta modalidade</span>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={config.isActive}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>

            <div className={styles.content}>
                {/* Aqui acontece a mágica: renderiza o formulário certo para a modalidade */}
                {modalityType === 'payment' && renderPaymentConfig()}

                {/* No futuro, adicionaremos outras condições aqui */}
                {modalityType === 'video' && <p>O formulário de configuração para Vídeo será construído aqui.</p>}
                {modalityType === 'survey' && <p>O formulário de configuração para Enquete será construído aqui.</p>}
                {modalityType === 'slides' && <p>O formulário de configuração para Slides será construído aqui.</p>}
            </div>

            <button onClick={handleSave} className={styles.saveButton} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </div>
    );
};

export default ModalityConfigPage;
