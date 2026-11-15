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
      <div className="bg-white rounded-full p-1.5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-1">
          {steps.map(s => {
            const isActive = current6MStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrent6MStep(s.num)}
                className={`taste-btn px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1A4331] text-white shadow-2xs font-bold'
                    : 'bg-[#F8F9FA] text-[#6B7280] hover:bg-[#E8F3ED] hover:text-[#1A4331]'
                }`}
              >
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-[#6B7280]'
                }`}>
                  {s.short}
                </span>
                <span>{s.label}</span>
                <span className={`hidden lg:inline text-[10px] font-normal opacity-80 ${
                  isActive ? 'text-[#A3B8AD]' : 'text-[#6B7280]'
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
