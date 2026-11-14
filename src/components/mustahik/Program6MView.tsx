'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { MappingView } from './MappingView';
import { MatchingView } from './MatchingView';
import { MentoringView } from './MentoringView';
import { MarketView } from './MarketView';
import { MonitoringView } from './MonitoringView';
import { MovingUpView } from './MovingUpView';

export const Program6MView: React.FC = () => {
  const { current6MStep, setCurrent6MStep } = useApp();

  const steps = [
    { num: 1, label: 'Mapping', short: '1M', desc: 'Pemetaan' },
    { num: 2, label: 'Matching', short: '2M', desc: 'Paket Modal' },
    { num: 3, label: 'Mentoring', short: '3M', desc: 'Pelatihan' },
    { num: 4, label: 'Market', short: '4M', desc: 'Saluran' },
    { num: 5, label: 'Monitoring', short: '5M', desc: 'Pencatatan' },
    { num: 6, label: 'Moving Up', short: '6M', desc: 'Kemandirian' },
  ];

  return (
    <div className="space-y-6 taste-enter">
      {/* 6M Horizontal Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {steps.map(s => {
            const isActive = current6MStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrent6MStep(s.num)}
                className={`taste-btn px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  isActive ? 'bg-slate-800 text-emerald-300' : 'bg-slate-200 text-slate-600'
                }`}>
                  {s.short}
                </span>
                <span>{s.label}</span>
                <span className={`hidden lg:inline text-[10px] font-normal opacity-70 ${
                  isActive ? 'text-slate-300' : 'text-slate-400'
                }`}>
                  · {s.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Subview */}
      <div>
        {current6MStep === 1 && <MappingView />}
        {current6MStep === 2 && <MatchingView />}
        {current6MStep === 3 && <MentoringView />}
        {current6MStep === 4 && <MarketView />}
        {current6MStep === 5 && <MonitoringView />}
        {current6MStep === 6 && <MovingUpView />}
      </div>
    </div>
  );
};
