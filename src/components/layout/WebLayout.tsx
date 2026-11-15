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
  LogOut,
  Bell
} from 'lucide-react';

interface WebLayoutProps {
  children: React.ReactNode;
}

export const WebLayout: React.FC<WebLayoutProps> = ({ children }) => {
  const {
    role,
    isLoggedIn,
    currentUser,
    logout,
    mustahikTab,
    setMustahikTab,
    amilTab,
    setAmilTab,
    evidenceQueue,
  } = useApp();

  const pendingCount = evidenceQueue.filter(e => e.status === 'menunggu').length;
  const displayName = currentUser?.name || (role === 'mustahik' ? 'Mustahik' : role === 'amil' ? 'Amil Verifikator' : 'Muzakki');

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col font-sans selection:bg-[#E8F3ED] selection:text-[#1A4331]">
      {/* 1. Minimalist Sticky Top Bar */}
      {isLoggedIn && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Left: Nama Lengkap Pengguna Saja */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1A4331] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-2xs">
                {displayName.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#111827] tracking-tight block">
                  {displayName}
                </span>
                <p className="text-[11px] text-[#6B7280] hidden sm:block">
                  Zakat Mobility · BAZNAS
                </p>
              </div>
            </div>

            {/* Right: Notification Bell & Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Desktop Tabs for Mustahik (Guideline 4 & 6.3) */}
              {role === 'mustahik' && (
                <nav className="hidden md:flex items-center gap-1.5 mr-2">
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
                        className={`taste-btn px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isActive
                            ? 'bg-[#1A4331] text-white shadow-2xs'
                            : 'text-[#6B7280] hover:text-[#111827] hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              )}

              {/* Bell Notification */}
              <button
                type="button"
                title="Notifikasi"
                className="taste-btn p-2 text-[#6B7280] hover:text-[#1A4331] rounded-full hover:bg-[#E8F3ED] transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F59E0B]" />
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                title="Keluar dari Akun"
                className="taste-btn p-2 text-[#6B7280] hover:text-[#D93A3A] rounded-full hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 2. Main Body with Desktop Adaptation (Guideline 6) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto">
        {/* Left Sidebar Navigation for Amil on Desktop (Guideline 6.1: Navigation Shift) */}
        {isLoggedIn && role === 'amil' && (
          <aside className="hidden md:flex flex-col w-56 border-r border-slate-200 bg-white py-6 px-4 shrink-0 space-y-1">
            <div className="px-3 pb-3 mb-2 border-b border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] font-bold">
                Menu Verifikator
              </span>
            </div>

            {[
              { id: 'dasbor', label: 'Dasbor Utama', icon: LayoutDashboard },
              { id: 'pengajuan', label: 'Antrean Masuk', icon: Inbox },
              { id: 'verifikasi', label: 'Verifikasi Berkas', icon: CheckSquare, badge: pendingCount },
              { id: 'akun', label: 'Akun Lembaga', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = amilTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setAmilTab(item.id as any)}
                  className={`taste-btn w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-[#1A4331] text-white shadow-2xs font-bold'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="bg-[#F59E0B] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </aside>
        )}

        {/* Content Area with Container Constriction for Mustahik (Guideline 6.3) */}
        <main
          className={`flex-1 w-full px-4 sm:px-6 py-6 pb-24 md:pb-10 taste-enter ${
            role === 'mustahik' && isLoggedIn
              ? 'max-w-2xl mx-auto' /* Guideline 6.3: Container Constriction center-aligned */
              : 'w-full'
          }`}
        >
          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Nav for Mustahik & Amil (Guideline 4: Active circle dark green `#1A4331`) */}
      {isLoggedIn && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-40 shadow-lg">
          {role === 'mustahik' && (
            <div className="grid grid-cols-4 gap-1 items-center">
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
                    className="taste-btn flex flex-col items-center justify-center py-1 transition-all"
                  >
                    {/* Active Icon has dark green circle background (#1A4331) per Guideline 4 */}
                    <div
                      className={`flex items-center justify-center transition-all ${
                        isActive
                          ? 'w-10 h-10 rounded-full bg-[#1A4331] text-white shadow-2xs mb-0.5'
                          : 'w-8 h-8 rounded-full text-[#6B7280]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] ${
                        isActive ? 'text-[#1A4331] font-bold' : 'text-[#6B7280]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {role === 'amil' && (
            <div className="grid grid-cols-4 gap-1 items-center">
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
                    className="taste-btn flex flex-col items-center justify-center py-1 transition-all"
                  >
                    <div
                      className={`flex items-center justify-center relative transition-all ${
                        isActive
                          ? 'w-10 h-10 rounded-full bg-[#1A4331] text-white shadow-2xs mb-0.5'
                          : 'w-8 h-8 rounded-full text-[#6B7280]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.badge && item.badge > 0 ? (
                        <span className="absolute -top-0.5 -right-0.5 bg-[#F59E0B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    <span
                      className={`text-[10px] ${
                        isActive ? 'text-[#1A4331] font-bold' : 'text-[#6B7280]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </nav>
      )}

      {/* 4. Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 text-xs text-[#6B7280] hidden md:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <span>Platform Zakat Mobility · Standar Desain Finansial BAZNAS</span>
          <span className="font-mono text-[11px] text-[#A3B8AD]">v1.2 (Interactive Behavioral Prototype)</span>
        </div>
      </footer>
    </div>
  );
};
