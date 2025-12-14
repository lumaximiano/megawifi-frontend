// frontend/source/portals/account/pages/plans/SubscriptionLocation.jsx

import React from 'react';
import { HiPlus } from 'react-icons/hi';
import styles from '../../css/SubscriptionLocationPage.module.css';

const SubscriptionLocation = () => {
    const accountPlans = [
        { id: 'essencial', name: 'Essencial', price: 'R$ 49,90', isPopular: false },
        { id: 'marketing', name: 'Marketing', price: 'R$ 69,90', isPopular: true },
        { id: 'completo', name: 'Completo', price: 'R$ 89,90', isPopular: false },
    ];

    return (
        <div className={styles.listPageContainer}>
            <div className={styles.header}>
                <div>
                    <h1>Planos para Locations</h1>
                    <p className={styles.subtitle}>Gerencie os planos que você oferece aos seus estabelecimentos.</p>
                </div>
                <button className={styles.addButton} onClick={() => alert('Abrir modal para criar novo plano')}>
                    <HiPlus />
                    <span>Criar Novo Plano</span>
                </button>
            </div>
            <div className={styles.content}>
                <table>
                    <thead>
                        <tr>
                            <th>Nome do Plano</th>
                            <th>Preço Mensal</th>
                            <th className={styles.actionsHeader}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountPlans.map(plan => (
                            <tr key={plan.id} className={plan.isPopular ? styles.popularPlan : ''}>
                                <td className={styles.planNameCell}>
                                    {plan.name}
                                    {plan.isPopular && <span className={styles.popularTag}>Mais Vendido</span>}
                                </td>
                                <td className={styles.priceCell}>{plan.price}</td>
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

export default SubscriptionLocation;
