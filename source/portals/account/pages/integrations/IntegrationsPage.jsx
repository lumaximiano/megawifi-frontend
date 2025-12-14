import React, { useState, useEffect } from 'react';
import api from '../../../../api/axiosConfig';
import { HiEye, HiEyeOff, HiCheckCircle, HiXCircle } from 'react-icons/hi';

const IntegrationsPage = () => {
    const [mpAccessToken, setMpAccessToken] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isTokenVisible, setIsTokenVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchToken = async () => {
            setIsLoading(true);
            try {
                const res = await api.get('/api/settings/mp_access_token');
                setMpAccessToken(res.data.value || '');
            } catch (err) {
                // Erro silencioso, o campo apenas ficará vazio
            } finally {
                setIsLoading(false);
            }
        };
        fetchToken();
    }, []);

    const handleSave = async () => {
        setMessage({ text: '', type: '' });
        try {
            await api.post('/api/settings/mp_access_token', { value: mpAccessToken });
            setMessage({ text: 'Credencial salva com sucesso!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Erro ao salvar. Verifique o token e a conexão.', type: 'error' });
        } finally {
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Integrações</h1>
                <p className="mt-1 text-gray-500">Conecte serviços de terceiros para expandir as funcionalidades do seu sistema.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md max-w-2xl">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Gateway de Pagamento: Mercado Pago</h3>
                    <p className="mt-1 text-sm text-gray-500">Insira suas credenciais para habilitar a venda de planos de acesso via PIX.</p>
                </div>
                
                <div className="p-6">
                    <label htmlFor="mp_token" className="block text-sm font-medium text-gray-700 mb-1">
                        Access Token
                    </label>
                    
                    <div className="relative">
                        <input
                            id="mp_token"
                            type={isTokenVisible ? 'text' : 'password'}
                            value={mpAccessToken}
                            onChange={e => setMpAccessToken(e.target.value)}
                            className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="APP_USR-..."
                            disabled={isLoading}
                        />
                        <button 
                            type="button"
                            onClick={() => setIsTokenVisible(!isTokenVisible)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                            title={isTokenVisible ? 'Ocultar token' : 'Mostrar token'}
                            disabled={isLoading}
                        >
                            {isTokenVisible ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                        </button>
                    </div>
                    
                    {isLoading && <p className="text-xs text-gray-400 mt-1">Carregando credencial...</p>}
                    
                    {message.text && (
                        <div className={`mt-4 flex items-center gap-2 text-sm p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.type === 'success' ? <HiCheckCircle className="h-5 w-5" /> : <HiXCircle className="h-5 w-5" />}
                            <span>{message.text}</span>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4 text-right rounded-b-lg">
                    <button 
                        onClick={handleSave} 
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                        disabled={isLoading}
                    >
                        Salvar Credencial
                    </button>
                </div>
            </div>
        </>
    );
};

export default IntegrationsPage;
