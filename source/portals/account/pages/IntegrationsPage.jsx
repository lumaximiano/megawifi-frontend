// lmx-megawifi/frontend/src/pages/IntegrationsPage.jsx - v1.2 - Adiciona Visibilidade de Token
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
    pageContainer: { maxWidth: '800px' },
    sectionTitle: { fontSize: '1.5em', color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' },
    card: { background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    cardTitle: { fontSize: '1.2em', fontWeight: 'bold', color: '#007bff', margin: '0 0 10px 0' },
    cardDescription: { fontSize: '1em', color: '#6c757d', marginBottom: '20px' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '5px' },
    
    // NOVO: Container para o input e o botão de olho
    inputContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
        paddingRight: '40px', // Espaço para o botão de olho
    },
    // NOVO: Estilo para o botão de olho
    toggleButton: {
        position: 'absolute',
        right: '1px',
        top: '1px',
        bottom: '1px',
        border: 'none',
        background: 'transparent',
        padding: '0 10px',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#6c757d',
    },

    button: { padding: '10px 15px', fontSize: '14px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '15px' },
    message: { marginTop: '15px', padding: '10px', borderRadius: '4px', textAlign: 'center' },
    success: { backgroundColor: '#d4edda', color: '#155724' },
    error: { backgroundColor: '#f8d7da', color: '#721c24' }
};

const IntegrationsPage = () => {
    const [mpAccessToken, setMpAccessToken] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    // NOVO: Estado para controlar a visibilidade da senha
    const [isTokenVisible, setIsTokenVisible] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const res = await axios.get('/api/settings/mp_access_token');
                setMpAccessToken(res.data.value || '');
            } catch (err) { /* Erro silencioso */ }
        };
        fetchToken();
    }, []);

    const handleSave = async () => {
        setMessage({ text: '', type: '' });
        try {
            await axios.post('/api/settings/mp_access_token', { value: mpAccessToken });
            setMessage({ text: 'Salvo com sucesso!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Erro ao salvar. Verifique o token e a conexão.', type: 'error' });
        } finally {
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <h2 style={styles.sectionTitle}>Gateways de Pagamento</h2>
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>-- Mercado Pago --</h3>
                <p style={styles.cardDescription}>Insira suas credenciais para habilitar a venda de planos de acesso.</p>
                
                <label htmlFor="mp_token" style={styles.label}>Access Token</label>
                
                {/* NOVO: Container para agrupar o input e o botão */}
                <div style={styles.inputContainer}>
                    <input
                        id="mp_token"
                        // O tipo do input agora muda dinamicamente
                        type={isTokenVisible ? 'text' : 'password'}
                        value={mpAccessToken}
                        onChange={e => setMpAccessToken(e.target.value)}
                        style={styles.input}
                        placeholder="••••••••••••••••••••••••"
                    />
                    {/* Botão que alterna a visibilidade */}
                    <button 
                        onClick={() => setIsTokenVisible(!isTokenVisible)}
                        style={styles.toggleButton}
                        title={isTokenVisible ? 'Ocultar token' : 'Mostrar token'}
                    >
                        {isTokenVisible ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>
                
                <button onClick={handleSave} style={styles.button}>
                    Salvar Credencial
                </button>

                {message.text && (
                    <div style={{...styles.message, ...(message.type === 'success' ? styles.success : styles.error)}}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntegrationsPage;
