import React from 'react';
import { HiOutlineCurrencyDollar, HiOutlineOfficeBuilding, HiOutlineWifi, HiOutlineUserAdd } from 'react-icons/hi';

const DashboardPage = () => {
    const kpiData = {
        revenue: 'R$ 1.258,90',
        activeLocations: '18',
        totalLocations: '25',
        usersOnline: '132',
        newSignups: '47'
    };

    const topLocations = [
        { name: 'Churrascaria Fogo no Chão', connections: 87 },
        { name: 'Barbearia do Joca', connections: 54 },
        { name: 'Café da Praça', connections: 32 },
    ];

    const recentSignups = [
        { name: 'Maria Oliveira', contact: '(11) 11111-1111', location: 'Churrascaria Fogo no Chão' },
        { name: 'Carlos Souza', contact: '(11) 11111-1111', location: 'Barbearia do Joca' },
        { name: 'Ana Pereira', contact: 'ana.p@email.com', location: 'Café da Praça' },
    ];

    return (
        <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <HiOutlineCurrencyDollar className="text-green-600 text-3xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{kpiData.revenue}</p>
                        <p className="text-sm text-gray-500">Receita Mensal</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <HiOutlineOfficeBuilding className="text-blue-600 text-3xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{kpiData.activeLocations} / {kpiData.totalLocations}</p>
                        <p className="text-sm text-gray-500">Clientes Ativos</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <HiOutlineWifi className="text-yellow-600 text-3xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{kpiData.usersOnline}</p>
                        <p className="text-sm text-gray-500">Usuários Online</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                        <HiOutlineUserAdd className="text-purple-600 text-3xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{kpiData.newSignups}</p>
                        <p className="text-sm text-gray-500">Novos Cadastros (Hoje)</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Usuários Conectados (Últimos 7 Dias)</h3>
                <div className="h-72 bg-gray-100 flex items-center justify-center rounded-md">
                    <p className="text-gray-400">[Componente de Gráfico será inserido aqui]</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Top 5 Locations (Hoje)</h3>
                    <ul className="space-y-4">
                        {topLocations.map((loc, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span className="text-gray-600">{loc.name}</span>
                                <span className="font-bold text-gray-800">{loc.connections}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Últimos Cadastros</h3>
                    <ul className="space-y-4">
                        {recentSignups.map((user, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-600">{user.name}</p>
                                    <p className="text-xs text-gray-400">{user.location}</p>
                                </div>
                                <span className="text-sm text-gray-500">{user.contact}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
