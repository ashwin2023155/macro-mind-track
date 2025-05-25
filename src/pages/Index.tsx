
import React from 'react';
import { AppProvider, useApp } from '../contexts/AppContext';
import { Onboarding } from '../components/Onboarding';
import { Dashboard } from '../components/Dashboard';
import { AIChat } from '../components/AIChat';

const AppContent: React.FC = () => {
  const { isOnboarded } = useApp();

  return (
    <div className="dark">
      {!isOnboarded ? <Onboarding /> : <Dashboard />}
      {isOnboarded && <AIChat />}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
