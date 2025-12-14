// frontend/source/portals/master/pages/AddAccountPage.jsx - v1.0 (Refatorado)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '@components/form/RegisterForm.module.css';
import axios from 'axios';
import api from '@api/axiosConfig';
import InputMask from 'react-input-mask';

// MUDANÇA 1: Nome do componente atualizado
const AddAccountPage = () => {
    const navigate = useNavigate();
    
    // Estados do formulário (nomes mantidos para simplicidade, mas representam a nova Account)
    const [password, setPassword] = useState('');
    const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
    const [accountType, setAccountType] = useState('PJ'); // MUDANÇA DE NOME: clientType -> accountType
    const [name, setName] = useState(''); // MUDANÇA DE NOME: fullName -> name (para PF)
    const [cpf, setCpf] = useState('');
    const [fantasyName, setFantasyName] = useState(''); // MUDANÇA DE NOME: companyName -> fantasyName
    const [legalName, setLegalName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [ownerName, setOwnerName] = useState(''); // MUDANÇA DE NOME: contactName -> ownerName
    const [ownerEmail, setOwnerEmail] = useState(''); // MUDANÇA DE NOME: contactEmail -> ownerEmail
    const [ownerPhone, setOwnerPhone] = useState(''); // MUDANÇA DE NOME: contactPhone -> ownerPhone
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCepLoading, setIsCepLoading] = useState(false);

    const handleGeneratePassword = async () => {
        setIsGeneratingPassword(true);
        setError('');
        try {
            const response = await api.get('/api/password/generate');
            setPassword(response.data.password);
        } catch (err) {
            setError('Falha ao gerar a senha. Tente novamente.');
        } finally {
            setIsGeneratingPassword(false);
        }
    };

    const handleCepBlur = async (e) => {
        const currentCep = e.target.value.replace(/\D/g, '');
        if (currentCep.length !== 8) return;
        setIsCepLoading(true);
        setError('');
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${currentCep}/json/` );
            if (response.data.erro) {
                setError('CEP não encontrado.');
                setAddress(''); setNeighborhood(''); setCity(''); setState('');
            } else {
                setAddress(response.data.logradouro);
                setNeighborhood(response.data.bairro);
                setCity(response.data.localidade);
                setState(response.data.uf);
            }
        } catch (err) {
            setError('Falha ao buscar o CEP. Verifique sua conexão.');
        } finally {
            setIsCepLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password) {
            setError('O campo de senha é obrigatório. Gere uma ou digite manualmente.');
            return;
        }

        setIsSubmitting(true);

        // MUDANÇA 2: Payload ajustado para o novo endpoint de criação de 'Account'
        const payload = {
            type: accountType,
            // Dados da Account
            ...(accountType === 'PF' 
                ? { name, document: cpf.replace(/\D/g, '') }
                : { legalName, fantasyName, document: cnpj.replace(/\D/g, '') }
            ),
            // Dados do primeiro usuário (Account Owner)
            owner: { 
                name: ownerName, 
                email: ownerEmail, 
                phone: ownerPhone.replace(/\D/g, ''),
                password: password,
            },
            // Endereço principal da Account
            address: { 
                cep: cep.replace(/\D/g, ''), 
                street: address, 
                number, 
                complement, 
                neighborhood, 
                city, 
                state 
            },
        };

        try {
            // MUDANÇA 3: Endpoint da API atualizado de '/clients' para '/accounts'
            await api.post('/api/accounts', payload);
            setSuccess('Conta cadastrada com sucesso! Redirecionando...');
            // MUDANÇA 4: Redireciona para a nova rota de gerenciamento de contas
            setTimeout(() => navigate('/admin/accounts'), 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao cadastrar a conta.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            {/* MUDANÇA 5: Textos da UI atualizados */}
            <h1 className={styles.title}>Cadastrar Nova Conta</h1>
            <p className={styles.subtitle}>Preencha os dados da conta, do responsável e o endereço principal.</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
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
                            <div className={styles.formGroup}><label htmlFor="legalName">Razão Social</label><input id="legalName" type="text" value={legalName} onChange={(e) => setLegalName(e.target.value)} required /></div>
                            <div className={styles.formGroup}>
                                <label htmlFor="cnpj">CNPJ</label>
                                <InputMask mask="99.999.999/9999-99" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required>
                                    {(inputProps) => <input {...inputProps} type="text" id="cnpj" />}
                                </InputMask>
                            </div>
                            <div className={styles.formGroup}><label htmlFor="fantasyName">Nome Fantasia</label><input id="fantasyName" type="text" value={fantasyName} onChange={(e) => setFantasyName(e.target.value)} /></div>
                        </div>
                    ) : (
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}><label htmlFor="name">Nome Completo</label><input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                            <div className={styles.formGroup}>
                                <label htmlFor="cpf">CPF</label>
                                <InputMask mask="999.999.999-99" value={cpf} onChange={(e) => setCpf(e.target.value)} required>
                                    {(inputProps) => <input {...inputProps} type="text" id="cpf" />}
                                </InputMask>
                            </div>
                        </div>
                    )}
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend>Responsável pela Conta e Acesso</legend>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}><label htmlFor="ownerName">Nome do Responsável</label><input id="ownerName" type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required /></div>
                        <div className={styles.formGroup}><label htmlFor="ownerEmail">Email (será o login)</label><input id="ownerEmail" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} required /></div>
                        <div className={styles.formGroup}>
                            <label htmlFor="ownerPhone">Celular / WhatsApp</label>
                            <InputMask mask="(99) 99999-9999" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} required>
                                {(inputProps) => <input {...inputProps} type="tel" id="ownerPhone" />}
                            </InputMask>
                        </div>
                    </div>
                    
                    <div className={styles.formRow}>
                        <div className={styles.passwordInputGroup}>
                            <div className={styles.formGroup} style={{ flex: 4 }}>
                                <label htmlFor="password">Senha de Acesso</label>
                                <input id="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Digite ou gere uma senha" />
                            </div>
                            <div className={styles.formGroup} style={{ flex: 1, alignSelf: 'flex-end' }}>
                                <button type="button" onClick={handleGeneratePassword} className={styles.generateButton} disabled={isGeneratingPassword}>
                                    {isGeneratingPassword ? 'Gerando...' : 'Gerar Senha'}
                                </button>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend>Endereço Principal</legend>
                    {/* Campos de endereço permanecem os mesmos */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label htmlFor="cep">CEP</label>
                            <InputMask mask="99999-999" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={handleCepBlur} required>
                                {(inputProps) => <input {...inputProps} type="text" id="cep" />}
                            </InputMask>
                            {isCepLoading && <small className={styles.loadingText}>Buscando...</small>}
                        </div>
                        <div className={styles.formGroup} style={{ flex: 3 }}><label htmlFor="address">Rua / Logradouro</label><input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
                        <div className={styles.formGroup} style={{ flex: 0.5 }}><label htmlFor="number">Nº</label><input id="number" type="text" value={number} onChange={(e) => setNumber(e.target.value)} required /></div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup} style={{ flex: 2 }}><label htmlFor="complement">Complemento (Opcional)</label><input id="complement" type="text" value={complement} onChange={(e) => setComplement(e.target.value)} /></div>
                        <div className={styles.formGroup} style={{ flex: 2 }}><label htmlFor="neighborhood">Bairro</label><input id="neighborhood" type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required /></div>
                        <div className={styles.formGroup} style={{ flex: 2 }}><label htmlFor="city">Cidade</label><input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required /></div>
                        <div className={styles.formGroup} style={{ flex: 0.5 }}><label htmlFor="state">UF</label><input id="state" type="text" maxLength="2" value={state} onChange={(e) => setState(e.target.value)} required /></div>
                    </div>
                </fieldset>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}

                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Conta'}
                    </button>
                    <button type="button" className={styles.cancelButton} onClick={() => navigate('/admin/accounts')}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default AddAccountPage;
