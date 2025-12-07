// frontend/src/components/EditClientModal.jsx - v2.3 (FINAL, com filtro de dados)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/EditClientModal.module.css';

const EditClientModal = ({ item, onSuccess, onClose, isSuperAdminView }) => {
  const [formData, setFormData] = useState({});
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        companyName: item.companyName || '',
        ownerName: item.ownerName || '',
        ownerEmail: item.ownerEmail || '',
        name: item.name || '',
        address: item.address || '',
      });
      setNewPassword('');
    }
  }, [item]);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- FUNÇÃO handleSubmit CORRIGIDA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      
      // --- A MÁGICA ACONTECE AQUI: FILTRANDO OS DADOS ---
      let dataToSend = {};
      if (isSuperAdminView) {
        // Se for Super Admin, enviamos apenas os campos do Tenant
        dataToSend = {
          companyName: formData.companyName,
          ownerName: formData.ownerName,
          ownerEmail: formData.ownerEmail,
        };
      } else {
        // Se for Cliente TI, enviamos apenas os campos do Establishment
        dataToSend = {
          name: formData.name,
          address: formData.address,
        };
      }
      
      // Adicionamos a nova senha ao pacote APENAS se o campo foi preenchido
      if (newPassword) {
        dataToSend.newPassword = newPassword;
      }

      // Envia o pacote de dados limpo e correto para a API
      await axios.put(`/api/clients/${item.id}`, dataToSend, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      onSuccess(); // Sucesso!
    } catch (err) {
      setError(err.response?.data?.error || 'Falha ao atualizar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => {
    // (A sua função renderFormFields permanece exatamente a mesma)
    if (isSuperAdminView) {
      return (
        <>
          <div className={styles.formGroup}><label>Nome da Empresa</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required /></div>
          <div className={styles.formGroup}><label>Nome do Responsável</label><input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required /></div>
          <div className={styles.formGroup}><label>E-mail de Contato</label><input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} required /></div>
          <div className={styles.formGroup}>
            <label>Redefinir Senha</label>
            <input type="password" placeholder="Deixe em branco para não alterar" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styles.formGroup}><label>Nome do Cliente</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
          <div className={styles.formGroup}><label>Endereço</label><input type="text" name="address" value={formData.address} onChange={handleChange} /></div>
        </>
      );
    }
  };

  return (
    // (O seu JSX do modal permanece exatamente o mesmo)
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Editar {isSuperAdminView ? 'Usuário' : 'Cliente'}</h2>
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;
