// frontend/src/components/EditRouterModal.jsx
import React, { useState } from 'react';

const styles = {
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', padding: '30px', borderRadius: '8px', width: '700px', maxWidth: '90%', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
    input: { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '200px' },
    button: { padding: '10px 15px', fontSize: '16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
};

const EditRouterModal = ({ router, onClose, onSave }) => {
    const [name, setName] = useState(router.name);
    const [mac, setMac] = useState(router.mac_address);
    const [apiIp, setApiIp] = useState(router.api_ip || '');
    const [apiPort, setApiPort] = useState(router.api_port || '');
    const [apiUser, setApiUser] = useState(router.api_user || 'megawifi-api-user');
    const [apiPassword, setApiPassword] = useState(router.api_password || 'megawifi_api_password');

    const handleSave = () => {
        onSave(router.id, { name, mac_address: mac, api_ip: apiIp, api_port: apiPort, api_user: apiUser, api_password: apiPassword });
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h3>Editar Roteador</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome do Mikrotik" style={styles.input} />
                    <input type="text" value={mac} onChange={e => setMac(e.target.value)} placeholder="MAC do Mikrotik" style={styles.input} />
                    <hr style={{ width: '100%', border: '1px solid #eee', margin: '10px 0' }} />
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Credenciais da API</p>
                    <input type="text" value={apiIp} onChange={e => setApiIp(e.target.value)} placeholder="IP de Acesso (WAN)" style={styles.input} />
                    <input type="text" value={apiPort} onChange={e => setApiPort(e.target.value)} placeholder="Porta da API (padrão: 8728)" style={styles.input} />
                    <input type="text" value={apiUser} onChange={e => setApiUser(e.target.value)} placeholder="Usuário da API" style={styles.input} />
                    <input type="password" value={apiPassword} onChange={e => setApiPassword(e.target.value)} placeholder="Senha da API" style={styles.input} />
                </div>
                <div style={styles.modalActions}>
                    <button onClick={handleSave} style={styles.button}>Salvar</button>
                    <button onClick={onClose} style={{ ...styles.button, background: '#6c757d' }}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default EditRouterModal;
