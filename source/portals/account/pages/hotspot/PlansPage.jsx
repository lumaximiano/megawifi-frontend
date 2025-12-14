// frontend/source/portals/account/pages/hotspot/PlansPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../../api/axiosConfig'; // Ajuste o caminho se necessário
import { HiPencil, HiTrash, HiPlus, HiX } from 'react-icons/hi';

const PlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/plans');
            setPlans(res.data);
        } catch (err) {
            setError('Não foi possível carregar os planos.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const resetForm = () => {
        setName('');
        setDuration('');
        setPrice('');
        setEditingId(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !duration || !price) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        const planData = {
            name,
            duration_minutes: parseInt(duration),
            price: parseFloat(price)
        };

        try {
            if (editingId) {
                await api.put(`/api/plans/${editingId}`, planData);
            } else {
                await api.post('/api/plans', planData);
            }
            resetForm();
            fetchPlans();
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao salvar o plano.');
        }
    };

    const handleEdit = (plan) => {
        setEditingId(plan.id);
        setName(plan.name);
        setDuration(plan.duration_minutes);
        setPrice(plan.price);
        window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja remover este plano?')) {
            try {
                await api.delete(`/api/plans/${id}`);
                fetchPlans();
            } catch (err) {
                setError(err.response?.data?.error || 'Erro ao remover o plano.');
            }
        }
    };

    return (
        <div className="p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Planos de Acesso</h1>
                <p className="mt-1 text-gray-500">
                    Crie e gerencie os planos de acesso (ex: 30 minutos, 1 dia) que serão oferecidos aos usuários finais.
                </p>
            </div>

            {/* Formulário de Criação/Edição */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-3">
                    {editingId ? 'Editando Plano' : 'Adicionar Novo Plano'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                        <div className="lg:col-span-1">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Plano</label>
                            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: Acesso 1 Hora" />
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duração (minutos)</label>
                            <input id="duration" type="number" value={duration} onChange={e => setDuration(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: 60" />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                            <input id="price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: 5.00" />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                <HiPlus className={`h-5 w-5 ${editingId ? 'hidden' : 'inline'}`} />
                                {editingId ? 'Salvar' : 'Adicionar'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    <HiX className="h-5 w-5" />
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>

            {/* Tabela de Planos */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duração</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="4" className="text-center py-10 text-gray-500">Carregando planos...</td></tr>
                        ) : plans.length > 0 ? plans.map(plan => (
                            <tr key={plan.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.duration_minutes} minutos</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {parseFloat(plan.price).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => handleEdit(plan)} className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1">
                                        <HiPencil /> Editar
                                    </button>
                                    <button onClick={() => handleDelete(plan.id)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-1">
                                        <HiTrash /> Remover
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center py-10 text-gray-500">Nenhum plano cadastrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlansPage;
