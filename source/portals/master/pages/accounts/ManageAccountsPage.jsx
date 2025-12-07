// frontend/source/portals/master/pages/accounts/ManageAccountsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@api/axiosConfig';
import styles from '@css/ListPage.module.css';
// MUDANÇA 1: O import do TableSkeletonLoader foi REMOVIDO.

const ManageAccountsPage = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/accounts');
                setAccounts(response.data);
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Falha ao carregar a lista de contas.');
                console.error("Erro ao buscar contas:", err);
            } finally {
                // MUDANÇA 2: O setTimeout foi removido.
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleDelete = async (accountId) => {
        if (!window.confirm("Você tem certeza que deseja remover esta conta e todos os seus dados?")) {
            return;
        }
        try {
            await api.delete(`/api/accounts/${accountId}`);
            setAccounts(currentAccounts => currentAccounts.filter(acc => acc.id !== accountId));
        } catch (err) {
            setError(err.response?.data?.message || 'Falha ao remover a conta.');
            console.error("Erro ao deletar conta:", err);
        }
    };

    // MUDANÇA 3: A lógica de renderização foi simplificada.
    return (
        <div className={styles.listPageContainer}>
            <div className={styles.header}>
                <h1>Gerenciar Contas</h1>
                <button
                    className={styles.addButton}
                    onClick={() => navigate('/admin/accounts/new')}
                    disabled={isLoading}
                >
                    Cadastrar Nova Conta
                </button>
            </div>
            <div className={styles.content}>
                {error && <p className={styles.error}>{error}</p>}
                
                {/* 
                  Se estiver carregando, não renderiza nada. 
                  Se não estiver, renderiza a tabela.
                  O Framer Motion cuidará da transição suave.
                */}
                {!isLoading && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome / Razão Social</th>
                                <th>Tipo</th>
                                <th>Responsável</th>
                                <th>Email de Acesso</th>
                                <th>Status</th>
                                <th>Criado em</th>
                                <th className={styles.actionsHeader}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.length > 0 ? (
                                accounts.map(account => {
                                    const owner = account.user;
                                    return (
                                        <tr key={account.id}>
                                            <td>{account.name || account.legalName}</td>
                                            <td>{account.type}</td>
                                            <td>{owner ? owner.name : 'N/A'}</td>
                                            <td>{owner ? owner.email : 'N/A'}</td>
                                            <td>
                                                <span className={`${styles.status} ${account.subscriptionStatus === 'active' ? styles.statusActive : styles.statusInactive}`}>
                                                    {account.subscriptionStatus || 'ativo'}
                                                </span>
                                            </td>
                                            <td>{new Date(account.createdAt).toLocaleDateString('pt-BR')}</td>
                                            <td className={styles.actionsCell}>
                                                <button className={styles.editButton} onClick={() => navigate(`/admin/accounts/edit/${account.id}`)}>Editar</button>
                                                <button className={styles.deleteButton} onClick={() => handleDelete(account.id)}>Excluir</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7">Nenhuma conta cadastrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageAccountsPage;
