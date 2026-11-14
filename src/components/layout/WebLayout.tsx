'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Home, 
  Compass, 
  Wallet, 
  User, 
  LayoutDashboard, 
  Inbox, 
  CheckSquare, 
  Settings, 
  LogOut
} from 'lucide-react';

interface WebLayoutProps {
  children: React.ReactNode;
}

export const WebLayout: React.FC<WebLayoutProps> = ({ children }) => {
  const {
    role,
    isLoggedIn,
    logout,
    mustahikTab,
    setMustahikTab,
    amilTab,
    setAmilTab,
    evidenceQueue,
  } = useApp();

  const pendingCount = evidenceQueue.filter(e => e.status === 'menunggu').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Main Web Header */}
      {isLoggedIn && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Left: Product title without marketing slop */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-900 text-emerald-100 flex items-center justify-center font-bold text-xs">
                ZM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                    Zakat Mobility
                  </h1>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    role === 'mustahik'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : role === 'amil'
                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {role === 'mustahik' ? 'Mustahik' : role === 'amil' ? 'Amil Verifikator' : 'Donatur'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Pendayagunaan Zakat Produktif Berbasis 6M
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            {role === 'mustahik' && (
              <nav className="hidden md:flex items-center gap-1">
                {[
                  { id: 'beranda', label: 'Beranda', icon: Home },
                  { id: '6m', label: 'Program 6M', icon: Compass },
                  { id: 'dana', label: 'Dana', icon: Wallet },
                  { id: 'profil', label: 'Profil', icon: User },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = mustahikTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setMustahikTab(item.id as any)}
                      className={`taste-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            )}

            {role === 'amil' && (
              <nav className="hidden md:flex items-center gap-1">
                {[
                  { id: 'dasbor', label: 'Dasbor', icon: LayoutDashboard },
                  { id: 'pengajuan', label: 'Pengajuan', icon: Inbox },
                  { id: 'verifikasi', label: 'Verifikasi', icon: CheckSquare, badge: pendingCount },
                  { id: 'akun', label: 'Akun Lembaga', icon: Settings },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = amilTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setAmilTab(item.id as any)}
                      className={`taste-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-teal-800 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.label}
                      {item.badge && item.badge > 0 ? (
                        <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Logout shortcut */}
            <div className="flex items-center">
              <button
                onClick={logout}
                title="Keluar akun"
                className="taste-btn p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 3. Main Content: Symmetrical Equal Edges */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-10 taste-enter">
        {children}
      </main>

      {/* 4. Mobile Bottom Navigation (< 768px) */}
      {isLoggedIn && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-3 py-1.5 z-40 shadow-lg">
          {role === 'mustahik' && (
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'beranda', label: 'Beranda', icon: Home },
                { id: '6m', label: '6M', icon: Compass },
                { id: 'dana', label: 'Dana', icon: Wallet },
                { id: 'profil', label: 'Profil', icon: User },
              ].map(item => {
                const Icon = item.icon;
                const isActive = mustahikTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setMustahikTab(item.id as any)}
                    className={`taste-btn flex flex-col items-center justify-center py-1 rounded-lg ${
                      isActive ? 'text-emerald-800 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {role === 'amil' && (
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'dasbor', label: 'Dasbor', icon: LayoutDashboard },
                { id: 'pengajuan', label: 'Pengajuan', icon: Inbox },
                { id: 'verifikasi', label: 'Verifikasi', icon: CheckSquare, badge: pendingCount },
                { id: 'akun', label: 'Akun', icon: Settings },
              ].map(item => {
                const Icon = item.icon;
                const isActive = amilTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAmilTab(item.id as any)}
                    className={`taste-btn flex flex-col items-center justify-center py-1 rounded-lg relative ${
                      isActive ? 'text-teal-800 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-4 h-4 mb-0.5" />
                      {item.badge && item.badge > 0 ? (
                        <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </nav>
      )}

      {/* 5. Minimalist Footer: Plain factual statement */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <span>Platform Penyaluran Zakat Produktif BAZNAS · Kerangka Kerja 6M</span>
          <span className="text-slate-400 font-mono">v1.0 (Interactive Prototype)</span>
        </div>
      </footer>
    </div>
  );
};
