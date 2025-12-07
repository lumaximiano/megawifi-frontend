// lmx-megawifi/frontend/src/pages/PlansPage.jsx - v1.0 - Estrutura CRUD
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
    pageContainer: { maxWidth: '900px' },
    formCard: { background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' },
    formTitle: { margin: '0 0 20px 0' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'flex-end' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' },
    input: { width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    button: { padding: '10px 20px', fontSize: '14px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    th: { padding: '15px', borderBottom: '2px solid #dee2e6', textAlign: 'left', background: '#f8f9fa' },
    td: { padding: '15px', borderBottom: '1px solid #dee2e6' },
    actions: { display: 'flex', gap: '10px' },
    error: { color: 'red', marginTop: '10px' },
};

const PlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    const fetchPlans = async () => {
        try {
            const res = await axios.get('/api/plans');
            setPlans(res.data);
        } catch (err) {
            setError('Não foi possível carregar os planos.');
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const resetForm = () => {
        setName('');
        setDuration('');
        setPrice('');
        setEditingId(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !duration || !price) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        const planData = {
            name,
            duration_minutes: parseInt(duration),
            price: parseFloat(price)
        };

        try {
            if (editingId) {
                // Atualizar plano existente
                await axios.put(`/api/plans/${editingId}`, planData);
            } else {
                // Criar novo plano
                await axios.post('/api/plans', planData);
            }
            resetForm();
            fetchPlans();
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao salvar o plano.');
        }
    };

    const handleEdit = (plan) => {
        setEditingId(plan.id);
        setName(plan.name);
        setDuration(plan.duration_minutes);
        setPrice(plan.price);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja remover este plano?')) {
            try {
                await axios.delete(`/api/plans/${id}`);
                fetchPlans();
            } catch (err) {
                setError(err.response?.data?.error || 'Erro ao remover o plano.');
            }
        }
    };

    return (
        <div style={styles.pageContainer}>
            <h2>Planos de Acesso</h2>

            <div style={styles.formCard}>
                <h3 style={styles.formTitle}>{editingId ? 'Editando Plano' : 'Adicionar Novo Plano'}</h3>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid}>
                        <div>
                            <label htmlFor="name" style={styles.label}>Nome do Plano</label>
                            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} style={styles.input} placeholder="Ex: Plano 1 Hora" />
                        </div>
                        <div>
                            <label htmlFor="duration" style={styles.label}>Duração (em minutos)</label>
                            <input id="duration" type="number" value={duration} onChange={e => setDuration(e.target.value)} style={styles.input} placeholder="Ex: 60" />
                        </div>
                        <div>
                            <label htmlFor="price" style={styles.label}>Preço (R$)</label>
                            <input id="price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} style={styles.input} placeholder="Ex: 5.00" />
                        </div>
                        <button type="submit" style={{...styles.button, background: editingId ? '#28a745' : '#007bff'}}>
                            {editingId ? 'Salvar' : 'Adicionar'}
                        </button>
                    </div>
                    {editingId && (
                        <button onClick={resetForm} style={{...styles.button, background: '#6c757d', marginTop: '10px'}}>
                            Cancelar Edição
                        </button>
                    )}
                    {error && <p style={styles.error}>{error}</p>}
                </form>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nome</th>
                        <th style={styles.th}>Duração</th>
                        <th style={styles.th}>Preço</th>
                        <th style={styles.th}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {plans.length > 0 ? plans.map(plan => (
                        <tr key={plan.id}>
                            <td style={styles.td}>{plan.name}</td>
                            <td style={styles.td}>{plan.duration_minutes} minutos</td>
                            <td style={styles.td}>R$ {plan.price.toFixed(2)}</td>
                            <td style={styles.td}>
                                <div style={styles.actions}>
                                    <button onClick={() => handleEdit(plan)} style={{...styles.button, background: '#ffc107'}}>Editar</button>
                                    <button onClick={() => handleDelete(plan.id)} style={{...styles.button, background: '#dc3545'}}>Remover</button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4" style={{...styles.td, textAlign: 'center'}}>Nenhum plano cadastrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PlansPage;
