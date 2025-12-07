import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '@styles/FormPage.module.css';
import api from '@api/axiosConfig';
import UserForm from './UserForm'; // Importando o formulário de usuário

const EditMasterPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [initialData, setInitialData] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Busca os dados do Master ao carregar a página
    useEffect(() => {
        const fetchMasterData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/users/${id}`);
                setInitialData(response.data);
                setError('');
            } catch (err) {
                setError('Falha ao carregar os dados do Master.');
                console.error("Erro ao buscar dados do Master:", err);
                setInitialData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMasterData();
    }, [id]);

    // Lida com o envio do formulário de edição
    const handleEditSubmit = async (payload) => {
        setError('');
        setIsSubmitting(true);
        try {
            await api.put(`/api/users/${id}`, payload);
            alert('Master atualizado com sucesso!');
            navigate('/admin/masters');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao atualizar o Master.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Editar Master</h1>
            <p className={styles.subtitle}>Altere os dados do usuário abaixo.</p>

            {isLoading && <p>Carregando dados...</p>}
            {!isLoading && error && <p className={styles.error}>{error}</p>}
            
            {!isLoading && initialData && (
                 <UserForm
                    onSubmit={handleEditSubmit}
                    onCancel={() => navigate('/admin/masters')}
                    initialData={initialData}
                    isSubmitting={isSubmitting}
                    serverError={error}
                    isEditing={true}
                />
            )}
        </div>
    );
};

export default EditMasterPage;
