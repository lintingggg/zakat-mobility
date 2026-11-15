'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ChevronDown, Check } from 'lucide-react';
import { MappingView } from './MappingView';
import { MatchingView } from './MatchingView';
import { MentoringView } from './MentoringView';
import { MarketView } from './MarketView';
import { MonitoringView } from './MonitoringView';
import { MovingUpView } from './MovingUpView';

export const Program6MView: React.FC = () => {
  const { current6MStep, setCurrent6MStep } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const steps = [
    { num: 1, label: '1M: Mapping', desc: 'Pemetaan Usaha, Skor & Dokumen' },
    { num: 2, label: '2M: Matching', desc: 'Alokasi Bantuan Modal & Mesin' },
    { num: 3, label: '3M: Mentoring', desc: 'Pelatihan Usaha & Pembukuan' },
    { num: 4, label: '4M: Market', desc: 'Jejaring & Saluran Pemasaran' },
    { num: 5, label: '5M: Monitoring', desc: 'Pencatatan Omzet Bulanan' },
    { num: 6, label: '6M: Moving Up', desc: 'Indikator Kelulusan Mandiri' },
  ];

  const currentStep = steps.find(s => s.num === current6MStep) || steps[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6 taste-enter">
      {/* 6M Dropdown Selector (Anti-slop Clean Dropdown) */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full taste-card bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-left hover:border-[#1A4331]/40 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#1A4331] text-white flex items-center justify-center shrink-0 font-mono text-xs font-bold shadow-2xs">
              {currentStep.num}M
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#277A4D] font-bold block">
                Tahapan Program 6M
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#111827] truncate">
                  {currentStep.label}
                </span>
                <span className="hidden sm:inline text-xs text-[#6B7280] truncate">
                  · {currentStep.desc}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">Pilih Tahap</span>
            <div className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 transition-transform ${isOpen ? 'rotate-180 bg-[#E8F3ED] text-[#1A4331]' : 'group-hover:bg-slate-200'}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Dropdown Menu Popover */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-lg p-2 z-30 space-y-1 taste-enter">
            <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pilih Tahapan Pemberdayaan
              </span>
              <span className="text-[11px] font-mono text-[#277A4D] font-bold">
                {current6MStep} / 6
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
              {steps.map(s => {
                const isSelected = s.num === current6MStep;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      setCurrent6MStep(s.num);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-[#1A4331] text-white shadow-2xs font-semibold'
                        : 'hover:bg-[#F8F9FA] text-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-6 h-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s.num}M
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">
                          {s.label}
                        </span>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-white/80' : 'text-[#6B7280]'}`}>
                          {s.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-emerald-300" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
