// lmx-megawifi/frontend/src/pages/RoutersPage.jsx - v10.2.0 com a adição do botão Vincular

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/RoutersPage.module.css';
import StatusIndicator from '../../../components/StatusIndicator';
import RouterStatsPanel from '../components/RouterStatsPanel';
import DhcpLeasePanel from '../components/DhcpLeasePanel';
import EditRouterModal from '../components/EditRouterModal';
import LinkEstablishmentModal from '../components/LinkEstablishmentModal'; // 1. Importa o novo modal

const ScriptModal = ({ script, onClose }) => {
    // ...código do ScriptModal inalterado...
};

const RoutersPage = () => {
    const [routers, setRouters] = useState([]);
    const [name, setName] = useState('');
    const [mac, setMac] = useState('');
    const [apiIp, setApiIp] = useState('');
    const [listError, setListError] = useState('');
    const [detailsVisibleFor, setDetailsVisibleFor] = useState(null);
    const [stats, setStats] = useState(null);
    const [leases, setLeases] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState('');
    const [editingRouter, setEditingRouter] = useState(null);
    const [showScriptModal, setShowScriptModal] = useState(false);
    const [currentScript, setCurrentScript] = useState('');
    const [provisioningId, setProvisioningId] = useState(null);

    // --- 2. NOVO ESTADO PARA CONTROLAR O MODAL DE VÍNCULO ---
    const [linkingRouter, setLinkingRouter] = useState(null);

    const fetchRouterList = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/routers', { headers: { Authorization: `Bearer ${token}` } });
            setRouters(res.data);
        } catch (err) {
            console.error("Erro ao buscar lista de roteadores:", err);
            setListError("Não foi possível carregar os roteadores.");
        }
    };

    useEffect(() => {
        fetchRouterList();
        const interval = setInterval(fetchRouterList, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!detailsVisibleFor) return;
        const fetchDetails = async () => {
            if (!stats && !leases) setDetailsLoading(true);
            setDetailsError('');
            try {
                const token = localStorage.getItem('token');
                const [statsRes, leasesRes] = await Promise.all([
                    axios.get(`/api/routers/${detailsVisibleFor}/stats`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`/api/routers/${detailsVisibleFor}/dhcp-leases`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats(statsRes.data);
                setLeases(leasesRes.data);
            } catch (err) {
                setDetailsError('Não foi possível carregar os detalhes do roteador.');
                setStats(null);
                setLeases(null);
            } finally {
                setDetailsLoading(false);
            }
        };
        fetchDetails();
        const interval = setInterval(fetchDetails, 5000);
        return () => clearInterval(interval);
    }, [detailsVisibleFor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setListError('');
        try {
            const token = localStorage.getItem('token');
            
            await axios.post('/api/routers', {
                name,
                mac_address: mac,
                apiIp: apiIp,
            }, { headers: { Authorization: `Bearer ${token}` } });

            setName(''); setMac(''); setApiIp('');
            fetchRouterList();
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Erro ao adicionar roteador.';
            setListError(errorMessage);
            console.error("Falha ao criar roteador:", err.response?.data || err.message);
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/routers/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
            setEditingRouter(null);
            fetchRouterList();
        } catch (err) {
            alert(err.response?.data?.message || 'Erro ao atualizar roteador.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja remover este roteador?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/routers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                if (detailsVisibleFor === id) {
                    setDetailsVisibleFor(null);
                }
                fetchRouterList();
            } catch (err) {
                const errorMsg = err.response?.data?.message || 'Erro ao remover o roteador.';
                setListError(errorMsg);
                alert(errorMsg);
                console.error("Falha ao deletar roteador:", err.response?.data || err.message);
            }
        }
    };

    const handleTestConnection = async (id) => { try { const token = localStorage.getItem('token'); const res = await axios.post(`/api/routers/${id}/test-connection`, {}, { headers: { Authorization: `Bearer ${token}` } }); alert(`Sucesso! ✅\n\n${res.data.message}`); } catch (err) { alert(`Falha! ❌\n\n${err.response?.data?.message || 'Erro desconhecido.'}`); } };
    const handleGenerateScript = async () => { try { const token = localStorage.getItem('token'); const res = await axios.post(`/api/routers/generate-script`, {}, { headers: { Authorization: `Bearer ${token}` } }); setCurrentScript(res.data.script); setShowScriptModal(true); } catch (err) { alert('Erro ao gerar script.'); } };
    const handleProvision = async (routerId) => { if (window.confirm('Isso irá configurar o redirecionamento do Hotspot neste roteador. Deseja continuar?')) { setProvisioningId(routerId); try { const token = localStorage.getItem('token'); const res = await axios.post(`/api/routers/${routerId}/provision-hotspot`, {}, { headers: { Authorization: `Bearer ${token}` } }); alert(`Sucesso! ✅\n\n${res.data.message}`); } catch (err) { const errorMessage = err.response?.data?.message || 'Ocorreu um erro desconhecido.'; alert(`Falha! ❌\n\n${errorMessage}`); } finally { setProvisioningId(null); } } };

    const handleToggleDetails = (routerId) => {
        setDetailsVisibleFor(prev => (prev === routerId ? null : routerId));
        setStats(null);
        setLeases(null);
    };

    const selectedRouterForDetails = routers.find(r => r.id === detailsVisibleFor);

    return (
        <div>
            {showScriptModal && <ScriptModal script={currentScript} onClose={() => setShowScriptModal(false)} />}
            {editingRouter && <EditRouterModal router={editingRouter} onClose={() => setEditingRouter(null)} onSave={handleUpdate} />}
            
            {/* --- 3. RENDERIZA O NOVO MODAL DE VÍNCULO --- */}
            {linkingRouter && (
                <LinkEstablishmentModal 
                    router={linkingRouter}
                    onClose={() => setLinkingRouter(null)}
                    onLinkSuccess={() => {
                        setLinkingRouter(null); // Fecha o modal
                        fetchRouterList(); // Atualiza a lista para mostrar o novo vínculo
                    }}
                />
            )}

            <h2>Mikrotik (Roteadores)</h2>
            <div className={styles.addForm}>
                {/* O formulário de adição permanece exatamente como estava */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome do Mikrotik" required className={styles.input} />
                    <input type="text" value={mac} onChange={e => setMac(e.target.value)} placeholder="MAC do Mikrotik" required className={styles.input} />
                    <input
                        type="text"
                        value={apiIp}
                        onChange={e => setApiIp(e.target.value)}
                        placeholder="IP da WAN (Opcional)"
                        pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                        title="Digite um endereço IPv4 válido (ex: 192.168.1.1)"
                        className={styles.input}
                    />
                    <button type="submit" className={`${styles.button} ${styles.addButton}`}>Adicionar</button>
                </form>
                <button onClick={handleGenerateScript} className={`${styles.button} ${styles.scriptButton}`}>Gerar Script</button>
            </div>
            {listError && <p className={styles.error}>{listError}</p>}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Nome</th>
                        <th>MAC</th>
                        <th>IP da WAN</th>
                        {/* --- 4. NOVA COLUNA NA TABELA --- */}
                        <th>Vinculado a</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {routers.map(router => (
                        <tr key={router.id}>
                            <td><StatusIndicator status={router.status} /></td>
                            <td>{router.name}</td>
                            <td>{router.macAddress}</td>
                            <td>{router.apiIp}</td>
                            <td>
                                {/* --- 5. EXIBE O NOME DO ESTABELECIMENTO VINCULADO --- */}
                                {router.establishment ? (
                                    <span style={{ fontWeight: '500' }}>{router.establishment.name}</span>
                                ) : (
                                    <span style={{ color: '#999' }}>Nenhum</span>
                                )}
                            </td>
                            <td className={styles.actionsCell}>
                                {/* --- 6. NOVO BOTÃO "VINCULAR" ADICIONADO --- */}
                                <button 
                                    onClick={() => setLinkingRouter(router)} 
                                    className={`${styles.button} ${styles.linkButton}`}
                                    title="Vincular a um estabelecimento"
                                >
                                    Vincular
                                </button>
                                {/* Os outros botões permanecem exatamente como estavam */}
                                <button onClick={() => handleToggleDetails(router.id)} className={`${styles.button} ${styles.detailsButton}`}>{detailsVisibleFor === router.id ? 'Ocultar' : 'Detalhes'}</button>
                                <button onClick={() => handleTestConnection(router.id)} className={`${styles.button} ${styles.testButton}`}>Testar</button>
                                <button onClick={() => setEditingRouter(router)} className={`${styles.button} ${styles.editButton}`}>Editar</button>
                                <button onClick={() => handleDelete(router.id)} className={`${styles.button} ${styles.deleteButton}`}>Remover</button>
                                <button
                                    onClick={() => handleProvision(router.id)}
                                    className={`${styles.button} ${router.status === 'Online' && provisioningId !== router.id ? styles.provisionButton : styles.provisionButtonDisabled}`}
                                    title={router.status === 'Online' ? 'Provisionar Hotspot' : 'O roteador precisa estar online para ser provisionado'}
                                    disabled={router.status !== 'Online' || provisioningId === router.id}
                                >
                                    {provisioningId === router.id ? 'Provisionando...' : 'Provisionar'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* A seção de detalhes permanece exatamente como estava */}
            {detailsVisibleFor && selectedRouterForDetails && (
                <>
                    <RouterStatsPanel router={selectedRouterForDetails} stats={stats} error={detailsError} loading={detailsLoading && !stats} />
                    <DhcpLeasePanel leases={leases} error={detailsError} loading={detailsLoading && !leases} />
                </>
            )}
        </div>
    );
};

export default RoutersPage;
