import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { HiPlus, HiTerminal } from 'react-icons/hi';

// Mock dos componentes
const StatusIndicator = ({ status }) => null;
const RouterStatsPanel = () => null;
const DhcpLeasePanel = () => null;
const EditRouterModal = () => null;
const LinkEstablishmentModal = () => null;
const ScriptModal = () => null;

const RoutersPage = () => {
    const [name, setName] = useState('');
    const [mac, setMac] = useState('');
    const [apiIp, setApiIp] = useState('');
    
    // 1. NOVO ESTADO PARA CONTROLAR A VALIDADE DO IP
    const [isIpValid, setIsIpValid] = useState(true);

    const handleSubmit = (e) => { e.preventDefault(); alert('Funcionalidade de adicionar será implementada.'); };
    const handleGenerateScript = () => alert('Funcionalidade de gerar script será implementada.');

    // 2. FUNÇÃO DE VALIDAÇÃO
    const validateIp = (ip) => {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    };

    // 3. EFEITO QUE RODA A CADA MUDANÇA NO CAMPO IP
    useEffect(() => {
        if (apiIp === '') {
            setIsIpValid(true); // Válido se estiver vazio (pois não é 'required' para a validação em tempo real)
        } else {
            setIsIpValid(validateIp(apiIp));
        }
    }, [apiIp]);

    // 4. CLASSE DINÂMICA PARA A BORDA DO INPUT
    const ipInputClass = `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
        !isIpValid ? 'border-red-500' : 'border-gray-300'
    }`;

    return (
        <div className="p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciar Roteadores</h1>
                <p className="mt-1 text-gray-500">Adicione e configure seus roteadores Mikrotik.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Roteador</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 items-end">
                    
                    <div>
                        <label htmlFor="router-name" className="block text-sm font-medium text-gray-700">Nome</label>
                        <input id="router-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Roteador Loja A" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="router-mac" className="block text-sm font-medium text-gray-700">Endereço MAC</label>
                        <InputMask id="router-mac" mask="** : ** : ** : ** : ** : **" value={mac} onChange={e => setMac(e.target.value.toUpperCase())} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="AA : BB : CC : DD : EE : FF" required>
                            {(inputProps) => <input {...inputProps} type="text" />}
                        </InputMask>
                    </div>

                    {/* --- CAMPO IP SEM MÁSCARA, COM VALIDAÇÃO VISUAL --- */}
                    <div>
                        <label htmlFor="router-ip" className="block text-sm font-medium text-gray-700">IP da WAN</label>
                        <input
                            id="router-ip"
                            type="text"
                            value={apiIp}
                            onChange={e => setApiIp(e.target.value)}
                            placeholder="Ex: 192.168.1.100"
                            className={ipInputClass} // Usa a classe dinâmica
                            required
                        />
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400" disabled={!isIpValid && apiIp !== ''}>
                            <HiPlus /> Adicionar
                        </button>
                        <button type="button" onClick={handleGenerateScript} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                            <HiTerminal /> Script
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAC</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vinculado a</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td colSpan="5" className="text-center py-10 text-gray-500">Nenhum roteador cadastrado.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoutersPage;
