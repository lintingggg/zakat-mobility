'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MovingUpView: React.FC = () => {
  const {
    independenceIndicators,
    isFullyGraduated,
    simulateFullGraduation,
    setMustahikTab,
  } = useApp();

  const metCount = independenceIndicators.filter(i => i.isMet).length;

  useEffect(() => {
    if (metCount >= 5) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  }, [metCount]);

  return (
    <div className="space-y-6 taste-enter">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">6M: Moving Up (Kemandirian)</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Evaluasi 6 indikator objektif kemandirian ekonomi penerima manfaat zakat produktif.
          </p>
        </div>
        <button
          onClick={() => setMustahikTab('beranda')}
          className="taste-btn px-3 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Responsive Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column (7 cols): 6 Indikator List */}
        <div className="md:col-span-7 space-y-4">
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Matriks 6 Indikator Kemandirian Usaha
              </h3>
              <span className="text-xs font-mono text-slate-500 font-medium">
                Standar Kelulusan BAZNAS
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {independenceIndicators.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.isMet
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      {item.isMet ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 text-[10px] font-mono font-bold">
                          {idx + 1}
                        </div>
                      )}
                      <div>
                        <h4 className={`text-xs font-bold ${item.isMet ? 'text-emerald-950' : 'text-slate-900'}`}>
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">Target: {item.targetValue}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold ${item.isMet ? 'text-emerald-800' : 'text-slate-600'}`}>
                        {item.currentValue}
                      </span>
                      <span className={`block text-[9px] font-semibold ${item.isMet ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {item.isMet ? 'Terpenuhi ✓' : 'Belum Lolos'}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar per indicator */}
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.isMet ? 'bg-emerald-700' : 'bg-slate-400'
                      }`}
                      style={{ width: `${item.percentageProgress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Jalur Kemandirian & Status */}
        <div className="md:col-span-5 space-y-4">
          {/* Header Card Kemandirian */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900 block">Status Kemandirian</span>
              <span className="text-xs text-slate-500">
                {metCount} dari 6 tolok ukur terpenuhi
              </span>
            </div>
            <div className={`px-3 py-1.5 rounded-xl font-mono font-extrabold text-sm border ${
              metCount >= 5
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {metCount} / 6
            </div>
          </div>

          {/* Jalur Kemandirian Card: Primary Dark Green #1A4331 per Guideline */}
          <div className={`taste-card rounded-3xl p-6 border transition-all ${
            metCount >= 5
              ? 'bg-[#1A4331] text-white border-[#1A4331] shadow-md'
              : 'bg-white border-slate-200 text-[#111827] shadow-xs'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              metCount >= 5 ? 'text-[#A3B8AD] font-mono' : 'text-[#6B7280]'
            }`}>
              Status Kelulusan 6M
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs ${metCount >= 5 ? 'text-[#A3B8AD]' : 'text-[#6B7280]'}`}>
                Klasifikasi:
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                metCount >= 5
                  ? 'bg-white/20 text-white border-white/30 font-mono'
                  : 'bg-[#E8F3ED] text-[#277A4D] border-[#277A4D]/30'
              }`}>
                {metCount >= 5 ? 'Mandiri (Muzakki Baru)' : 'Mustahik Binaan Aktif'}
              </span>
            </div>

            <p className={`text-xs leading-relaxed ${
              metCount >= 5 ? 'text-[#E8F3ED]' : 'text-[#6B7280]'
            }`}>
              {metCount >= 5
                ? 'Alhamdulillah! Usaha binaan telah memenuhi tolok ukur kemandirian ekonomi zakat produktif. Pendapatan usaha melampaui nishab dan binaan resmi lulus dari penerima zakat menjadi Muzakki.'
                : 'Pendampingan berlanjut: Pembinaan keuangan dan fasilitasi akses pasar oleh amil BAZNAS tetap berlangsung hingga 6 indikator tercapai.'}
            </p>

            {metCount < 5 && (
              <div className="pt-4 mt-3 border-t border-slate-100">
                <button
                  onClick={simulateFullGraduation}
                  className="btn-secondary w-full text-xs bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Simulasi Mandiri (Loloskan 6/6)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
