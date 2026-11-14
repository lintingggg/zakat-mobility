'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { HeartHandshake, ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';

export const MuzakkiPlaceholder: React.FC = () => {
  const { setRole } = useApp();

  return (
    <div className="max-w-2xl mx-auto space-y-6 my-6 taste-enter">
      <div className="flex items-center gap-2 pb-2">
        <button
          onClick={() => setRole('mustahik')}
          className="taste-btn px-3 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Alur Mustahik</span>
        </button>
      </div>

      <div className="taste-card bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto border border-slate-200">
          <HeartHandshake className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded">
            Fase 2 Pengembangan
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            Dasbor Transparansi Donatur (Muzakki)
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Pada versi rilis penuh, para Muzakki dapat memantau secara langsung dan transparan perkembangan usaha Mustahik yang didanai hingga mencapai garis kemandirian ekonomi.
        </p>

        {/* Sneak peek card: crisp facts without marketing fluff */}
        <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs max-w-md mx-auto">
          <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider border-b border-slate-200 pb-1.5">
            Portofolio Impak Binaan:
          </span>
          <div className="flex justify-between items-center text-slate-600">
            <span>Usaha yang Didanai:</span>
            <strong className="text-slate-900">Gerit Jagung Bu Faizah (Poncokusumo)</strong>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Status Intervensi 6M:</span>
            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Tahap 5M (Monitoring)
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Pertumbuhan Finansial:</span>
            <span className="font-mono font-extrabold text-slate-900 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +24% dalam 2 Bulan
            </span>
          </div>
        </div>

        <div className="pt-2 max-w-xs mx-auto">
          <button
            onClick={() => setRole('mustahik')}
            className="taste-btn w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Buka Alur Mustahik 6M</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
