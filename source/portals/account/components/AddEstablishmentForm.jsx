// frontend/src/components/AddEstablishmentForm.jsx - VERSÃO CORRIGIDA E FINAL

import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/ClientsPage.module.css';

const AddEstablishmentForm = ({ onAddSuccess }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/clients', 
        { name, address }, // Envia APENAS os campos que o backend espera
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Limpa os campos e chama a função de sucesso para fechar o form e recarregar a lista
      setName('');
      setAddress('');
      onAddSuccess();

    } catch (err) {
      setError(err.response?.data?.error || 'Ocorreu um erro ao cadastrar o estabelecimento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Adicionar Novo Estabelecimento</h2>
      <p>Preencha os dados do seu cliente (ex: a cafeteria, a loja, etc.).</p>
      
      <div className={styles.inputGroup}>
        <label htmlFor="establishmentName">Nome do Estabelecimento</label>
        <input id="establishmentName" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="establishmentAddress">Endereço (Opcional)</label>
        <input id="establishmentAddress" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      
      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Cadastrando...' : 'Cadastrar Estabelecimento'}
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}
    </form>
  );
};

export default AddEstablishmentForm;
