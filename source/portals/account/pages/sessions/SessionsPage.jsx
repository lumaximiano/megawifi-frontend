import React, { useState, useEffect } from 'react';
import { HiWifi, HiCash, HiUser, HiClock, HiCheckCircle, HiXCircle } from 'react-icons/hi';

// --- DADOS DE MOCKUP PARA VISUALIZAÇÃO ---
const mockActiveSessions = [
    { id: 's1', user: 'Maria Silva', location: 'Churrascaria Fogo', plan: 'Acesso 1 Hora', dataUsage: '15.2 MB' },
    { id: 's2', user: 'joao.gomes@email.com', location: 'Café Central', plan: 'Acesso Grátis (Vídeo)', dataUsage: '8.1 MB' },
    { id: 's3', user: '(11) 98877-6655', location: 'Churrascaria Fogo', plan: 'Acesso 1 Dia', dataUsage: '45.7 MB' },
];

const mockActivityFeed = [
    { id: 'e1', type: 'PAYMENT_SUCCESS', icon: HiCheckCircle, color: 'green', text: 'Pagamento de R$ 5,00 aprovado para (11) 98877-6655.', time: '13:54' },
    { id: 'e2', type: 'PIX_GENERATED', icon: HiCash, color: 'blue', text: 'PIX de R$ 5,00 gerado para (11) 98877-6655 no plano "Acesso 1 Dia".', time: '13:53' },
    { id: 'e3', type: 'USER_CONNECTED', icon: HiWifi, color: 'gray', text: 'joao.gomes@email.com conectou-se no Café Central.', time: '14:28' },
    { id: 'e4', type: 'USER_DISCONNECTED', icon: HiXCircle, color: 'red', text: 'Carlos Pereira desconectou-se.', time: '14:30' },
    { id: 'e5', type: 'USER_CONNECTED', icon: HiWifi, color: 'gray', text: 'Maria Silva conectou-se na Churrascaria Fogo.', time: '14:32' },
].sort((a, b) => b.id.slice(1) - a.id.slice(1));

const SessionsPage = () => {
    const [activeSessions, setActiveSessions] = useState(mockActiveSessions);
    const [activityFeed, setActivityFeed] = useState(mockActivityFeed);

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Sessões em Tempo Real</h1>
                <p className="mt-1 text-gray-500">Acompanhe as conexões e atividades dos seus hotspots ao vivo.</p>
            </div>

            {/* --- LAYOUT RECONSTRUÍDO COM FLEXBOX --- */}
            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Coluna Principal: Sessões Ativas (ocupa 2/3 do espaço em telas grandes) */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Usuários Online Agora</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uso de Dados</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {activeSessions.length > 0 ? activeSessions.map(session => (
                                        <tr key={session.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.user}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.plan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.dataUsage}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-gray-500">Nenhum usuário online no momento.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Coluna Lateral: Feed de Atividades (ocupa 1/3 do espaço em telas grandes) */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Feed de Atividades</h3>
                        </div>
                        <ul className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                            {activityFeed.map(event => {
                                const Icon = event.icon;
                                const colorClass = {
                                    green: 'bg-green-100 text-green-600',
                                    blue: 'bg-blue-100 text-blue-600',
                                    gray: 'bg-gray-100 text-gray-600',
                                    red: 'bg-red-100 text-red-600',
                                }[event.color] || 'bg-gray-100 text-gray-600';

                                return (
                                    <li key={event.id} className="flex items-start gap-3">
                                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                                            <Icon className="w-5 h-5" />
                                        </span>
                                        <div className="flex-grow">
                                            <p className="text-sm text-gray-700">{event.text}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{event.time}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

            </div>
        </>
    );
};

export default SessionsPage;
