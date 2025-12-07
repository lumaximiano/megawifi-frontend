// frontend/src/pages/DashboardMasterPage.jsx - v7.1 (Sem alterações)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '@css/DashboardMasterPage.module.css';
import { 
    HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineWifi, 
    HiOutlineCheckCircle, HiOutlineXCircle, HiOutlinePlusCircle,
    HiOutlineChip, HiOutlineDatabase, HiOutlineGlobeAlt
} from 'react-icons/hi';

// Componente para os cards de estatísticas do topo
const StatCard = ({ title, mainValue, details, icon, onClick }) => {
    const cardClassName = `${styles.card} ${styles.statCard} ${onClick ? styles.clickable : ''}`;
    return (
        <div className={cardClassName} onClick={onClick}>
            <div className={styles.cardIcon}>{icon}</div>
            <div className={styles.cardContent}>
                <p className={styles.cardTitle}>{title}</p>
                <div className={styles.cardValueContainer}>{mainValue}</div>
                {details && details.length > 0 && (
                    <div className={styles.cardDetails}>
                        {details.map(detail => (
                            <span key={detail.label}>{detail.label}: <strong>{detail.value}</strong></span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente para os cards de métricas de negócio
const MetricCard = ({ title, value, subtext }) => {
    return (
        <div className={`${styles.card} ${styles.metricCard}`}>
            <p className={styles.cardTitle}>{title}</p>
            <p className={styles.metricValue}>{value}</p>
            <p className={styles.metricSubtext}>{subtext}</p>
        </div>
    );
};

// Componente para os cards de status do servidor
const ServerMetricCard = ({ title, value, icon }) => {
    return (
        <div className={`${styles.card} ${styles.serverMetricCard}`}>
            <div className={styles.serverMetricHeader}>
                {icon}
                <p className={styles.cardTitle}>{title}</p>
            </div>
            <p className={styles.serverMetricValue}>{value}</p>
            <div className={styles.serverChartPlaceholder}>
                <p>[ Gráfico de linha aqui ]</p>
            </div>
        </div>
    );
};

const DashboardMasterPage = () => {
    const navigate = useNavigate();

    // --- DADOS FALSOS (MOCK DATA) ---
    const stats = { mrr: 'R$ 1.858,80', clients: { total: 14, active: 12, blocked: 2 }, establishments: { total: 47 }, routers: { total: 55, online: 38, offline: 17 } };
    const popularPlans = [{ name: 'Prata', count: 7 }, { name: 'Starter', count: 4 }, { name: 'Ouro', count: 1 }];
    const activityFeed = [{ type: 'new_client', text: 'Empresa Exemplo LTDA', link: '/admin/clientes/1' }, { type: 'payment', text: 'João da Silva - R$ 99,90', link: '/admin/faturas/123' }, { type: 'churn', text: 'Mercado Vizinho', link: '/admin/clientes/2' }];
    const metrics = { overdue: { value: 'R$ 457,80', subtext: '(em 5 faturas)' }, newClients: { value: '+8', subtext: '(vs. 6 no mês anterior)' }, churn: { value: '-2', subtext: '(MRR perdido: R$ 199,80)' }, ticket: { value: 'R$ 132,77', subtext: '(por cliente ativo)' } };
    const serverStatus = { cpu: '75%', ram: '6.8 / 16 GB', network: '↓ 85 Mbps / ↑ 12 Mbps' };

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.pageTitle}>Dashboard da Plataforma</h1>

            {/* Linha 1: KPIs Principais */}
            <div className={styles.kpiGrid}>
                <StatCard title="Receita Mensal (MRR)" mainValue={<p className={styles.cardValue}>{stats.mrr}</p>} details={[]} icon={<HiOutlineCurrencyDollar />} />
                <StatCard title="Clientes" mainValue={<p className={styles.cardValue}>{stats.clients.active}<span className={styles.valueLabel}>Ativos</span></p>} details={[{ label: 'Total', value: stats.clients.total }, { label: 'Bloqueados', value: stats.clients.blocked }]} icon={<HiOutlineUsers />} onClick={() => navigate('/admin/clientes')} />
                <StatCard title="Estabelecimentos" mainValue={<p className={styles.cardValue}>{stats.establishments.total}</p>} details={[]} icon={<HiOutlineOfficeBuilding />} />
                <StatCard title="Roteadores" mainValue={<p className={styles.cardValue}>{stats.routers.online}<span className={styles.valueLabel}>Online</span></p>} details={[{ label: 'Total', value: stats.routers.total }, { label: 'Offline', value: stats.routers.offline }]} icon={<HiOutlineWifi />} />
            </div>

            {/* Linha 2: Métricas de Tomada de Decisão */}
            <div className={styles.kpiGrid}>
                <MetricCard title="Faturas em Atraso" value={metrics.overdue.value} subtext={metrics.overdue.subtext} />
                <MetricCard title="Cancelamentos (Mês)" value={metrics.churn.value} subtext={metrics.churn.subtext} />
                <MetricCard title="Novos Clientes (Mês)" value={metrics.newClients.value} subtext={metrics.newClients.subtext} />
                <MetricCard title="Ticket Médio" value={metrics.ticket.value} subtext={metrics.ticket.subtext} />
            </div>

            {/* Linha 3: Conteúdo Principal (Gráficos e Listas) */}
            <div className={styles.mainContentGrid}>
                <div className={`${styles.card} ${styles.stretchCard}`}>
                    <h2 className={styles.cardHeader}>Crescimento de MRR (Últimos 6 Meses)</h2>
                    <div className={styles.chartPlaceholder}>
                        <p>O gráfico de linhas do MRR entrará aqui.</p>
                    </div>
                </div>
                <div className={`${styles.card} ${styles.stretchCard}`}>
                    <h2 className={styles.cardHeader}>Atividade Recente</h2>
                    <ul className={styles.activityList}>
                        {activityFeed.map((item, index) => (
                            <li key={index} onClick={() => navigate(item.link)}>
                                {item.type === 'new_client' && <HiOutlinePlusCircle className={`${styles.activityIcon} ${styles.newClient}`} />}
                                {item.type === 'payment' && <HiOutlineCheckCircle className={`${styles.activityIcon} ${styles.payment}`} />}
                                {item.type === 'churn' && <HiOutlineXCircle className={`${styles.activityIcon} ${styles.churn}`} />}
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`${styles.card} ${styles.stretchCard}`}>
                    <h2 className={styles.cardHeader}>Planos Mais Populares</h2>
                    <ul className={styles.popularPlansList}>
                        {popularPlans.map(plan => (
                            <li key={plan.name}>
                                <span>{plan.name}</span>
                                <strong>{plan.count} assinantes</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Linha 4: Status do Servidor */}
            <div className={styles.serverStatusGrid}>
                <ServerMetricCard title="Uso de CPU" value={serverStatus.cpu} icon={<HiOutlineChip />} />
                <ServerMetricCard title="Memória RAM" value={serverStatus.ram} icon={<HiOutlineDatabase />} />
                <ServerMetricCard title="Tráfego de Rede" value={serverStatus.network} icon={<HiOutlineGlobeAlt />} />
            </div>
        </div>
    );
};

export default DashboardMasterPage;
