// frontend/src/components/StatusIndicator.jsx
import React from 'react';

const styles = {
    statusOnline: { height: '12px', width: '12px', backgroundColor: '#28a745', borderRadius: '50%', display: 'inline-block' },
    statusOffline: { height: '12px', width: '12px', backgroundColor: '#dc3545', borderRadius: '50%', display: 'inline-block' },
};

const StatusIndicator = ({ status }) => {
    const isOnline = status === 'Online';
    const indicatorStyle = isOnline ? styles.statusOnline : styles.statusOffline;
    const text = isOnline ? 'ON' : 'OFF';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={indicatorStyle}></span>
            <span>{text}</span>
        </div>
    );
};

export default StatusIndicator;
