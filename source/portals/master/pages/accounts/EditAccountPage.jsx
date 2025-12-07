// frontend/source/portals/master/pages/accounts/EditAccountPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '@styles/FormPage.module.css';
import api from '@api/axiosConfig';
import AccountForm from '@components/AccountForm';

const EditAccountPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [initialData, setInitialData] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAccountData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/accounts/${id}`);
                setInitialData(response.data);
                setError('');
            } catch (err) {
                setError('Falha ao carregar os dados da conta.');
                console.error("Erro ao buscar dados da conta:", err);
                setInitialData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAccountData();
    }, [id]);

    const handleEditSubmit = async (payload) => {
        setError('');
        setIsSubmitting(true);
        try {
            await api.put(`/api/accounts/${id}`, payload);
            alert('Conta atualizada com sucesso!');
            navigate('/admin/accounts');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao atualizar a conta.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Editar Conta</h1>
            <p className={styles.subtitle}>Altere os dados da conta abaixo.</p>

            {!isLoading && error && <p className={styles.error}>{error}</p>}
            
            {!isLoading && initialData && (
                 <AccountForm
                    onSubmit={handleEditSubmit}
                    // MUDANÇA 1: Passando a função de cancelamento para o formulário
                    onCancel={() => navigate('/admin/accounts')}
                    initialData={initialData}
                    isSubmitting={isSubmitting}
                    serverError={error}
                    isEditing={true}
                />
            )}

            {/* MUDANÇA 2: O grupo de botões extra e feio foi REMOVIDO daqui */}
        </div>
    );
};

export default EditAccountPage;
