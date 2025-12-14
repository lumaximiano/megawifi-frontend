// frontend/source/portals/master/pages/users/AddMasterPage.jsx - VERSÃO CORRIGIDA

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@api/axiosConfig';
import MasterForm from '@global-components/form/MasterForm'; 

const AddMasterPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateSubmit = async (payload) => {
        setError('');
        setIsSubmitting(true);

        // Adiciona a role 'MASTER' ao payload antes de enviar
        const finalPayload = { ...payload, role: 'MASTER' };

        try {
            await api.post('/api/users', finalPayload); 
            
            // Navega para a página de gerenciamento com uma mensagem de sucesso
            navigate('/admin/masters', { state: { message: 'Usuário Master cadastrado com sucesso!' } });

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao cadastrar o usuário.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // O layout da página agora é apenas um contêiner. O MasterForm já tem seu próprio estilo.
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <MasterForm
                onSubmit={handleCreateSubmit}
                onCancel={() => navigate('/admin/masters')}
                isSubmitting={isSubmitting}
                serverError={error}
                isEditing={false} // Garante que o formulário está em modo de criação
            />
        </div>
    );
};

export default AddMasterPage;
