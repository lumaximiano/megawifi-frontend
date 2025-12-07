// frontend/src/components/PlanSelector.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/PlanSelector.module.css';

const PlanSelector = ({ selectedPlanIds, onPlanChange }) => {
    const [allPlans, setAllPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('/api/plans', { headers: { 'Authorization': `Bearer ${token}` } });
                setAllPlans(res.data);
            } catch (error) {
                console.error("Erro ao buscar planos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (isLoading) return <p>Carregando planos...</p>;

    return (
        <div className={styles.planGrid}>
            {allPlans.length > 0 ? allPlans.map(plan => (
                <label key={plan.id} className={styles.planCard}>
                    <input
                        type="checkbox"
                        checked={selectedPlanIds.includes(plan.id)}
                        onChange={() => onPlanChange(plan.id)}
                    />
                    <div className={styles.planDetails}>
                        <span className={styles.planName}>{plan.name}</span>
                        <span className={styles.planPrice}>
                            R$ {plan.price.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                    <span className={styles.planDuration}>{plan.durationMinutes} minutos</span>
                </label>
            )) : <p>Nenhum plano encontrado. Crie um na aba "Planos".</p>}
        </div>
    );
};

export default PlanSelector;
