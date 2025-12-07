import React, { useState, useEffect } from 'react';
import styles from '@styles/FormPage.module.css';
import { FaSpinner } from 'react-icons/fa';
import InputMask from 'react-input-mask';

// Estrutura de permissões (chaves em inglês, para o banco de dados)
const initialPermissions = {
    dashboard: { view: false },
    masters: { view: false, create: false, edit: false, delete: false },
    accounts: { view: false, create: false, edit: false, delete: false },
    plans: { view: false, create: false, edit: false, delete: false },
    finance: { view: false, viewReports: false, manageSubscriptions: false },
    server: { view: false, viewStatus: false, viewMetrics: false, restart: false },
    integrations: { view: false, editStripe: false, editMikrotik: false },
    settings: { view: false, editGeneral: false, editAppearance: false },
};

// =====> CORREÇÃO AQUI: Dicionário de tradução <=====
const permissionLabels = {
    view: 'Ver',
    create: 'Criar',
    edit: 'Editar',
    delete: 'Excluir',
    viewReports: 'Ver Relatórios',
    manageSubscriptions: 'Gerenciar Assinaturas',
    viewStatus: 'Ver Status',
    viewMetrics: 'Ver Métricas',
    restart: 'Reiniciar Serviços',
    editStripe: 'Editar Stripe',
    editMikrotik: 'Editar Mikrotik',
    editGeneral: 'Geral',
    editAppearance: 'Aparência',
};

// Função de fallback caso uma tradução não seja encontrada
const formatPermissionName = (name) => {
    const result = name.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
};

const UserForm = ({ initialData = {}, onSubmit, onCancel, isEditing = false, isSubmitting = false, serverError = '' }) => {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [internalError, setInternalError] = useState('');
    const [permissions, setPermissions] = useState(initialPermissions);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (isEditing && initialData) {
            setName(initialData.name || '');
            setEmail(initialData.email || '');
            setPhone(initialData.phone || '');
            if (initialData.permissions) {
                setPermissions(prev => ({ ...initialPermissions, ...initialData.permissions }));
            }
        }
    }, [initialData, isEditing]);

    const handlePermissionChange = (module, permission) => {
        setPermissions(prev => {
            const newModulePermissions = { ...prev[module] };
            newModulePermissions[permission] = !newModulePermissions[permission];
            
            if (permission === 'view' && !newModulePermissions.view) {
                Object.keys(newModulePermissions).forEach(key => {
                    newModulePermissions[key] = false;
                });
            }
            return { ...prev, [module]: newModulePermissions };
        });
    };

    const handleSelectAll = (shouldSelectAll) => {
        const newPermissions = { ...initialPermissions };
        for (const module in newPermissions) {
            for (const permission in newPermissions[module]) {
                newPermissions[module][permission] = shouldSelectAll;
            }
        }
        setPermissions(newPermissions);
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(pass);
    };

    const localHandleSubmit = (e) => {
        e.preventDefault();
        setInternalError('');
        if (!isEditing && !password) {
            setInternalError('A senha é obrigatória para novos usuários.');
            return;
        }
        const payload = { name, email, phone: phone.replace(/\D/g, ''), permissions };
        if (password) {
            payload.password = password;
        }
        onSubmit(payload);
    };

    // =====> CORREÇÃO AQUI: Usando o dicionário <=====
    const renderPermissionsFor = (module, name) => (
        <div className={styles.permissionModule}>
            <label className={styles.moduleHeader}>
                <input type="checkbox" checked={permissions[module]?.view || false} onChange={() => handlePermissionChange(module, 'view')} />
                <strong>{name}</strong>
            </label>
            <div className={styles.subPermissions}>
                {Object.keys(permissions[module]).filter(p => p !== 'view').map(perm => (
                    <label key={perm}>
                        <input type="checkbox" disabled={!permissions[module]?.view} checked={permissions[module]?.[perm] || false} onChange={() => handlePermissionChange(module, perm)} />
                        <span>{permissionLabels[perm] || formatPermissionName(perm)}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <form onSubmit={localHandleSubmit} className={styles.form}>
            <fieldset className={styles.fieldset}>
                <legend>Dados do Usuário</legend>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}><label>Nome Completo</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}><label>Email (login)</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                    <div className={styles.formGroup}><label>Celular / WhatsApp</label><InputMask mask="(99) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)}>{(inputProps) => <input {...inputProps} type="tel" />}</InputMask></div>
                </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend>Credenciais de Acesso</legend>
                <div className={styles.formRow}>
                    <div className={styles.passwordInputGroup}>
                        <div className={styles.formGroup} style={{ flex: 4 }}><label>Nova Senha {isEditing && '(Opcional)'}</label><input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isEditing ? "Deixe em branco para não alterar" : "Digite ou gere uma senha"} required={!isEditing} /></div>
                        <div className={styles.formGroup} style={{ flex: 1, alignSelf: 'flex-end' }}><button type="button" onClick={generatePassword} className={styles.generateButton}>Gerar Senha</button></div>
                    </div>
                </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
                <div className={styles.legendHeader}><legend>Permissões do Painel</legend><div className={styles.actionsHeader}><button type="button" className={styles.selectAllButton} onClick={() => handleSelectAll(true)}>Selecionar Tudo</button><button type="button" className={styles.clearAllButton} onClick={() => handleSelectAll(false)}>Limpar Tudo</button></div></div>
                <div className={styles.tabNav}>
                    <button type="button" className={activeTab === 'dashboard' ? styles.activeTab : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                    <button type="button" className={activeTab === 'masters' ? styles.activeTab : ''} onClick={() => setActiveTab('masters')}>Masters</button>
                    <button type="button" className={activeTab === 'accounts' ? styles.activeTab : ''} onClick={() => setActiveTab('accounts')}>Contas</button>
                    <button type="button" className={activeTab === 'plans' ? styles.activeTab : ''} onClick={() => setActiveTab('plans')}>Planos</button>
                    <button type="button" className={activeTab === 'finance' ? styles.activeTab : ''} onClick={() => setActiveTab('finance')}>Financeiro</button>
                    <button type="button" className={activeTab === 'server' ? styles.activeTab : ''} onClick={() => setActiveTab('server')}>Servidor</button>
                    <button type="button" className={activeTab === 'integrations' ? styles.activeTab : ''} onClick={() => setActiveTab('integrations')}>Integrações</button>
                </div>
                <div className={styles.tabContent}>
                    {activeTab === 'dashboard' && (<div className={styles.permissionModule}><label className={styles.moduleHeader}><input type="checkbox" checked={permissions.dashboard?.view || false} onChange={() => handlePermissionChange('dashboard', 'view')} /><strong>Permitir Visualização do Dashboard</strong></label><div className={styles.subPermissions}><span style={{color: '#6c757d'}}>O dashboard é a página inicial. Outras permissões afetam os dados exibidos aqui.</span></div></div>)}
                    {activeTab === 'masters' && renderPermissionsFor('masters', 'Acesso ao Módulo de Masters')}
                    {activeTab === 'accounts' && renderPermissionsFor('accounts', 'Acesso ao Módulo de Contas')}
                    {activeTab === 'plans' && renderPermissionsFor('plans', 'Acesso ao Módulo de Planos')}
                    {activeTab === 'finance' && renderPermissionsFor('finance', 'Acesso ao Módulo Financeiro')}
                    {activeTab === 'server' && renderPermissionsFor('server', 'Acesso ao Módulo de Servidor')}
                    {activeTab === 'integrations' && renderPermissionsFor('integrations', 'Acesso ao Módulo de Integrações')}
                </div>
            </fieldset>
            
            {(internalError || serverError) && <p className={styles.error}>{internalError || serverError}</p>}

            <div className={styles.buttonGroup}>
                {onCancel && (<button type="button" className={styles.cancelButton} onClick={onCancel} disabled={isSubmitting}>Cancelar</button>)}
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? <><FaSpinner className="spinner" /> Salvando...</> : (isEditing ? 'Salvar Alterações' : 'Cadastrar Master')}</button>
            </div>
        </form>
    );
};

export default UserForm;
