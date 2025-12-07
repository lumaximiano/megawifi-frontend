// lmx-megawifi/frontend/src/components/RouterStatsPanel.jsx - v3.0 (Refatorado) - COMPONENTE PASSIVO
import React from 'react';

// Estilos e funções de formatação são mantidos, pois são lógicos e passivos.
const styles = {
    panel: {
        marginTop: '20px',
        padding: '20px',
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
    },
    title: {
        margin: '0 0 15px 0',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
    },
    statItem: {
        background: 'white',
        padding: '15px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    statLabel: {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '5px',
        color: '#495057',
    },
    statValue: {
        fontSize: '1.1em',
        color: '#212529',
    }
};

const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatUptime = (uptimeStr) => {
    if (!uptimeStr) return 'N/A';
    let days = 0, hours = 0, minutes = 0;
    
    if (uptimeStr.includes('w')) {
        const parts = uptimeStr.split('w');
        days += parseInt(parts[0]) * 7;
        uptimeStr = parts[1] || '';
    }
    if (uptimeStr.includes('d')) {
        const parts = uptimeStr.split('d');
        days += parseInt(parts[0]);
        uptimeStr = parts[1] || '';
    }
    if (uptimeStr.includes('h')) {
        const parts = uptimeStr.split('h');
        hours = parseInt(parts[0]);
        uptimeStr = parts[1] || '';
    }
    if (uptimeStr.includes('m')) {
        const parts = uptimeStr.split('m');
        minutes = parseInt(parts[0]);
    }

    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    
    return result.trim() || 'Menos de um minuto';
};

// O componente agora é "burro". Ele apenas recebe os dados e os exibe.
// A lógica de useState, useEffect e axios foi REMOVIDA.
const RouterStatsPanel = ({ router, stats, error, loading }) => {
    
    // A mensagem de "Carregando" agora é controlada pela página pai.
    if (loading) {
        return (
            <div style={styles.panel}>
                <h3 style={styles.title}>Detalhes de: {router.name}</h3>
                <p>Carregando estatísticas...</p>
            </div>
        );
    }

    // A mensagem de erro também é controlada pela página pai.
    if (error) {
        return (
            <div style={styles.panel}>
                <h3 style={styles.title}>Detalhes de: {router.name}</h3>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }
    
    // Se não há dados, não mostra nada para evitar um painel vazio.
    if (!stats) {
        return null;
    }

    return (
        <div style={styles.panel}>
            <h3 style={styles.title}>Detalhes de: {router.name}</h3>
            <div style={styles.grid}>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>Hora</span>
                    <span style={styles.statValue}>{stats.time ? stats.time.substring(0, 5) : 'N/A'}</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>Data</span>
                    <span style={styles.statValue}>{stats.date}</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>Uptime</span>
                    <span style={styles.statValue}>{formatUptime(stats.uptime)}</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>Uso de CPU</span>
                    <span style={styles.statValue}>{stats.cpuLoad}%</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>Memória Livre</span>
                    <span style={styles.statValue}>{formatBytes(stats.freeMemory)} / {formatBytes(stats.totalMemory)}</span>
                </div>
            </div>
        </div>
    );
};

export default RouterStatsPanel;
