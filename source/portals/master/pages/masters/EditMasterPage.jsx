// frontend/source/portals/master/pages/users/EditMasterPage.jsx - VERSÃO CORRIGIDA

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MasterForm from '@global-components/form/MasterForm';
import api from '@api/axiosConfig';
import { FaSpinner } from 'react-icons/fa';

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
                setError('Falha ao carregar os dados do usuário. Verifique se o usuário existe e tente novamente.');
                console.error("Erro ao buscar dados do usuário:", err);
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
            // Navega para a página de gerenciamento com uma mensagem de sucesso
            navigate('/admin/masters', { state: { message: 'Usuário atualizado com sucesso!' } });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao atualizar o usuário.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Layout da página
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-4xl text-gray-500" />
                    <p className="ml-4 text-gray-600">Carregando dados do usuário...</p>
                </div>
            )}

            {!isLoading && error && !initialData && (
                 <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow text-center">
                    <h2 className="text-xl font-bold text-red-700">Erro ao Carregar</h2>
                    <p className="mt-2 text-gray-600">{error}</p>
                    <button
                        onClick={() => navigate('/admin/masters')}
                        className="mt-6 py-2 px-5 border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-250 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Voltar para a Lista
                    </button>
                </div>
            )}
            
            {!isLoading && initialData && (
                <MasterForm
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
