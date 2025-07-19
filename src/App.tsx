import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthSimpleBackup from './pages/AuthSimpleBackup';
import ClientPortalSimple from './pages/ClientPortalSimple';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import { AuthProvider } from './contexts/SupabaseAuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthSimpleBackup />} />
          <Route path="/auth/callback" element={<AuthSimpleBackup />} />
          <Route path="/client-portal" element={<ClientPortalSimple />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
