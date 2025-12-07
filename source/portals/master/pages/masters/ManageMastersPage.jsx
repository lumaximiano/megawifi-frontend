import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@api/axiosConfig';
import styles from '@css/ListPage.module.css';

const ManageMastersPage = () => {
    const navigate = useNavigate();
    const [masters, setMasters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMasters = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/users', {
                    params: { role: 'MASTER' }
                });
                setMasters(response.data);
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Falha ao carregar a lista de masters.');
                console.error("Erro ao buscar masters:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMasters();
    }, []);

    const handleEdit = (masterId) => {
        navigate(`/admin/masters/edit/${masterId}`);
    };

    // LÓGICA DE EXCLUSÃO COPIADA DIRETAMENTE DE 'ManageAccountsPage.jsx'
    const handleDelete = async (masterId) => {
        // Usa o 'window.confirm' padrão do navegador
        if (!window.confirm("Você tem certeza que deseja remover este Master? Esta ação não pode ser desfeita.")) {
            return;
        }
        try {
            await api.delete(`/api/users/${masterId}`);
            // Atualiza o estado local para remover o item da lista sem precisar recarregar a página
            setMasters(currentMasters => currentMasters.filter(master => master.id !== masterId));
        } catch (err) {
            setError(err.response?.data?.message || 'Falha ao remover o Master.');
            console.error("Erro ao deletar Master:", err);
        }
    };

    return (
        <div className={styles.listPageContainer}>
            <div className={styles.header}>
                <h1>Gerenciar Masters</h1>
                <button
                    className={styles.addButton}
                    onClick={() => navigate('/admin/masters/new')}
                    disabled={isLoading}
                >
                    Cadastrar Novo Master
                </button>
            </div>
            <div className={styles.content}>
                {error && <p className={styles.error}>{error}</p>}
                
                {!isLoading && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Criado em</th>
                                <th className={styles.actionsHeader}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {masters.length > 0 ? (
                                masters.map(master => (
                                    <tr key={master.id}>
                                        <td>{master.name}</td>
                                        <td>{master.email}</td>
                                        <td>{new Date(master.createdAt).toLocaleDateString('pt-BR')}</td>
                                        <td className={styles.actionsCell}>
                                            <button 
                                                className={styles.editButton}
                                                onClick={() => handleEdit(master.id)}
                                            >
                                                Editar
                                            </button>
                                            {/* BOTÃO EXCLUIR AGORA CHAMA A FUNÇÃO CORRETA */}
                                            <button 
                                                className={styles.deleteButton} 
                                                onClick={() => handleDelete(master.id)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">Nenhum master cadastrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageMastersPage;
