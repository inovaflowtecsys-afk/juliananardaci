/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { ProfessionalsPage } from './pages/ProfessionalsPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { TreatmentsPage } from './pages/TreatmentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { Toaster } from './components/ui/sonner';
import { LoginPage } from './pages/LoginPage';
import { mockAuth } from './services/mockAuth';
import { AuthSession } from './types';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [session, setSession] = React.useState<AuthSession | null>(() => mockAuth.getSession());

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    const nextSession = mockAuth.signIn(email, password);
    setSession(nextSession);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    mockAuth.signOut();
    setSession(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPage />;
      case 'clients': return <ClientsPage />;
      case 'professionals': return <ProfessionalsPage />;
      case 'suppliers': return <SuppliersPage />;
      case 'treatments': return <TreatmentsPage />;
      case 'attendances': return <AttendancePage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <>
      {session ? (
        <Layout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={session.user}
          onLogout={handleLogout}
        >
          {renderContent()}
        </Layout>
      ) : (
        <LoginPage onLogin={handleLogin} demoPassword={mockAuth.getDemoPassword()} />
      )}
      <Toaster position="top-right" />
    </>
  );
}

