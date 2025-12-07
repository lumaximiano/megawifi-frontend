// frontend/src/pages/HotspotPage.jsx - v8.4 (CORRIGIDO PARA A ROTA DO CLIENTE)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig'; // Corrigindo o caminho do import
import styles from '../css/HotspotPage.module.css';

const HotspotPage = () => {
    const [establishments, setEstablishments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEstablishments = async () => {
            setIsLoading(true);
            try {
                // A chamada da API já está correta, usando o 'api' interceptor
                const response = await api.get('/api/establishments');
                const filteredData = response.data.filter(est => est.routers && est.routers.length > 0);
                setEstablishments(filteredData);
            } catch (err) {
                console.error("Erro ao buscar estabelecimentos:", err);
                setError("Não foi possível carregar os perfis de hotspot.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEstablishments();
    }, []);

    const handleConfigureClick = (establishmentId) => {
        // ==================================================
        // MUDANÇA CRÍTICA: A rota agora é do cliente, não do admin.
        // ==================================================
        navigate(`/client/hotspot/config/${establishmentId}`);
    };

    if (isLoading) return <p style={{ padding: '2rem' }}>Carregando perfis de hotspot...</p>;
    if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

    return (
        <div className={styles.pageContainer}>
            <h2>Configuração de Hotspot por Estabelecimento</h2>
            <p className={styles.pageDescription}>
                Gerencie as modalidades de acesso para cada um dos seus estabelecimentos que possuem roteadores vinculados.
            </p>

            <div className={styles.tableContainer}>
                <table className={styles.clientsTable}>
                    <thead>
                        <tr>
                            <th>Estabelecimento</th>
                            <th>Roteador(es) Vinculado(s)</th>
                            <th>Modalidade Ativa</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {establishments.length > 0 ? (
                            establishments.map(est => (
                                <tr key={est.id}>
                                    <td>{est.name}</td>
                                    <td>
                                        {est.routers.map(r => r.name).join(', ')}
                                    </td>
                                    <td>
                                        <span className={styles.statusInactive}>
                                            {est.activeModalityType || 'INATIVO'}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className={styles.configButton}
                                            onClick={() => handleConfigureClick(est.id)}
                                        >
                                            ⚙️ Configurar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                                    Nenhum estabelecimento com roteador vinculado encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HotspotPage;
