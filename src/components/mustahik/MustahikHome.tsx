'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  FileText, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  Award
} from 'lucide-react';

export const MustahikHome: React.FC = () => {
  const { 
    businessProfile, 
    setMustahikTab, 
    setCurrent6MStep, 
    applicationStep,
    current6MStep,
    submissionStatus,
    documents,
    independenceIndicators
  } = useApp();

  const isApproved = applicationStep >= 3;
  const isDisbursed = applicationStep === 4;

  const handleOpen6M = (stepNumber: number) => {
    setCurrent6MStep(stepNumber);
    setMustahikTab('6m');
  };

  // Next step calculation
  const nextStepLabel = current6MStep === 1 
    ? '2M: Matching (Paket Bantuan)' 
    : current6MStep === 2 
    ? '3M: Mentoring (Modul Bisnis)' 
    : current6MStep === 3 
    ? '4M: Market (Jejaring Pasar)' 
    : current6MStep === 4 
    ? '5M: Monitoring (Laporan Omzet)' 
    : '6M: Moving Up (Kemandirian)';

  const metIndicators = independenceIndicators.filter(i => i.isMet).length;

  return (
    <div className="space-y-5 taste-enter">
      {/* 1. Profil Ringkas Mustahik */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            {businessProfile.name}
          </h1>
          <p className="text-xs text-[#6B7280]">
            {businessProfile.businessName} · {businessProfile.address}
          </p>
        </div>
        <span className="pill-verified">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Mustahik BAZNAS</span>
        </span>
      </div>

      {/* 2. Main Status & Fund Card (Guideline 4: Background `#1A4331`, `rounded-3xl`, Text `#FFFFFF` & `#A3B8AD`) */}
      <div className="taste-card bg-[#1A4331] text-white rounded-3xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[11px] font-semibold text-[#A3B8AD] uppercase tracking-wider block">
              Total Dana Zakat Produktif
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
              Rp {isDisbursed ? '7.000.000' : isApproved ? '7.000.000' : '3.500.000'}
            </div>
          </div>

          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
            isDisbursed
              ? 'bg-[#277A4D]/30 text-[#E8F3ED] border-[#277A4D]'
              : isApproved
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400'
              : submissionStatus === 'dibatalkan'
              ? 'bg-red-500/20 text-red-200 border-red-400'
              : 'bg-amber-400/20 text-amber-200 border-amber-300'
          }`}>
            {isDisbursed 
              ? 'Dana Disalurkan' 
              : isApproved 
              ? 'Disetujui BAZNAS' 
              : submissionStatus === 'dibatalkan'
              ? 'Dibatalkan'
              : 'Menunggu Verifikasi'}
          </span>
        </div>

        {/* 6M Progress Bar inside Dark Card */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A3B8AD]">Tahapan Program 6M</span>
            <span className="font-bold text-white font-mono">{current6MStep} dari 6 Tahap</span>
          </div>
          
          <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#277A4D] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round((current6MStep / 6) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#A3B8AD] pt-1">
            Skor Potensi Usaha: <strong className="text-white">{businessProfile.calculatedScore}%</strong> · {businessProfile.calculatedScore >= 75 ? 'Sangat Layak' : 'Layak Binaan'}
          </p>
        </div>
      </div>

      {/* 3. Next Step Banner (Guideline 5: Banner info tahap selanjutnya) */}
      <div className="taste-card bg-[#E8F3ED] border border-[#277A4D]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1A4331] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#277A4D] tracking-wider">
              Langkah Selanjutnya
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#111827]">
              Lanjutkan ke {nextStepLabel}
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Lengkapi berkas dan tugas untuk membuka paket intervensi berikutnya.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpen6M(current6MStep < 6 ? current6MStep + 1 : 6)}
          className="btn-primary text-xs shrink-0 self-start sm:self-center"
        >
          <span>Lanjutkan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Quick Action Tabs to 6M (Guideline 5: Program 6M Cards) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-[#111827]">
            Progres 6M Pemberdayaan
          </h2>
          <button
            onClick={() => setMustahikTab('6m')}
            className="text-xs font-semibold text-[#1A4331] hover:underline flex items-center gap-1"
          >
            <span>Buka Detail 6M</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { step: 1, title: '1M: Mapping', desc: 'Pemetaan profil & skor', status: 'Selesai' },
            { step: 2, title: '2M: Matching', desc: 'Paket modal & alat', status: isApproved ? 'Selesai' : 'Aktif' },
            { step: 3, title: '3M: Mentoring', desc: '6 Modul pembukuan', status: 'Aktif' },
            { step: 4, title: '4M: Market', desc: 'Toko & jejaring pasar', status: 'Aktif' },
            { step: 5, title: '5M: Monitoring', desc: 'Laporan omzet bulanan', status: 'Rutin' },
            { step: 6, title: '6M: Moving Up', desc: `${metIndicators}/6 Tolok ukur mandiri`, status: 'Target' },
          ].map(m => (
            <button
              key={m.step}
              onClick={() => handleOpen6M(m.step)}
              className="taste-card text-left p-3 rounded-xl border border-slate-200 bg-[#F8F9FA] hover:bg-[#E8F3ED] hover:border-[#1A4331]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#1A4331] block font-mono">
                  Tahap {m.step}
                </span>
                <span className="text-xs font-bold text-[#111827] block mt-0.5">
                  {m.title}
                </span>
                <span className="text-[10px] text-[#6B7280] block mt-0.5">
                  {m.desc}
                </span>
              </div>
              <div className="pt-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  m.status === 'Selesai' 
                    ? 'bg-[#E8F3ED] text-[#277A4D]' 
                    : 'bg-white text-[#6B7280] border border-slate-200'
                }`}>
                  {m.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. List Section: Dokumen Legalitas & Usaha (Guideline 5: List Dokumen & Status) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-bold text-[#111827]">
              Dokumen Verifikasi Legalitas
            </h2>
            <p className="text-[11px] text-[#6B7280]">
              Berkas fisik diperiksa oleh Amil BAZNAS sebelum pencairan.
            </p>
          </div>
          <button
            onClick={() => handleOpen6M(1)}
            className="btn-secondary text-[11px] py-1.5 px-3"
          >
            Kelola Dokumen
          </button>
        </div>

        <div className="space-y-2">
          {documents.map(doc => {
            const isDocVerified = doc.status === 'terverifikasi';

            return (
              <div
                key={doc.id}
                className="p-3 rounded-xl border border-slate-200 bg-[#F8F9FA] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#1A4331] shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      {doc.name}
                    </span>
                    <span className="text-[10px] text-[#6B7280] block">
                      {doc.filename} · {doc.notes}
                    </span>
                  </div>
                </div>

                <span className={isDocVerified ? 'pill-verified' : 'pill-waiting'}>
                  {isDocVerified ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Terverifikasi</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      <span>Menunggu</span>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
