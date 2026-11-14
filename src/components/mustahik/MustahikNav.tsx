'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Home, Compass, Wallet, User } from 'lucide-react';

export const MustahikNav: React.FC = () => {
  const { mustahikTab, setMustahikTab } = useApp();

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: '6m', label: 'Program 6M', icon: Compass },
    { id: 'dana', label: 'Dana', icon: Wallet },
    { id: 'profil', label: 'Profil', icon: User },
  ] as const;

  return (
    <nav className="fixed sm:absolute bottom-0 left-0 right-0 max-w-[425px] mx-auto bg-white border-t border-slate-200 px-3 py-2 z-30 shadow-lg">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = mustahikTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setMustahikTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-800 font-semibold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
