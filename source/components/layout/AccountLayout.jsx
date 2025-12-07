// frontend/source/components/layout/AccountLayout.jsx

import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './AccountLayout.module.css';

// MUDANÇA 1: Importa o componente de animação
import AnimatedPage from './AnimatedPage';


const AccountLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    MEGAWIFI
                </div>
                <nav className={styles.nav}>
                    <NavLink to="/account/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/account/locations" className={({ isActive }) => isActive ? styles.active : ''}>
                        Locais
                    </NavLink>
                    <NavLink to="/account/mikrotik" className={({ isActive }) => isActive ? styles.active : ''}>
                        Mikrotik
                    </NavLink>
                    <NavLink to="/account/planos" className={({ isActive }) => isActive ? styles.active : ''}>
                        Planos
                    </NavLink>
                    <NavLink to="/account/hotspot" className={({ isActive }) => isActive ? styles.active : ''}>
                        Hotspot
                    </NavLink>
                    <NavLink to="/account/sessoes" className={({ isActive }) => isActive ? styles.active : ''}>
                        Sessões
                    </NavLink>
                    <NavLink to="/account/integracoes" className={({ isActive }) => isActive ? styles.active : ''}>
                        Integrações
                    </NavLink>
                    <NavLink to="/account/configuracoes" className={({ isActive }) => isActive ? styles.active : ''}>
                        Configurações
                    </NavLink>
                </nav>
                <div className={styles.footer}>
                     <div className={styles.userInfo}>
                        <span>{user?.name || 'Usuário'}</span>
                        <small>{user?.email || ''}</small>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Sair
                    </button>
                </div>
            </aside>
            <main className={styles.mainContent}>
                {/* MUDANÇA 2: O Outlet agora está envolvido pelo AnimatedPage */}
                <AnimatedPage>
                    <Outlet />
                </AnimatedPage>
            </main>
        </div>
    );
};

export default AccountLayout;
