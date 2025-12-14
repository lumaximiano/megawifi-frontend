import React, { useState, useEffect } from 'react';
import { HiOutlineClock } from 'react-icons/hi';

const PlanSelector = ({ selectedPlanIds, onPlanChange }) => {
    const [allPlans, setAllPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // Simulação da chamada da API
                const mockPlans = [
                    { id: 'plan-1', name: '30 Minutos', price: 2.50, durationMinutes: 30 },
                    { id: 'plan-2', name: '1 Hora', price: 4.00, durationMinutes: 60 },
                    { id: 'plan-3', name: 'Diária 24h', price: 10.00, durationMinutes: 1440 },
                    { id: 'plan-4', name: 'Acesso VIP', price: 15.00, durationMinutes: 1440 },
                ];
                // const res = await api.get('/api/plans');
                setAllPlans(mockPlans);
            } catch (error) {
                console.error("Erro ao buscar planos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-500">
                <HiOutlineClock className="h-5 w-5 mr-2 animate-spin" />
                <span>Carregando planos...</span>
            </div>
        );
    }

    if (allPlans.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                <p>Nenhum plano de acesso pago foi criado ainda.</p>
                <p className="text-sm">Você pode criá-los na seção "Planos".</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPlans.map(plan => {
                const isSelected = selectedPlanIds.includes(plan.id);
                return (
                    <label
                        key={plan.id}
                        className={`
                            p-4 border rounded-lg cursor-pointer transition-all duration-200
                            flex items-center justify-between
                            ${isSelected ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                        `}
                    >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onPlanChange(plan.id)}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="ml-4">
                                <span className="font-semibold text-gray-800">{plan.name}</span>
                                <span className="block text-sm text-gray-500">{plan.durationMinutes} minutos</span>
                            </div>
                        </div>
                        <span className="font-bold text-lg text-blue-600">
                            R$ {plan.price.toFixed(2).replace('.', ',')}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};

export default PlanSelector;
