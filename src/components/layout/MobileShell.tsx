'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const { isMobileFrame } = useApp();

  return (
    <div className={`min-h-[calc(100vh-41px)] bg-slate-900/95 flex justify-center items-start ${isMobileFrame ? 'p-0 sm:py-6 sm:px-4' : 'p-0'}`}>
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[425px] sm:rounded-[40px] sm:border-[10px] sm:border-slate-800 sm:shadow-2xl overflow-hidden bg-slate-50 min-h-screen sm:min-h-[850px] relative'
            : 'max-w-4xl bg-slate-50 min-h-screen shadow-lg'
        }`}
      >
        {/* Mobile Phone Top Notch / Status Bar */}
        {isMobileFrame && (
          <div className="bg-slate-900 text-slate-300 text-[11px] px-6 pt-2 pb-1.5 flex justify-between items-center sm:rounded-t-[30px] select-none sticky top-0 z-40">
            <span className="font-semibold text-white tracking-tight">09:41</span>
            
            {/* Notch Camera pill */}
            <div className="hidden sm:block w-20 h-4 bg-black rounded-full" />

            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="min-h-full pb-16 flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
};
