import React, { useState, useEffect } from 'react';
import api from '@api/axiosConfig';
import styles from '@css/FinancePage.module.css';
// Ícones atualizados para os novos KPIs
import {
    HiOutlineCheckCircle, // Para Total Recebido
    HiOutlineClock,       // Para A Receber (Pendente)
    HiOutlineExclamation, // Para Inadimplentes (Atrasado)
    HiOutlineReceiptTax   // Para Despesas Pagas
} from 'react-icons/hi';

// Componente para os Status (Pago, Pendente, etc.) - Sem alterações
const StatusBadge = ({ status }) => {
    const statusMap = {
        PAGO: styles.statusPaid,
        PENDENTE: styles.statusPending,
        ATRASADO: styles.statusOverdue,
    };
    return <span className={`${styles.statusBadge} ${statusMap[status] || styles.statusPending}`}>{status}</span>;
};

const FinancePage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/finance/full-dashboard');
                setData(response.data);
            } catch (err) {
                setError('Não foi possível carregar os dados financeiros.');
                setData(getMockData()); // Usando dados mockados para desenvolvimento
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

    if (loading) return <div className={styles.loading}>Carregando painel financeiro...</div>;
    if (error && !data) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.financePage}>
            <div className={styles.header}>
                <h1 className={styles.title}>Painel Financeiro</h1>
            </div>

            {/* SEÇÃO 1: VISÃO GERAL (KPIs ATUALIZADOS) */}
            <div className={styles.kpiGrid}>
                <KpiCard icon={<HiOutlineCheckCircle />} label="Total Recebido (Mês)" value={formatCurrency(data.kpis.totalReceived)} valueClass={styles.positive} />
                <KpiCard icon={<HiOutlineClock />} label="A Receber (Pendente)" value={formatCurrency(data.kpis.totalPending)} />
                <KpiCard icon={<HiOutlineExclamation />} label="Inadimplentes (Atrasado)" value={formatCurrency(data.kpis.totalOverdue)} valueClass={styles.negative} />
                <KpiCard icon={<HiOutlineReceiptTax />} label="Despesas Pagas (Mês)" value={formatCurrency(data.kpis.totalExpenses)} />
            </div>

            {/* SEÇÃO 2: RECEITAS (Tabela de Clientes) */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Saúde das Assinaturas</h2>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr><th>Cliente</th><th>Plano</th><th>Valor</th><th>Vencimento</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {data.revenues.map(item => (
                            <tr key={item.id}>
                                <td>{item.clientName}</td>
                                <td>{item.planName}</td>
                                <td>{formatCurrency(item.amount)}</td>
                                <td>{item.dueDate}</td>
                                <td><StatusBadge status={item.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* SEÇÃO 3: DESPESAS (Tabela de Contas) */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Contas a Pagar</h2>
                    <button className={styles.addButton}>+ Adicionar Despesa</button>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr><th>Descrição</th><th>Categoria</th><th>Valor</th><th>Vencimento</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {data.expenses.map(item => (
                            <tr key={item.id}>
                                <td>{item.description}</td>
                                <td>{item.category}</td>
                                <td>{formatCurrency(item.amount)}</td>
                                <td>{item.dueDate}</td>
                                <td><StatusBadge status={item.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Componente auxiliar para os cards - Sem alterações
const KpiCard = ({ icon, label, value, valueClass = '' }) => (
    <div className={styles.kpiCard}>
        <div className={styles.kpiLabel}>{icon}{label}</div>
        <div className={`${styles.kpiValue} ${valueClass}`}>{value}</div>
    </div>
);

// Função que gera dados mockados ATUALIZADOS para desenvolvimento
const getMockData = () => ({
    kpis: {
        totalReceived: 8500.50,
        totalPending: 2500.00,
        totalOverdue: 750.25,
        totalExpenses: 4300.25
    },
    revenues: [
        { id: 1, clientName: 'Empresa A', planName: 'Plano Pro', amount: 299.90, dueDate: '25/09/2025', status: 'PAGO' },
        { id: 2, clientName: 'Comércio B', planName: 'Plano Básico', amount: 99.90, dueDate: '28/09/2025', status: 'PENDENTE' },
        { id: 3, clientName: 'Startup C', planName: 'Plano Pro', amount: 299.90, dueDate: '15/09/2025', status: 'ATRASADO' },
        { id: 4, clientName: 'Loja D', planName: 'Plano Básico', amount: 99.90, dueDate: '29/09/2025', status: 'PENDENTE' },
    ],
    expenses: [
        { id: 1, description: 'Servidor Dedicado (Hetzner)', category: 'Servidor', amount: 850.00, dueDate: '30/09/2025', status: 'PENDENTE' },
        { id: 2, description: 'Licença Plataforma X', category: 'Plataforma', amount: 450.00, dueDate: '20/09/2025', status: 'PAGO' },
    ]
});

export default FinancePage;
