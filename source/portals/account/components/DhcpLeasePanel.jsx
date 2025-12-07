// lmx-megawifi/frontend/src/components/DhcpLeasePanel.jsx - v2.0 (Refatorado) - COMPONENTE PASSIVO
import React from 'react';

const styles = {
    panel: {
        marginTop: '20px',
        padding: '20px',
        background: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    title: {
        margin: '0 0 15px 0',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '12px',
        borderBottom: '2px solid #dee2e6',
        textAlign: 'left',
        background: '#f8f9fa',
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #dee2e6',
    },
};

// O componente agora é "burro". Ele apenas recebe os dados e os exibe.
// A lógica de useState, useEffect e axios foi REMOVIDA.
const DhcpLeasePanel = ({ leases, error, loading }) => {
    
    // A mensagem de "Carregando" agora é controlada pela página pai.
    if (loading) {
        return (
            <div style={styles.panel}>
                <h3 style={styles.title}>Clientes Conectados (DHCP)</h3>
                <p>Carregando lista de clientes...</p>
            </div>
        );
    }
    
    // A mensagem de erro também é controlada pela página pai.
    if (error) {
         return (
            <div style={styles.panel}>
                <h3 style={styles.title}>Clientes Conectados (DHCP)</h3>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    // Se não há dados, não mostra nada para evitar um painel vazio.
    if (!leases) {
        return null;
    }

    return (
        <div style={styles.panel}>
            <h3 style={styles.title}>Clientes Conectados (DHCP)</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Endereço IP</th>
                        <th style={styles.th}>Endereço MAC</th>
                        <th style={styles.th}>Nome do Host</th>
                        <th style={styles.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leases.length > 0 ? leases.map(lease => (
                        <tr key={lease.id}>
                            <td style={styles.td}>{lease.address}</td>
                            <td style={styles.td}>{lease.macAddress}</td>
                            <td style={styles.td}>{lease.hostName}</td>
                            <td style={styles.td}>{lease.status}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4" style={{...styles.td, textAlign: 'center'}}>Nenhum cliente encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DhcpLeasePanel;
