// frontend/source/portals/master/pages/accounts/AddAccountPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '@styles/FormPage.module.css';
import api from '@api/axiosConfig';
import AccountForm from '@components/AccountForm';

const AddAccountPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateSubmit = async (payload) => {
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            await api.post('/api/accounts', payload);
            setSuccess('Conta cadastrada com sucesso! Redirecionando...');
            setTimeout(() => navigate('/admin/accounts'), 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao cadastrar a conta.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Cadastrar Nova Conta</h1>
            <p className={styles.subtitle}>Preencha os dados da conta, do responsável e o endereço principal.</p>
            
            {success && <p className={styles.success}>{success}</p>}

            <AccountForm
                onSubmit={handleCreateSubmit}
                // MUDANÇA 1: Passando a função de cancelamento para o formulário
                onCancel={() => navigate('/admin/accounts')}
                isSubmitting={isSubmitting}
                serverError={error}
                isEditing={false}
            />

            {/* MUDANÇA 2: O grupo de botões extra foi REMOVIDO daqui */}
        </div>
    );
};

export default AddAccountPage;
