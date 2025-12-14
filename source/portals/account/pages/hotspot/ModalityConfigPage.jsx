// frontend/source/portals/account/pages/hotspot/ModalityConfigPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../../api/axiosConfig'; // Ajuste o caminho se necessário
import { HiArrowLeft, HiExternalLink, HiOutlineClock, HiOutlineExclamationCircle } from 'react-icons/hi';

const ModalityConfigPage = () => {
    const { modalityType } = useParams();
    const navigate = useNavigate();

    const [config, setConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await api.get('/api/hotspot/modalities');
                const specificConfig = response.data.find(m => m.type.toLowerCase() === modalityType);
                if (specificConfig) {
                    setConfig(specificConfig);
                } else {
                    setError(`Configuração para "${modalityType}" não encontrada.`);
                    console.error(`Configuração para ${modalityType} não encontrada.`);
                }
            } catch (err) {
                setError("Não foi possível carregar a configuração da modalidade.");
                console.error("Erro ao buscar configuração da modalidade:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, [modalityType]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.post('/api/hotspot/modalities', [config]);
            // Idealmente, mostrar um toast de sucesso aqui
            navigate('/hotspot'); // Volta para a lista de hotspots
        } catch (error) {
            // Idealmente, mostrar um toast de erro aqui
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const renderPaymentConfig = () => (
        <>
            <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título na Página de Login</label>
                <p className="mt-1 text-sm text-gray-500">Este é o texto que aparecerá acima dos planos de pagamento.</p>
                <input
                    type="text"
                    id="title"
                    className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    value={config.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    disabled={!config.isActive}
                />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <h4 className="text-lg font-semibold text-blue-800">Gerenciamento Centralizado</h4>
                <p className="mt-1 text-sm text-blue-700">
                    As configurações de preço, duração e a sua chave do Mercado Pago são gerenciadas em seções dedicadas para manter tudo organizado.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Link to="/plans" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                        Gerenciar Planos de Acesso <HiExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                    <Link to="/integrations" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                        Configurar Mercado Pago <HiExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </>
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-20">
                    <HiOutlineClock className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Carregando...</h3>
                </div>
            );
        }

        if (error || !config) {
            return (
                <div className="text-center py-20">
                    <HiOutlineExclamationCircle className="mx-auto h-12 w-12 text-red-400" />
                    <h3 className="mt-2 text-sm font-medium text-red-800">Erro ao Carregar</h3>
                    <p className="mt-1 text-sm text-red-600">{error || "Não foi possível encontrar a configuração."}</p>
                </div>
            );
        }

        return (
            <>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {modalityType === 'payment' && renderPaymentConfig()}
                    {modalityType === 'video' && <p>O formulário de configuração para Vídeo será construído aqui.</p>}
                    {modalityType === 'survey' && <p>O formulário de configuração para Enquete será construído aqui.</p>}
                    {modalityType === 'slides' && <p>O formulário de configuração para Slides será construído aqui.</p>}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                        disabled={isSaving || !config.isActive}
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </>
        );
    };

    return (
        <div className="p-6 md:p-8">
            <div className="mb-6">
                <Link to="/hotspot" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <HiArrowLeft />
                    Voltar para Hotspots
                </Link>

                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate">
                            Configurar: {config?.title || 'Pagamento'}
                        </h1>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <label htmlFor="isActive" className="flex items-center cursor-pointer">
                            <span className="mr-3 text-sm font-medium text-gray-900">
                                {config?.isActive ? 'Ativa' : 'Inativa'}
                            </span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="sr-only"
                                    checked={config?.isActive || false}
                                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                />
                                <div className={`block w-14 h-8 rounded-full ${config?.isActive ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${config?.isActive ? 'transform translate-x-6' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default ModalityConfigPage;
