// frontend/source/components/form/MasterForm.jsx - VERSÃO FINAL E CORRETA

import React, { useState, useEffect } from 'react';
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

// Dicionário de tradução para as labels das permissões
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

// Função de fallback para formatar nomes de permissão não traduzidos
const formatPermissionName = (name) => {
    const result = name.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
};

const MasterForm = ({ initialData = {}, onSubmit, onCancel, isEditing = false, isSubmitting = false, serverError = '' }) => {
    
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
                // Merge seguro para garantir que todas as chaves de `initialPermissions` existam
                const mergedPermissions = { ...initialPermissions };
                for (const module in mergedPermissions) {
                    if (initialData.permissions[module]) {
                        mergedPermissions[module] = { ...mergedPermissions[module], ...initialData.permissions[module] };
                    }
                }
                setPermissions(mergedPermissions);
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

    const renderPermissionsFor = (module, name) => (
        <div className="flex flex-col p-4 border border-gray-200 rounded-lg bg-gray-50">
            <label className="flex items-center gap-2.5 text-base font-semibold pb-2.5 mb-2.5 border-b border-gray-200 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={permissions[module]?.view || false} onChange={() => handlePermissionChange(module, 'view')} />
                <strong>{name}</strong>
            </label>
            <div className="flex flex-col gap-3 pl-7">
                {Object.keys(permissions[module]).filter(p => p !== 'view').map(perm => (
                    <label key={perm} className="flex items-center gap-2 font-normal select-none has-[:disabled]:cursor-not-allowed">
                        <input type="checkbox" className="cursor-pointer" disabled={!permissions[module]?.view} checked={permissions[module]?.[perm] || false} onChange={() => handlePermissionChange(module, perm)} />
                        <span className="py-0.5 disabled:text-gray-400 disabled:line-through">{permissionLabels[perm] || formatPermissionName(perm)}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <form onSubmit={localHandleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
            <fieldset className="border border-gray-200 rounded-lg p-6 mb-6">
                <legend className="font-semibold text-gray-700 px-2 text-lg">Dados do Usuário</legend>
                <div className="flex flex-wrap gap-6 mb-4">
                    <div className="flex-1 min-w-[150px]"><label className="block font-semibold mb-2 text-gray-700">Nome Completo</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md text-base box-border" /></div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex-1 min-w-[150px]"><label className="block font-semibold mb-2 text-gray-700">Email (login)</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md text-base box-border" /></div>
                    <div className="flex-1 min-w-[150px]"><label className="block font-semibold mb-2 text-gray-700">Celular / WhatsApp</label><InputMask mask="(99) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)}>{(inputProps) => <input {...inputProps} type="tel" className="w-full p-3 border border-gray-300 rounded-md text-base box-border" />}</InputMask></div>
                </div>
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-6 mb-6">
                <legend className="font-semibold text-gray-700 px-2 text-lg">Credenciais de Acesso</legend>
                <div className="flex flex-wrap gap-6">
                    <div className="flex w-full gap-4 items-end">
                        <div className="flex-1"><label className="block font-semibold mb-2 text-gray-700">Nova Senha {isEditing && '(Opcional)'}</label><input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isEditing ? "Deixe em branco para não alterar" : "Digite ou gere uma senha"} required={!isEditing} className="w-full p-3 border border-gray-300 rounded-md text-base box-border" /></div>
                        <div className="flex-none"><button type="button" onClick={generatePassword} className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 text-gray-700 font-semibold text-base cursor-pointer whitespace-nowrap transition-all duration-250 hover:bg-green-300 hover:border-gray-400">Gerar Senha</button></div>
                    </div>
                </div>
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-6 mb-0">
                <div className="flex justify-between items-center w-full mb-4"><legend className="font-semibold text-gray-700 px-2 text-lg m-0">Permissões do Painel</legend><div className="flex gap-2.5"><button type="button" className="py-1.5 px-3 text-xs font-semibold rounded-md cursor-pointer transition-all duration-200 bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200" onClick={() => handleSelectAll(true)}>Selecionar Tudo</button><button type="button" className="py-1.5 px-3 text-xs font-semibold rounded-md cursor-pointer transition-all duration-200 bg-gray-100 text-red-600 border border-red-300 hover:bg-gray-200" onClick={() => handleSelectAll(false)}>Limpar Tudo</button></div></div>
                <div className="flex flex-wrap border-b-2 border-gray-200 mb-6">
                    <button type="button" className={`py-3 px-5 border-b-2 -mb-px transition-all duration-200 text-sm ${activeTab === 'dashboard' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-blue-500'}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                    <button type="button" className={`py-3 px-5 border-b-2 -mb-px transition-all duration-200 text-sm ${activeTab === 'masters' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-blue-500'}`} onClick={() => setActiveTab('masters')}>Masters</button>
                    <button type="button" className={`py-3 px-5 border-b-2 -mb-px transition-all duration-200 text-sm ${activeTab === 'accounts' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-blue-500'}`} onClick={() => setActiveTab('accounts')}>Contas</button>
                    <button type="button" className={`py-3 px-5 border-b-2 -mb-px transition-all duration-200 text-sm ${activeTab === 'plans' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-blue-500'}`} onClick={() => setActiveTab('plans')}>Planos</button>
                    <button type="button" className={`py-3 px-5 border-b-2 -mb-px transition-all duration-200 text-sm ${activeTab === 'finance' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-blue-500'}`} onClick={() => setActiveTab('finance')}>Financeiro</button>
                    <button type="button" className={`py-3 px-5 border-b-2 -mb-px transition-all duration-200 text-sm ${activeTab === 'server' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-blue-500'}`} onClick={() => setActiveTab('server')}>Servidor</button>
                    <button type="button" className={`py-3 px-5 border-b-2 -mb-px transition-all duration-200 text-sm ${activeTab === 'integrations' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-blue-500'}`} onClick={() => setActiveTab('integrations')}>Integrações</button>
                </div>
                <div className="p-1 min-h-[200px]">
                    {activeTab === 'dashboard' && (<div className="flex flex-col p-4 border border-gray-200 rounded-lg bg-gray-50"><label className="flex items-center gap-2.5 text-base font-semibold pb-2.5 mb-2.5 border-b border-gray-200 cursor-pointer select-none"><input type="checkbox" className="w-4 h-4 cursor-pointer" checked={permissions.dashboard?.view || false} onChange={() => handlePermissionChange('dashboard', 'view')} /><strong>Permitir Visualização do Dashboard</strong></label><div className="flex flex-col gap-3 pl-7"><span className="text-gray-500">O dashboard é a página inicial. Outras permissões afetam os dados exibidos aqui.</span></div></div>)}
                    {activeTab === 'masters' && renderPermissionsFor('masters', 'Acesso ao Módulo de Masters')}
                    {activeTab === 'accounts' && renderPermissionsFor('accounts', 'Acesso ao Módulo de Contas')}
                    {activeTab === 'plans' && renderPermissionsFor('plans', 'Acesso ao Módulo de Planos')}
                    {activeTab === 'finance' && renderPermissionsFor('finance', 'Acesso ao Módulo Financeiro')}
                    {activeTab === 'server' && renderPermissionsFor('server', 'Acesso ao Módulo de Servidor')}
                    {activeTab === 'integrations' && renderPermissionsFor('integrations', 'Acesso ao Módulo de Integrações')}
                </div>
            </fieldset>

            {(internalError || serverError) && <p className="p-4 rounded-md mt-4 text-center text-red-700 bg-red-100">{internalError || serverError}</p>}

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                {onCancel && (<button type="button" className="py-3 px-6 border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-250 bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>)}
                <button type="submit" className="py-3 px-6 border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-250 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-70" disabled={isSubmitting}>{isSubmitting ? <><FaSpinner className="animate-spin" /> Salvando...</> : (isEditing ? 'Salvar Alterações' : 'Cadastrar Master')}</button>
            </div>
        </form>
    );
};

export default MasterForm;
