// frontend/source/portals/account/pages/hotspot/PaymentConfigPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../../api/axiosConfig'; // Ajuste o caminho se necessário
import { HiArrowLeft, HiOutlineClock, HiOutlineExclamationCircle } from 'react-icons/hi';

// Mock de componentes que ainda vamos criar
const PlanSelector = ({ selectedPlanIds, onPlanChange }) => (
    <div className="p-4 bg-gray-100 rounded-md text-center text-gray-500">
        <p>Componente PlanSelector</p>
        <p className="text-xs">Planos selecionados: {selectedPlanIds.join(', ')}</p>
    </div>
);

const BackgroundPicker = ({ currentBackground, onBackgroundChange }) => (
    <div className="p-4 bg-gray-100 rounded-md text-center text-gray-500">
        <p>Componente BackgroundPicker</p>
        <p className="text-xs">Fundo atual: {currentBackground}</p>
    </div>
);


const PaymentConfigPage = () => {
    const { establishmentId } = useParams();
    const [config, setConfig] = useState({
        title: '',
        description: '',
        selectedPlanIds: [],
        backgroundUrl: ''
    });
    const [establishmentName, setEstablishmentName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const estRes = await api.get(`/api/establishments/${establishmentId}`);
                const paymentConfig = estRes.data.paymentConfig || {};

                setEstablishmentName(estRes.data.name);
                setConfig({
                    title: paymentConfig.title || 'Bem-vindo!',
                    description: paymentConfig.description || 'Para continuar, escolha um dos planos abaixo.',
                    selectedPlanIds: paymentConfig.selectedPlanIds || [],
                    backgroundUrl: paymentConfig.backgroundUrl || '/backgrounds/default.jpg'
                });

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError('Não foi possível carregar a configuração.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [establishmentId]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.patch(`/api/establishments/${establishmentId}/payment-config`, { paymentConfig: config });
            // Idealmente, mostrar um toast de sucesso
        } catch (err) {
            console.error("Erro ao salvar:", err);
            // Idealmente, mostrar um toast de erro
        } finally {
            setIsSaving(false);
        }
    };

    const handlePlanChange = (planId) => {
        setConfig(prev => {
            const newSelectedPlanIds = prev.selectedPlanIds.includes(planId)
                ? prev.selectedPlanIds.filter(id => id !== planId)
                : [...prev.selectedPlanIds, planId];
            return { ...prev, selectedPlanIds: newSelectedPlanIds };
        });
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-20">
                    <HiOutlineClock className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Carregando...</h3>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-20">
                    <HiOutlineExclamationCircle className="mx-auto h-12 w-12 text-red-400" />
                    <h3 className="mt-2 text-sm font-medium text-red-800">Erro ao Carregar</h3>
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Seção 1: Mensagem de Boas-Vindas */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4">Mensagem de Boas-Vindas</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título Principal</label>
                            <input
                                id="title"
                                type="text"
                                value={config.title}
                                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Texto de Descrição</label>
                            <textarea
                                id="description"
                                value={config.description}
                                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                            />
                        </div>
                    </div>
                </div>

                {/* Seção 2: Planos Disponíveis */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900">Planos Disponíveis</h3>
                    <p className="mt-1 text-sm text-gray-500">Selecione quais planos de acesso pago você quer oferecer neste hotspot. Os planos são criados na aba "Planos".</p>
                    <div className="mt-4">
                        <PlanSelector selectedPlanIds={config.selectedPlanIds} onPlanChange={handlePlanChange} />
                    </div>
                </div>

                {/* Seção 3: Imagem de Fundo */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900">Imagem de Fundo</h3>
                    <p className="mt-1 text-sm text-gray-500">Escolha uma imagem de fundo para a tela de login do hotspot.</p>
                    <div className="mt-4">
                        <BackgroundPicker currentBackground={config.backgroundUrl} onBackgroundChange={(url) => setConfig({ ...config, backgroundUrl: url })} />
                    </div>
                </div>

                {/* Caixa de Alerta */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <HiOutlineExclamationCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Para receber os pagamentos, seu token do Mercado Pago precisa estar configurado. {' '}
                                <Link to="/integrations" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                                    Configurar na página de integrações.
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 md:p-8">
            <div className="mb-6">
                <Link to={`/hotspot/config/${establishmentId}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <HiArrowLeft />
                    Voltar para as Modalidades
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Personalizar Acesso via Pagamento</h1>
                <p className="mt-1 text-gray-500">
                    Configurando para o estabelecimento: <strong className="text-gray-700">{establishmentName}</strong>
                </p>
            </div>

            {renderContent()}

            <div className="mt-8 pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                        disabled={isSaving || isLoading}
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfigPage;
