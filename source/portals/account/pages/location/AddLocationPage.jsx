// frontend/source/portals/account/pages/locations/AddLocationPage.jsx - VERSÃO FINAL E CORRETA

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from "@global-components/form/RegisterForm";
import api from '@api/axiosConfig';

const AddLocationPage = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleCreateLocation = async (formData) => {
        setIsSubmitting(true);
        setServerError('');

        const payload = {
            // Se for PF, usa o nome. Se for PJ, usa a Razão Social.
            name: formData.accountType === 'PF' ? formData.name : formData.legalName,
            fantasyName: formData.fantasyName,
            // Se for PF, usa o CPF. Se for PJ, usa o CNPJ.
            document: formData.accountType === 'PF' ? formData.cpf : formData.cnpj,
            email: formData.ownerEmail, // O nome correto é ownerEmail
            phone: formData.ownerPhone, // O nome correto é ownerPhone

            // Dados de Endereço
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
            await api.post('/api/locations', payload);
            navigate('/account/locations');
        } catch (error) {
            setServerError(error.response?.data?.message || "Ocorreu um erro ao salvar o cliente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Cadastrar Novo Cliente</h1>
                    <p className="mt-1 text-gray-500">Preencha os dados do seu novo cliente final.</p>
                </div>
                
                <RegisterForm 
                    onSubmit={handleCreateLocation} 
                    onCancel={() => navigate('/account/locations')}
                    isSubmitting={isSubmitting}
                    serverError={serverError}
                />
            </div>
        </div>
    );
};

export default AddLocationPage;
