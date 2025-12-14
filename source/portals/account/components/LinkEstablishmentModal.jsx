import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';

const LinkEstablishmentModal = ({ router, onClose, onLinkSuccess }) => {
    const [establishments, setEstablishments] = useState([]);
    const [selectedEstablishmentId, setSelectedEstablishmentId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEstablishments = async () => {
            try {
                // Simulação da chamada da API
                // const res = await api.get('/api/establishments');
                const mockEstablishments = [
                    { id: 'est-1', name: 'Churrascaria Fogo no Chão' },
                    { id: 'est-2', name: 'Padaria Pão Quente' },
                    { id: 'est-3', name: 'Academia Corpo em Forma' },
                ];
                setEstablishments(mockEstablishments);
                
                if (router.establishmentId) {
                    setSelectedEstablishmentId(router.establishmentId);
                }
            } catch (err) {
                setError('Não foi possível carregar os estabelecimentos.');
            } finally {
                setLoading(false);
            }
        };
        fetchEstablishments();
    }, [router.establishmentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Simulação da chamada da API
            // await api.patch(`/api/routers/${router.id}/link`, { establishmentId: selectedEstablishmentId || null });
            console.log(`Vinculando roteador ${router.id} ao estabelecimento ${selectedEstablishmentId || 'null'}`);
            onLinkSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao vincular roteador.');
        }
    };

    if (!router) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Vincular Roteador</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                        <HiX className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <p className="text-sm text-gray-600 mb-4">
                            Vincule o roteador <strong className="text-gray-800">{router.name}</strong> a um dos seus estabelecimentos cadastrados.
                        </p>
                        <div>
                            <label htmlFor="establishment-select" className="block text-sm font-medium text-gray-700">Estabelecimento</label>
                            <select
                                id="establishment-select"
                                value={selectedEstablishmentId}
                                onChange={(e) => setSelectedEstablishmentId(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                disabled={loading}
                            >
                                <option value="">-- Desvincular / Nenhum --</option>
                                {establishments.map(est => (
                                    <option key={est.id} value={est.id}>
                                        {est.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {loading && <p className="text-sm text-gray-500 mt-2">Carregando estabelecimentos...</p>}
                        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300" disabled={loading}>
                            Salvar Vínculo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LinkEstablishmentModal;
