// frontend/source/components/layout/AccountLayout.jsx

import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './AccountLayout.module.css';
import AnimatedPage from './AnimatedPage';

// MUDANÇA 1: Importar os ícones que vamos usar
import {
    HiOutlineChartPie,
    HiOutlineLocationMarker,
    HiOutlineServer,
    HiOutlineCollection,
    HiOutlineWifi,
    HiOutlineClock,
    HiOutlinePuzzle,
    HiOutlineCog,
    HiOutlineLogout
} from 'react-icons/hi';

const AccountLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // É mais seguro usar um useEffect para ler do localStorage, mas por agora manteremos assim.
    const user = JSON.parse(localStorage.getItem('user'));

    // MUDANÇA 2: A classe do NavLink foi padronizada para funcionar como no MasterLayout
    const getNavLinkClass = ({ isActive }) => 
        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    MEGAWIFI
                </div>
                <nav className={styles.nav}>
                    {/* MUDANÇA 3: Ícones adicionados a cada link */}
                    <NavLink to="/account/dashboard" className={getNavLinkClass}>
                        <HiOutlineChartPie className={styles.icon} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/account/locations" className={getNavLinkClass}>
                        <HiOutlineLocationMarker className={styles.icon} />
                        <span>Clientes</span>
                    </NavLink>
                    <NavLink to="/account/mikrotik" className={getNavLinkClass}>
                        <HiOutlineServer className={styles.icon} />
                        <span>Mikrotik</span>
                    </NavLink>
                    <NavLink to="/account/planos" className={getNavLinkClass}>
                        <HiOutlineCollection className={styles.icon} />
                        <span>Planos</span>
                    </NavLink>
                    <NavLink to="/account/hotspot" className={getNavLinkClass}>
                        <HiOutlineWifi className={styles.icon} />
                        <span>Hotspot</span>
                    </NavLink>
                    <NavLink to="/account/sessoes" className={getNavLinkClass}>
                        <HiOutlineClock className={styles.icon} />
                        <span>Sessões</span>
                    </NavLink>
                    <NavLink to="/account/integracoes" className={getNavLinkClass}>
                        <HiOutlinePuzzle className={styles.icon} />
                        <span>Integrações</span>
                    </NavLink>
                    <NavLink to="/account/configuracoes" className={getNavLinkClass}>
                        <HiOutlineCog className={styles.icon} />
                        <span>Configurações</span>
                    </NavLink>
                </nav>
                <div className={styles.footer}>
                    <div className={styles.userInfo}>
                        <span>{user?.name || 'Usuário'}</span>
                        <small>{user?.email || ''}</small>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        <HiOutlineLogout className={styles.icon} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
            <main className={styles.mainContent}>
                <AnimatedPage>
                    <Outlet />
                </AnimatedPage>
            </main>
        </div>
    );
};

export default AccountLayout;
