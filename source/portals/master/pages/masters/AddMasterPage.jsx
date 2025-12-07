import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '@styles/FormPage.module.css';
import api from '@api/axiosConfig';
import UserForm from './UserForm'; // Importando o formulário reutilizável

const AddMasterPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateSubmit = async (payload) => {
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        // Adiciona a role 'MASTER' que é específica para a criação
        const finalPayload = { ...payload, role: 'MASTER' };

        try {
            await api.post('/api/users', finalPayload);
            setSuccess('Master cadastrado com sucesso! Redirecionando...');
            setTimeout(() => navigate('/admin/masters', { state: { refresh: true } }), 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao cadastrar o Master.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Cadastrar Novo Master</h1>
            <p className={styles.subtitle}>Preencha os dados do novo usuário Master.</p>
            
            {success && <p className={styles.success}>{success}</p>}

            <UserForm
                onSubmit={handleCreateSubmit}
                onCancel={() => navigate('/admin/masters')}
                isSubmitting={isSubmitting}
                serverError={error}
                isEditing={false} // Define que estamos no modo de criação
            />
        </div>
    );
};

export default AddMasterPage;
