// frontend/source/portals/master/components/AccountForm.jsx

import React, { useState, useEffect } from 'react';
import styles from '@styles/FormPage.module.css';
import axios from 'axios';
import InputMask from 'react-input-mask';

// MUDANÇA 1: Adicionada a nova prop 'onCancel'
const AccountForm = ({ initialData = {}, onSubmit, onCancel, isEditing = false, isSubmitting = false, serverError = '' }) => {
    
    // Estados do formulário
    const [accountType, setAccountType] = useState('PJ');
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [legalName, setLegalName] = useState('');
    const [fantasyName, setFantasyName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [ownerPhone, setOwnerPhone] = useState('');
    const [password, setPassword] = useState('');
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [internalError, setInternalError] = useState('');

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setAccountType(initialData.type || 'PJ');
            if (initialData.type === 'PF') {
                setName(initialData.name || '');
                setCpf(initialData.document || '');
            } else {
                setLegalName(initialData.name || '');
                setFantasyName(initialData.fantasyName || '');
                setCnpj(initialData.document || '');
            }
            setOwnerName(initialData.owner?.name || '');
            setOwnerEmail(initialData.owner?.email || '');
            setOwnerPhone(initialData.owner?.phone || '');
            setCep(initialData.address?.cep || '');
            setAddress(initialData.address?.street || '');
            setNumber(initialData.address?.number || '');
            setComplement(initialData.address?.complement || '');
            setNeighborhood(initialData.address?.neighborhood || '');
            setCity(initialData.address?.city || '');
            setState(initialData.address?.state || '');
        }
    }, [initialData]);

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(pass);
    };

    const handleCepBlur = async (e) => {
        const currentCep = e.target.value.replace(/\D/g, '');
        if (currentCep.length !== 8) return;
        setIsCepLoading(true);
        setInternalError('');
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${currentCep}/json/`   );
            if (response.data.erro) {
                setInternalError('CEP não encontrado.');
            } else {
                setAddress(response.data.logradouro);
                setNeighborhood(response.data.bairro);
                setCity(response.data.localidade);
                setState(response.data.uf);
            }
        } catch (err) {
            setInternalError('Falha ao buscar o CEP.');
        } finally {
            setIsCepLoading(false);
        }
    };

    const localHandleSubmit = (e) => {
        e.preventDefault();
        setInternalError('');
        if (!isEditing && !password) {
            setInternalError('A senha é obrigatória para novas contas.');
            return;
        }
        const payload = {
            type: accountType,
            name: accountType === 'PF' ? name : legalName,
            document: accountType === 'PF' ? cpf.replace(/\D/g, '') : cnpj.replace(/\D/g, ''),
            fantasyName: accountType === 'PJ' ? fantasyName : null,
            owner: {
                name: ownerName,
                email: ownerEmail,
                phone: ownerPhone.replace(/\D/g, ''),
                password: password,
            },
            address: { cep: cep.replace(/\D/g, ''), street: address, number, complement, neighborhood, city, state },
        };
        onSubmit(payload);
    };

    return (
        <form onSubmit={localHandleSubmit} className={styles.form}>
            {/* ... todos os seus fieldsets permanecem iguais ... */}
            <fieldset className={styles.fieldset}>
                <legend>Tipo de Conta</legend>
                <div className={styles.radioGroup}>
                    <label><input type="radio" name="accountType" value="PJ" checked={accountType === 'PJ'} onChange={(e) => setAccountType(e.target.value)} /> Pessoa Jurídica</label>
                    <label><input type="radio" name="accountType" value="PF" checked={accountType === 'PF'} onChange={(e) => setAccountType(e.target.value)} /> Pessoa Física</label>
                </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend>Dados de Faturamento</legend>
                {accountType === 'PJ' ? (
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}><label>Razão Social</label><input type="text" value={legalName} onChange={(e) => setLegalName(e.target.value)} required /></div>
                        <div className={styles.formGroup}><label>CNPJ</label><InputMask mask="99.999.999/9999-99" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required>{(inputProps) => <input {...inputProps} type="text" />}</InputMask></div>
                        <div className={styles.formGroup}><label>Nome Fantasia</label><input type="text" value={fantasyName} onChange={(e) => setFantasyName(e.target.value)} /></div>
                    </div>
                ) : (
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}><label>Nome Completo</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                        <div className={styles.formGroup}><label>CPF</label><InputMask mask="999.999.999-99" value={cpf} onChange={(e) => setCpf(e.target.value)} required>{(inputProps) => <input {...inputProps} type="text" />}</InputMask></div>
                    </div>
                )}
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend>Responsável pela Conta e Acesso</legend>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}><label>Nome do Responsável</label><input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required /></div>
                    <div className={styles.formGroup}><label>Email (será o login)</label><input type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} required /></div>
                    <div className={styles.formGroup}><label>Celular / WhatsApp</label><InputMask mask="(99) 99999-9999" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} required>{(inputProps) => <input {...inputProps} type="tel" />}</InputMask></div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.passwordInputGroup}>
                        <div className={styles.formGroup} style={{ flex: 4 }}>
                            <label>Senha de Acesso {isEditing ? '(Opcional)' : ''}</label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isEditing ? "Deixe em branco para não alterar" : "Digite ou gere uma senha"}
                                required={!isEditing}
                            />
                        </div>
                        <div className={styles.formGroup} style={{ flex: 1, alignSelf: 'flex-end' }}>
                            <button type="button" onClick={generatePassword} className={styles.generateButton}>
                                Gerar Senha
                            </button>
                        </div>
                    </div>
                </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend>Endereço Principal</legend>
                <div className={styles.formRow}>
                    <div className={styles.formGroup} style={{ flex: 1 }}><label>CEP</label><InputMask mask="99999-999" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={handleCepBlur} required>{(inputProps) => <input {...inputProps} type="text" />}</InputMask>{isCepLoading && <small>Buscando...</small>}</div>
                    <div className={styles.formGroup} style={{ flex: 3 }}><label>Rua</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
                    <div className={styles.formGroup} style={{ flex: 0.5 }}><label>Nº</label><input type="text" value={number} onChange={(e) => setNumber(e.target.value)} required /></div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}><label>Complemento</label><input type="text" value={complement} onChange={(e) => setComplement(e.target.value)} /></div>
                    <div className={styles.formGroup}><label>Bairro</label><input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required /></div>
                    <div className={styles.formGroup}><label>Cidade</label><input type="text" value={city} onChange={(e) => setCity(e.target.value)} required /></div>
                    <div className={styles.formGroup} style={{ flex: 0.5 }}><label>UF</label><input type="text" maxLength="2" value={state} onChange={(e) => setState(e.target.value)} required /></div>
                </div>
            </fieldset>
            
            {(internalError || serverError) && <p className={styles.error}>{internalError || serverError}</p>}

            {/* MUDANÇA 2: O grupo de botões agora inclui o botão de Cancelar */}
            <div className={styles.buttonGroup}>
                {/* O botão Cancelar só é renderizado se a função onCancel for passada */}
                {onCancel && (
                    <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={isSubmitting}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Conta')}
                </button>
            </div>
        </form>
    );
};

export default AccountForm;
