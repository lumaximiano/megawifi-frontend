// frontend/src/components/LinkEstablishmentModal.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/LinkEstablishmentModal.module.css'; // Criaremos este CSS a seguir

const LinkEstablishmentModal = ({ router, onClose, onLinkSuccess }) => {
    const [establishments, setEstablishments] = useState([]);
    const [selectedEstablishmentId, setSelectedEstablishmentId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Busca a lista de estabelecimentos para preencher o dropdown
        const fetchEstablishments = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/establishments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEstablishments(res.data);
                // Se o roteador já estiver vinculado, pré-seleciona o estabelecimento
                if (router.establishmentId) {
                    setSelectedEstablishmentId(router.establishmentId);
                }
            } catch (err) {
                setError('Não foi possível carregar os estabelecimentos.');
            } finally {
                setLoading(false);
            }
        };
        fetchEstablishments();
    }, [router.establishmentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/routers/${router.id}/link`, 
                { establishmentId: selectedEstablishmentId || null }, // Envia null para desvincular
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onLinkSuccess(); // Chama a função de sucesso para fechar o modal e atualizar a lista
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao vincular roteador.');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Vincular Roteador</h3>
                <p>Vincule o roteador <strong>{router.name}</strong> a um estabelecimento.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="establishment-select">Estabelecimento:</label>
                        <select
                            id="establishment-select"
                            value={selectedEstablishmentId}
                            onChange={(e) => setSelectedEstablishmentId(e.target.value)}
                            className={styles.select}
                            disabled={loading}
                        >
                            <option value="">-- Desvincular / Nenhum --</option>
                            {establishments.map(est => (
                                <option key={est.id} value={est.id}>
                                    {est.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                        <button type="submit" className={styles.saveButton} disabled={loading}>Salvar Vínculo</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LinkEstablishmentModal;
