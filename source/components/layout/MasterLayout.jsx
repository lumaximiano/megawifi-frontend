import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './MasterLayout.module.css';
import AnimatedPage from './AnimatedPage';

import {
    HiOutlineChartPie,
    HiOutlineKey,
    HiOutlineUsers,
    HiOutlineCollection,
    HiOutlinePuzzle,
    HiOutlineCog,
    HiOutlineLogout,
    HiOutlineServer,
    HiOutlineCash,
} from 'react-icons/hi';

const MasterLayout = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userPrimaryRole, setUserPrimaryRole] = useState(null);
    // Novo estado para armazenar as permissões do usuário
    const [permissions, setPermissions] = useState(null);

    const getUserPrimaryRole = (userObject) => {
        if (!userObject || !userObject.roles || userObject.roles.length === 0) {
            return null;
        }
        const roles = userObject.roles.map(r => r.role.name);
        
        if (roles.includes('MASTER')) return 'MASTER';
        if (roles.includes('ADMIN')) return 'ADMIN';
        if (roles.includes('ACCOUNT_OWNER')) return 'ACCOUNT_OWNER';
        if (roles.includes('ACCOUNT_STAFF')) return 'ACCOUNT_STAFF';
        return null;
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setUserPrimaryRole(getUserPrimaryRole(parsedUser));
            
            // Extrai e define as permissões do usuário logado
            // Se o usuário não tiver permissões (usuário antigo), define um objeto vazio para não quebrar o layout
            setPermissions(parsedUser.permissions || {});

        } else {
            handleLogout();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Adicionado um estado de carregamento mais robusto enquanto as permissões não carregam
    if (!user || !permissions) {
        return <div>Carregando...</div>;
    }

    const isMaster = userPrimaryRole === 'MASTER';

    return (
        <div className={styles.masterLayout}>
            <aside className={styles.sidebar}>
                <h1 className={styles.logo}>MEGAWIFI</h1>
                <p className={styles.panelTitle}>Painel Master</p>

                <nav className={styles.nav}>
                    {/* Adicionada a verificação de permissão para cada NavLink */}
                    {permissions.dashboard?.view && <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}><HiOutlineChartPie className={styles.icon} /><span>Dashboard</span></NavLink>}
                    
                    {/* A lógica 'isMaster' é mantida como uma camada extra de segurança, mas a permissão é a chave */}
                    {isMaster && permissions.masters?.view && <NavLink to="/admin/masters" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}><HiOutlineKey className={styles.icon} /><span>Masters</span></NavLink>}
                    
                    {permissions.accounts?.view && <NavLink to="/admin/accounts" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}><HiOutlineUsers className={styles.icon} /><span>Contas</span></NavLink>}
                    {permissions.plans?.view && <NavLink to="/admin/planos" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}><HiOutlineCollection className={styles.icon} /><span>Planos</span></NavLink>}
                    
                    {isMaster && permissions.finance?.view && <NavLink to="/admin/financeiro" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}><HiOutlineCash className={styles.icon} /><span>Financeiro</span></NavLink>}
                    
                    {permissions.server?.view && <NavLink to="/admin/servidor" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}><HiOutlineServer className={styles.icon} /><span>Servidor</span></NavLink>}
                    {permissions.integrations?.view && <NavLink to="/admin/integracao" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}><HiOutlinePuzzle className={styles.icon} /><span>Integração</span></NavLink>}
                    
                    {/* Para a Configuração, podemos assumir que se o usuário pode ver qualquer outra coisa, ele pode ver as configurações */}
                    {/* Ou podemos adicionar ao nosso formulário de permissões, o que é o ideal. Vamos assumir que foi adicionado. */}
                    {permissions.settings?.view && <NavLink to="/admin/configuracao" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}><HiOutlineCog className={styles.icon} /><span>Configuração</span></NavLink>}
                </nav>

                <div className={styles.sessionPanel}>
                    <ul className={styles.sessionDetails}>
                        <li>
                            <span className={styles.sessionLabel}>Usuário:</span>
                            <span className={styles.sessionValue}>{user.name}</span>
                        </li>
                        <li>
                            <span className={styles.sessionLabel}>Role:</span>
                            <span className={styles.sessionValue}>{userPrimaryRole}</span>
                        </li>
                    </ul>
                </div>

                <div className={styles.footer}>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        <HiOutlineLogout className={styles.icon} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
            <main className={styles.content}>
                <AnimatedPage>
                    <Outlet />
                </AnimatedPage>
            </main>
        </div>
    );
};

export default MasterLayout;
