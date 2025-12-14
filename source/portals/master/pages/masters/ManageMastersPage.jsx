// frontend/source/portals/master/pages/users/ManageMastersPage.jsx - VERSÃO FINAL E CONSISTENTE

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@api/axiosConfig';
import { FaPencilAlt, FaTrash, FaSpinner, FaPlus } from 'react-icons/fa'; // Ícones para os botões

const ManageMastersPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook para ler o state da navegação

    const [masters, setMasters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Busca os dados iniciais e verifica por mensagens de sucesso
    useEffect(() => {
        // Verifica se há uma mensagem de sucesso vinda da página de edição/criação
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Limpa o state para não mostrar a mensagem novamente ao recarregar
            window.history.replaceState({}, document.title);
        }

        const fetchMasters = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/users', {
                    params: { role: 'MASTER' } // Garante que estamos buscando apenas usuários Master
                });
                setMasters(response.data);
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Falha ao carregar a lista de usuários.');
                console.error("Erro ao buscar masters:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMasters();
    }, [location.state]); // Roda o efeito se o state da localização mudar

    const handleEdit = (masterId) => {
        navigate(`/admin/masters/edit/${masterId}`);
    };

    const handleDelete = async (masterId) => {
        if (!window.confirm("Você tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.")) {
            return;
        }
        try {
            await api.delete(`/api/users/${masterId}`);
            setMasters(currentMasters => currentMasters.filter(master => master.id !== masterId));
            setSuccessMessage('Usuário removido com sucesso.'); // Feedback imediato
        } catch (err) {
            setError(err.response?.data?.message || 'Falha ao remover o usuário.');
            console.error("Erro ao deletar Master:", err);
        }
    };

    // Layout da página com estilo consistente
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Usuários Master</h1>
                        <p className="mt-1 text-sm text-gray-600">Adicione, edite ou remova usuários com acesso ao painel Master.</p>
                    </div>
                    <button
                        className="flex items-center gap-2 py-2 px-5 border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-250 bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => navigate('/admin/masters/new')}
                        disabled={isLoading}
                    >
                        <FaPlus size={14} />
                        Cadastrar Master
                    </button>
                </div>

                {/* Alertas de Sucesso e Erro com estilo consistente */}
                {successMessage && <div className="p-4 rounded-md mb-4 text-center text-green-800 bg-green-100">{successMessage}</div>}
                {error && <div className="p-4 rounded-md mb-4 text-center text-red-700 bg-red-100">{error}</div>}

                {/* Tabela de Usuários */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nome</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Criado em</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                        <FaSpinner className="animate-spin inline-block mr-2" /> Carregando usuários...
                                    </td></tr>
                                ) : masters.length > 0 ? (
                                    masters.map(master => (
                                        <tr key={master.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{master.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{master.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(master.createdAt).toLocaleDateString('pt-BR')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                                <button onClick={() => handleEdit(master.id)} className="text-blue-600 hover:text-blue-800" title="Editar"><FaPencilAlt /></button>
                                                <button onClick={() => handleDelete(master.id)} className="text-red-600 hover:text-red-800" title="Excluir"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">Nenhum usuário master cadastrado.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMastersPage;
