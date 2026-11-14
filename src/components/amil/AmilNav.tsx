'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { LayoutDashboard, Inbox, CheckSquare, Settings } from 'lucide-react';

interface NavItem {
  id: 'dasbor' | 'pengajuan' | 'verifikasi' | 'akun';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const AmilNav: React.FC = () => {
  const { amilTab, setAmilTab, evidenceQueue } = useApp();

  const pendingCount = evidenceQueue.filter(e => e.status === 'menunggu').length;

  const navItems: NavItem[] = [
    { id: 'dasbor', label: 'Dasbor', icon: LayoutDashboard },
    { id: 'pengajuan', label: 'Pengajuan', icon: Inbox },
    { id: 'verifikasi', label: 'Verifikasi', icon: CheckSquare, badge: pendingCount },
    { id: 'akun', label: 'Akun', icon: Settings },
  ];

  return (
    <nav className="fixed sm:absolute bottom-0 left-0 right-0 max-w-[425px] mx-auto bg-white border-t border-slate-200 px-3 py-2 z-30 shadow-lg">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = amilTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAmilTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors relative ${
                isActive
                  ? 'text-teal-800 font-semibold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
