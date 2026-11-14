'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { WebLayout } from '@/components/layout/WebLayout';
import { AuthView } from '@/components/auth/AuthView';
import { MustahikHome } from '@/components/mustahik/MustahikHome';
import { Program6MView } from '@/components/mustahik/Program6MView';
import { DanaView } from '@/components/mustahik/DanaView';
import { ProfilView } from '@/components/mustahik/ProfilView';
import { AmilDashboard } from '@/components/amil/AmilDashboard';
import { AmilSubmissions } from '@/components/amil/AmilSubmissions';
import { AmilVerifications } from '@/components/amil/AmilVerifications';
import { AmilAccount } from '@/components/amil/AmilAccount';
import { MuzakkiPlaceholder } from '@/components/muzakki/MuzakkiPlaceholder';

const MainScreen: React.FC = () => {
  const { isLoggedIn, role, mustahikTab, amilTab } = useApp();

  if (!isLoggedIn) {
    return <AuthView />;
  }

  if (role === 'mustahik') {
    return (
      <div className="w-full">
        {mustahikTab === 'beranda' && <MustahikHome />}
        {mustahikTab === '6m' && <Program6MView />}
        {mustahikTab === 'dana' && <DanaView />}
        {mustahikTab === 'profil' && <ProfilView />}
      </div>
    );
  }

  if (role === 'amil') {
    return (
      <div className="w-full">
        {amilTab === 'dasbor' && <AmilDashboard />}
        {amilTab === 'pengajuan' && <AmilSubmissions />}
        {amilTab === 'verifikasi' && <AmilVerifications />}
        {amilTab === 'akun' && <AmilAccount />}
      </div>
    );
  }

  if (role === 'muzakki') {
    return <MuzakkiPlaceholder />;
  }

  return null;
};

export default function Home() {
  return (
    <AppProvider>
      <WebLayout>
        <MainScreen />
      </WebLayout>
    </AppProvider>
  );
}
