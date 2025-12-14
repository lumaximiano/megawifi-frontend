// frontend/source/portals/account/pages/hotspot/SelectModalityPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../../api/axiosConfig'; // Ajuste o caminho se necessário
import { HiCreditCard, HiPhotograph, HiChartBar, HiPlay, HiArrowLeft, HiOutlineClock, HiOutlineExclamationCircle } from 'react-icons/hi';

const modalityDetails = {
    PAYMENT: { title: 'Acesso via Pagamento', description: 'Venda planos de acesso com pagamento via PIX.', icon: HiCreditCard, color: 'blue' },
    SLIDES: { title: 'Acesso via Slides', description: 'Mostre uma sequência de imagens para dar acesso.', icon: HiPhotograph, color: 'purple' },
    SURVEY: { title: 'Acesso via Enquete', description: 'Colete feedback valioso em troca de internet.', icon: HiChartBar, color: 'yellow' },
    VIDEO: { title: 'Acesso via Vídeo', description: 'Libere acesso após o cliente assistir a um vídeo.', icon: HiPlay, color: 'red' },
};

const SelectModalityPage = () => {
    const { establishmentId } = useParams();
    const navigate = useNavigate();

    const [establishment, setEstablishment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const estRes = await api.get(`/api/establishments/${establishmentId}`);
                setEstablishment(estRes.data);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError('Não foi possível carregar as configurações.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [establishmentId]);

    const handleActivate = async (modalityType) => {
        try {
            const response = await api.patch(`/api/establishments/${establishmentId}/activate-modality`, { modalityType });
            setEstablishment(response.data);
            // Idealmente, usar um toast de sucesso
        } catch (err) {
            console.error("Erro ao ativar modalidade:", err);
            // Idealmente, usar um toast de erro
        }
    };

    const handlePersonalizeClick = (modalityType) => {
        if (modalityType === 'PAYMENT') {
            navigate(`/hotspot/config/${establishmentId}/payment`);
        } else {
            navigate(`/hotspot/config/${modalityType.toLowerCase()}`);
        }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.keys(modalityDetails).map(type => {
                    const details = modalityDetails[type];
                    const isActive = establishment?.activeModalityType === type;
                    const Icon = details.icon;

                    const colorClasses = {
                        blue: {
                            border: 'border-blue-500',
                            iconBg: 'bg-blue-100',
                            iconText: 'text-blue-600',
                            button: 'bg-blue-600 hover:bg-blue-700 text-white',
                        },
                        purple: {
                            border: 'border-purple-500',
                            iconBg: 'bg-purple-100',
                            iconText: 'text-purple-600',
                            button: 'bg-purple-600 hover:bg-purple-700 text-white',
                        },
                        yellow: {
                            border: 'border-yellow-500',
                            iconBg: 'bg-yellow-100',
                            iconText: 'text-yellow-600',
                            button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                        },
                        red: {
                            border: 'border-red-500',
                            iconBg: 'bg-red-100',
                            iconText: 'text-red-600',
                            button: 'bg-red-600 hover:bg-red-700 text-white',
                        },
                    };
                    const colors = colorClasses[details.color] || colorClasses.blue;

                    return (
                        <div
                            key={type}
                            className={`bg-white rounded-lg shadow-md flex flex-col transition-all duration-300 ${isActive ? `border-2 ${colors.border} transform scale-105` : 'border-2 border-transparent'}`}
                        >
                            <div className="p-6 flex-grow">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.iconBg} mb-4`}>
                                    <Icon className={`w-7 h-7 ${colors.iconText}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{details.title}</h3>
                                <p className="mt-1 text-sm text-gray-500">{details.description}</p>
                            </div>
                            <div className="bg-gray-50 p-4 flex items-center justify-between rounded-b-lg">
                                <button
                                    onClick={() => handlePersonalizeClick(type)}
                                    className="text-sm font-medium text-gray-600 hover:text-blue-600"
                                >
                                    Personalizar
                                </button>
                                <button
                                    onClick={() => handleActivate(type)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-full ${isActive ? colors.button : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {isActive ? 'ATIVO' : 'ATIVAR'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-6 md:p-8">
            <div className="mb-6">
                <Link to="/hotspot" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <HiArrowLeft />
                    Voltar para Hotspots
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Modalidades de Acesso</h1>
                <p className="mt-1 text-gray-500">
                    Escolha como os clientes do estabelecimento <strong className="text-gray-700">{establishment?.name}</strong> se conectarão à sua rede.
                </p>
            </div>
            {renderContent()}
        </div>
    );
};

export default SelectModalityPage;
