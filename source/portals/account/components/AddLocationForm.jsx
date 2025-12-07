// frontend/source/portals/account/components/AddLocationForm.jsx - v1.1 (Caminhos Corrigidos)

import React, { useState } from 'react';
// =====================================================================
// MUDANÇA 1: Corrigindo o caminho da importação do 'api'.
// O arquivo está em 'source/portals/account/components/', então precisamos subir 3 níveis.
import api from '../../../api/axiosConfig'; 
// =====================================================================

// =====================================================================
// MUDANÇA 2: Corrigindo o caminho da importação do CSS.
// O arquivo CSS está em 'source/portals/account/css/', então precisamos subir 1 nível.
import styles from '../css/ManageLocationsPage.module.css'; 
// =====================================================================

const AddLocationForm = ({ accountId, onAddSuccess }) => {
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        accountId,
        name: locationName,
        address: { street: address },
      };

      const response = await api.post('/api/locations', payload);
      
      setMessage(response.data.message || 'Local cadastrado com sucesso!');
      
      setLocationName('');
      setAddress('');

      if (onAddSuccess) {
        setTimeout(() => {
          onAddSuccess(); 
        }, 1500);
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao cadastrar o local.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Adicionar Novo Local</h2>
      <p>Preencha os dados do novo estabelecimento.</p>
      
      <div className={styles.inputGroup}>
        <label htmlFor="locationName">Nome do Local (Ex: Loja Centro)</label>
        <input id="locationName" type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} required />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="address">Endereço</label>
        <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      
      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Cadastrando...' : 'Cadastrar Local'}
      </button>

      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </form>
  );
};

export default AddLocationForm;
