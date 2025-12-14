import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- PÁGINAS MASTER ---
import LoginPage from './pages/LoginPage';
import MasterLayout from './components/layout/MasterLayout';
import DashboardMasterPage from './portals/master/pages/dashboard/DashboardMasterPage';
import ManageMastersPage from './portals/master/pages/masters/ManageMastersPage';
import AddMasterPage from './portals/master/pages/masters/AddMasterPage';
import EditMasterPage from './portals/master/pages/masters/EditMasterPage';
import ManageAccountsPage from './portals/master/pages/accounts/ManageAccountsPage';
import EditAccountPage from './portals/master/pages/accounts/EditAccountPage';
import AddAccountPage from './portals/master/pages/accounts/AddAccountPage';
import SubscriptionPlansPage from './portals/master/pages/plans/SubscriptionPlansPage';
import FinancePage from './portals/master/pages/finance/FinancePage';
import ServerStatusPage from './portals/master/pages/server/ServerStatusPage';
import IntegrationsMasterPage from './portals/master/pages/integrations/IntegrationsMasterPage';
import ConfigurationMasterPage from './portals/master/pages/settings/ConfigurationMasterPage';

// --- PÁGINAS DA CONTA (ACCOUNT) ---
import AccountLayout from './components/layout/AccountLayout';
import DashboardAccountPage from './portals/account/pages/dashboard/DashboardPage';
import ManageLocationsPage from './portals/account/pages/location/ManageLocationsPage';
import AddLocationPage from './portals/account/pages/location/AddLocationPage';
import RoutersPage from './portals/account/pages/mikrotik/RoutersPage';
import SubscriptionLocationPage from './portals/account/pages/plans/SubscriptionLocationPage';
import PlansPage from './portals/account/pages/hotspot/PlansPage';
import HotspotPage from './portals/account/pages/hotspot/HotspotPage';
import SessionsPage from './portals/account/pages/sessions/SessionsPage';
import IntegrationsPage from './portals/account/pages/integrations/IntegrationsPage';
import ConfigurationAccountPage from './portals/account/pages/settings/ConfigurationAccountPage';
import EditLocationPage from './portals/account/pages/location/EditLocationPage';






const PlaceholderPage = ({ title }) => <div>{title} (em construção)</div>;


// --- COMPONENTE DE ROTAS ---
const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... (O resto do seu código, como getUserPrimaryRole, useEffect, etc., permanece o mesmo)
  const getUserPrimaryRole = (userObject) => {
    if (!userObject || !userObject.roles || userObject.roles.length === 0) return null;
    const roles = userObject.roles.map(r => r.role.name);
    if (roles.includes('MASTER')) return 'MASTER';
    if (roles.includes('ADMIN')) return 'ADMIN';
    if (roles.includes('ACCOUNT_OWNER')) return 'ACCOUNT_OWNER';
    if (roles.includes('ACCOUNT_STAFF')) return 'ACCOUNT_STAFF';
    return null;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Falha ao analisar o usuário do localStorage", e);
          handleLogout();
        }
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    setIsAuthenticated(true);
    const primaryRole = getUserPrimaryRole(storedUser);
    if (primaryRole === 'MASTER' || primaryRole === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (primaryRole === 'ACCOUNT_OWNER' || primaryRole === 'ACCOUNT_STAFF') {
      navigate('/account/dashboard');
    } else {
      console.error("Login bem-sucedido, mas nenhum papel primário encontrado. Fazendo logout.", storedUser);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const userPrimaryRole = getUserPrimaryRole(user);


  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to={userPrimaryRole === 'MASTER' || userPrimaryRole === 'ADMIN' ? '/admin' : '/account'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {isAuthenticated && user ? (
          <>
            {/* --- ROTAS DO PAINEL MASTER --- */}
            {(userPrimaryRole === 'MASTER' || userPrimaryRole === 'ADMIN') && (
              <Route path="/admin" element={<MasterLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardMasterPage />} />
                {userPrimaryRole === 'MASTER' && <Route path="masters" element={<ManageMastersPage />} />}
                {userPrimaryRole === 'MASTER' && <Route path="masters/new" element={<AddMasterPage />} />} 
                {userPrimaryRole === 'MASTER' && <Route path="masters/edit/:id" element={<EditMasterPage />} />}
                
                <Route path="accounts" element={<ManageAccountsPage />} />
                <Route path="accounts/new" element={<AddAccountPage />} />
                <Route path="accounts/edit/:id" element={<EditAccountPage />} />
                <Route path="planos" element={<SubscriptionPlansPage />} />
                {userPrimaryRole === 'MASTER' && <Route path="financeiro" element={<FinancePage />} />}
                <Route path="servidor" element={<ServerStatusPage />} />
                <Route path="integracao" element={<IntegrationsMasterPage />} />
                <Route path="configuracao" element={<ConfigurationMasterPage />} />
              </Route>
            )}

            {/* --- ROTAS DO PAINEL DA CONTA --- */}
            {(userPrimaryRole === 'ACCOUNT_OWNER' || userPrimaryRole === 'ACCOUNT_STAFF') && (
              <Route path="/account" element={<AccountLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardAccountPage />} />
                <Route path="locations" element={<ManageLocationsPage />} />
                <Route path="locations/new" element={<AddLocationPage />} />
                <Route path="location/edit/:id" element={<EditLocationPage />} />
                <Route path="mikrotik" element={<RoutersPage />} />
                <Route path="planos" element={<SubscriptionLocationPage />} />
                <Route path="hotspot" element={<HotspotPage />} />
                <Route path="integracoes" element={<IntegrationsPage />} />
                <Route path="sessoes" element={<SessionsPage />} />
                <Route path="configuracoes" element={<ConfigurationAccountPage />} />
              </Route>
            )}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

// --- COMPONENTE PRINCIPAL DA APLICAÇÃO ---
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
