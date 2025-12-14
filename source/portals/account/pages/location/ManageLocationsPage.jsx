// ManageLocationsPage.jsx - VERSÃO FINAL COM AS COLUNAS CORRETAS

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash, HiOutlineExclamationCircle } from 'react-icons/hi';
import api from '@api/axiosConfig';

const ManageLocationsPage = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await api.get('/api/locations');
                setLocations(response.data);
            } catch (err) {
                setError('Não foi possível carregar os clientes. Tente recarregar a página.');
                console.error("Erro ao buscar locais:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLocations();
    }, []);

    const handleEdit = (id) => { navigate(`/account/location/edit/${id}`); };
    const handleDelete = (locationId) => alert(`Funcionalidade de deletar o cliente ${locationId} ainda não implementada.`);

    // Esta função não é mais necessária, mas podemos mantê-la para uso futuro.
    const formatAddress = (address) => {
        if (!address || typeof address !== 'object') return 'Endereço não informado';
        const parts = [address.street, address.number, address.neighborhood, address.city, address.state];
        return parts.filter(part => part).join(', ') || 'Endereço incompleto';
    };

    const renderTableBody = () => {
        if (isLoading) return <tr><td colSpan="5" className="px-6 py-16 text-center text-gray-500">Carregando clientes...</td></tr>;
        if (error) return <tr><td colSpan="5" className="px-6 py-16 text-center text-red-500"><HiOutlineExclamationCircle className="mx-auto h-10 w-10 text-red-400" /><h3 className="mt-2 font-semibold text-gray-800">Ocorreu um erro</h3><p className="text-sm text-gray-600">{error}</p></td></tr>;
        if (locations.length === 0) return <tr><td colSpan="5" className="px-6 py-16 text-center text-gray-500"><HiOutlineExclamationCircle className="mx-auto h-10 w-10 text-gray-400" /><h3 className="mt-2 font-semibold text-gray-800">Nenhum cliente cadastrado</h3><p className="text-sm text-gray-600">Clique em "Cadastrar Cliente" para adicionar o primeiro.</p></td></tr>;

        return locations.map((location) => (
            <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                {/* ================================================================= */}
                {/* MUDANÇA PRINCIPAL: Exibindo os dados corretos do location        */}
                {/* ================================================================= */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.document || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(location.id)} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Editar Cliente">
                        <HiPencil className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(location.id)} className="text-red-600 hover:text-red-900" title="Excluir Cliente">
                        <HiTrash className="h-5 w-5" />
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    {/* Títulos atualizados para refletir a nova realidade */}
                    <h1 className="text-3xl font-bold text-gray-800">Meus Clientes</h1>
                    <p className="mt-1 text-gray-500">Gerencie os clientes finais que utilizam seus serviços.</p>
                </div>
                <button
                    onClick={() => navigate('/account/locations/new')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                >
                    <HiPlus className="h-5 w-5" />
                    Cadastrar Cliente
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* ================================================================= */}
                            {/* MUDANÇA PRINCIPAL: Cabeçalhos da tabela atualizados             */}
                            {/* ================================================================= */}
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome / Razão Social</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF / CNPJ</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email de Contato</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderTableBody()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageLocationsPage;
