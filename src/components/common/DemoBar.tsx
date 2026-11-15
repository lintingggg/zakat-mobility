'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { RefreshCw, Smartphone, Monitor, Award, UserCheck } from 'lucide-react';

export const DemoBar: React.FC = () => {
  const {
    role,
    setRole,
    resetAllMockData,
    simulateFullGraduation,
    isMobileFrame,
    setIsMobileFrame,
    isLoggedIn,
  } = useApp();

  return (
    <header className="bg-slate-900 text-white text-xs border-b border-slate-800 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Product badge */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wide text-emerald-400">ZAKAT MOBILITY</span>
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded text-[10px] font-medium hidden sm:inline">
            Interactive Prototype 6M
          </span>
        </div>

        {/* Center: Role Switcher */}
        {isLoggedIn && (
          <nav aria-label="Peralihan Peran Demo" className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 px-2 text-[11px] font-medium hidden md:inline">Peran:</span>
            <button
              onClick={() => setRole('mustahik')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                role === 'mustahik'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Mustahik
            </button>
            <button
              onClick={() => setRole('amil')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                role === 'amil'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Amil (Verifikator)
            </button>
            <button
              onClick={() => setRole('muzakki')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                role === 'muzakki'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Muzakki
            </button>
          </nav>
        )}

        {/* Right: Simulation & Layout controls */}
        <div className="flex items-center gap-1.5">
          {isLoggedIn && (
            <>
              <button
                onClick={simulateFullGraduation}
                title="Otomatis loloskan semua indikator untuk melihat kelulusan kemandirian (Moving Up)"
                className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-1 rounded text-[11px] font-medium transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Simulasi Mandiri (6/6)</span>
                <span className="lg:hidden">6/6</span>
              </button>

              <button
                onClick={resetAllMockData}
                title="Kembalikan data ke kondisi awal"
                className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-[11px] border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </>
          )}

          {/* Device Frame Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? 'Ganti ke Layar Penuh' : 'Ganti ke Frame Smartphone'}
            className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-[11px] border border-slate-700 transition-colors"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">HP Frame</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
