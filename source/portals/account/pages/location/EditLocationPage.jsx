// frontend/source/portals/account/pages/location/EditLocationPage.jsx - VERSÃO FINAL SIMPLES

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@api/axiosConfig';
import RegisterForm from '@global-components/form/RegisterForm';

const EditLocationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [initialData, setInitialData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/locations/${id}`);
                setInitialData(response.data); // Direto da API para o formulário.
            } catch (err) {
                setError('Não foi possível carregar os dados do cliente.');
                console.error("Erro ao buscar localização:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLocation();
    }, [id]);

    const handleUpdateSubmit = async (formData) => {
        setIsSubmitting(true);
        setError('');

        // Monta o payload para o backend
        const payload = {
            accountType: formData.accountType,
            name: formData.accountType === 'PF' ? formData.name : formData.legalName,
            fantasyName: formData.fantasyName,
            document: formData.accountType === 'PF' ? formData.cpf : formData.cnpj,
            email: formData.ownerEmail,
            phone: formData.ownerPhone,
            address: {
                cep: formData.cep,
                street: formData.address,
                number: formData.number,
                complement: formData.complement,
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state
            }
        };

        try {
            await api.put(`/api/locations/${id}`, payload);
            navigate('/account/locations');
        } catch (err) {
            setError(err.response?.data?.message || 'Ocorreu um erro ao salvar as alterações.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Editar Cliente</h1>
                    <p className="mt-1 text-gray-500">Altere os dados do cliente abaixo.</p>
                </div>
                {isLoading && <div className="text-center py-10"><p>Carregando dados do cliente...</p></div>}
                {error && !isLoading && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><strong className="font-bold">Erro: </strong><span className="block sm:inline">{error}</span></div>}
                {!isLoading && initialData && (
                    <RegisterForm
                        onSubmit={handleUpdateSubmit}
                        onCancel={() => navigate('/account/locations')}
                        isSubmitting={isSubmitting}
                        serverError={error}
                        initialData={initialData}
                        isEditing={true}
                    />
                )}
            </div>
        </div>
    );
};

export default EditLocationPage;
