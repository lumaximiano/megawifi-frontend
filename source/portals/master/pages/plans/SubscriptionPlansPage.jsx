// frontend/src/pages/SubscriptionPlansPage.jsx - v3 - ESTRATÉGIA DE PLANOS FINAL

import React from 'react';
import styles from '@css/ListPage.module.css';
import planStyles from '@css/SubscriptionPlansPage.module.css'; // 1. Importa um CSS específico para esta página

const SubscriptionPlansPage = () => {

    // --- DADOS FINAIS DOS PLANOS (MOCK DATA) ---
    const finalPlans = [
        { id: 'starter', name: 'Starter', price: 'R$ 69,90', routerLimit: 'Até 5', isPopular: false },
        { id: 'prata', name: 'Prata', price: 'R$ 149,90', routerLimit: 'Até 20', isPopular: true },
        { id: 'ouro', name: 'Ouro', price: 'R$ 299,90', routerLimit: 'Até 50', isPopular: false },
        { id: 'diamante', name: 'Diamante', price: 'R$ 499,90', routerLimit: 'Até 100', isPopular: false },
    ];

    return (
        <div className={styles.listPageContainer}>
            <div className={styles.header}>
                <h1>Planos de Assinatura</h1>
                <button className={styles.addButton} onClick={() => alert('Abrir modal para criar novo plano')}>
                    Criar Novo Plano
                </button>
            </div>
            <div className={styles.content}>
                <table>
                    <thead>
                        <tr>
                            <th>Nome do Plano</th>
                            <th>Preço Mensal</th>
                            <th>Limite de Roteadores</th>
                            <th className={styles.actionsHeader}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finalPlans.map(plan => (
                            // 2. Adiciona uma classe na linha do plano popular para o destaque
                            <tr key={plan.id} className={plan.isPopular ? planStyles.popularPlan : ''}>
                                <td className={planStyles.planNameCell}>
                                    {plan.name}
                                    {/* 3. Adiciona a tag "Mais Popular" */}
                                    {plan.isPopular && <span className={planStyles.popularTag}>Mais Popular</span>}
                                </td>
                                <td className={planStyles.priceCell}>{plan.price}</td>
                                <td>{plan.routerLimit}</td>
                                <td className={styles.actionsCell}>
                                    <button onClick={() => alert(`Editar plano ${plan.id}`)} className={styles.editButton}>Editar</button>
                                    <button onClick={() => alert(`Excluir plano ${plan.id}`)} className={styles.deleteButton}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriptionPlansPage;
