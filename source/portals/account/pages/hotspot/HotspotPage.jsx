// frontend/source/portals/account/pages/hotspot/HotspotPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCog, HiOutlineExclamationCircle } from 'react-icons/hi';

const HotspotPage = () => {
    const navigate = useNavigate();

    // Esta função permanece para o futuro, quando houver dados.
    const handleConfigureClick = (establishmentId) => {
        navigate(`/hotspot/config/${establishmentId}`);
    };

    return (
        <div className="p-6 md:p-2">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gerenciar Hotspots</h1>
                <p className="mt-1 text-gray-500">
                    Aplique e gerencie as modalidades de acesso para cada um dos seus estabelecimentos.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estabelecimento</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roteador(es) Vinculado(s)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidade Ativa</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Ações</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* 
                            Renderiza diretamente o estado de "vazio", 
                            pois sabemos que não há dados.
                        */}
                        <tr>
                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                <HiOutlineExclamationCircle className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum hotspot encontrado</h3>
                                <p className="mt-1 text-sm text-gray-500">Vincule um roteador a um estabelecimento para começar.</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HotspotPage;
