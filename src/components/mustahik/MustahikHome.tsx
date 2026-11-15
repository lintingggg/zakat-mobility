'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  FileText, 
  Compass, 
  ArrowRight, 
  ArrowUpRight,
  Check,
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  Award
} from 'lucide-react';

export const MustahikHome: React.FC = () => {
  const { 
    currentUser,
    businessProfile, 
    setMustahikTab, 
    setCurrent6MStep, 
    applicationStep,
    current6MStep,
    submissionStatus,
    documents,
    mentoringModules,
    marketChannels,
    monthlyReports,
    independenceIndicators,
    isFullyGraduated,
  } = useApp();

  const isDraft = submissionStatus === 'draft' || !businessProfile.businessName || businessProfile.businessName.trim() === '';
  const isApproved = applicationStep >= 3;
  const isDisbursed = applicationStep === 4;

  const verifiedModulesCount = mentoringModules.filter(m => m.status === 'terverifikasi').length;
  const mentoringPercent = mentoringModules.length > 0 ? Math.round((verifiedModulesCount / mentoringModules.length) * 100) : 0;
  const activeChannelsCount = marketChannels.filter(c => c.status === 'terverifikasi').length;
  const recordedMonthsCount = monthlyReports.filter(r => r.status === 'terverifikasi').length;
  const metIndicators = independenceIndicators.filter(i => i.isMet).length;

  // Hitung tahapan 6M yang sedang aktif & menjadi langkah selanjutnya
  let currentActiveStep = 1;
  if (isDraft) {
    currentActiveStep = 1;
  } else if (!isApproved && !isDisbursed) {
    currentActiveStep = 2; // Tahap 1 (Mapping) sudah terisi/diajukan, langkah selanjutnya adalah 2M Matching
  } else if (mentoringPercent < 80) {
    currentActiveStep = 3; // Tahap 2 (Matching) sudah disetujui, langkah selanjutnya 3M Mentoring
  } else if (activeChannelsCount < 3) {
    currentActiveStep = 4; // Tahap 3 (Mentoring) selesai, langkah selanjutnya 4M Market
  } else if (recordedMonthsCount < 3) {
    currentActiveStep = 5; // Tahap 4 (Market) selesai, langkah selanjutnya 5M Monitoring
  } else {
    currentActiveStep = 6; // Tahap 5 selesai, langkah selanjutnya 6M Moving Up
  }

  const handleOpen6M = (stepNumber: number) => {
    setCurrent6MStep(stepNumber);
    setMustahikTab('6m');
  };

  const nextStepConfigs = {
    1: {
      tag: 'Langkah Awal',
      title: 'Mulai 1M: Mapping (Pemetaan Usaha)',
      desc: 'Isi profil usaha, 5 indikator aspek kelayakan, dan unggah berkas persyaratan awal untuk diverifikasi.',
      btnText: 'Mulai Isi Profil',
    },
    2: {
      tag: 'Langkah Selanjutnya',
      title: 'Lanjutkan ke 2M: Matching (Paket Bantuan Modal)',
      desc: 'Cek alokasi bantuan alat produksi, modal bahan baku, dan pantau proses persetujuan SK BAZNAS.',
      btnText: 'Lanjutkan ke 2M',
    },
    3: {
      tag: 'Langkah Selanjutnya',
      title: 'Lanjutkan ke 3M: Mentoring (Modul Bisnis)',
      desc: 'Pelajari 6 modul pembukuan & standardisasi usaha serta unggah tugas praktik binaan.',
      btnText: 'Lanjutkan ke 3M',
    },
    4: {
      tag: 'Langkah Selanjutnya',
      title: 'Lanjutkan ke 4M: Market (Jejaring Pasar)',
      desc: 'Buka dan daftarkan minimal 3 saluran penjualan offline maupun online (toko lokal, medsos, reseller).',
      btnText: 'Lanjutkan ke 4M',
    },
    5: {
      tag: 'Langkah Selanjutnya',
      title: 'Lanjutkan ke 5M: Monitoring (Laporan Omzet)',
      desc: 'Catat laporan keuangan bulanan dan lampirkan bukti nota transaksi secara tertib.',
      btnText: 'Lanjutkan ke 5M',
    },
    6: {
      tag: 'Langkah Akhir',
      title: 'Lanjutkan ke 6M: Moving Up (Kemandirian)',
      desc: 'Pantau pemenuhan 6 indikator kemandirian ekonomi untuk kelulusan menjadi muzakki berdaya.',
      btnText: 'Lanjutkan ke 6M',
    },
  };

  const activeConfig = nextStepConfigs[currentActiveStep as keyof typeof nextStepConfigs];

  return (
    <div className="space-y-5 taste-enter">
      {/* 1. Profil Ringkas Mustahik */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            {currentUser?.name || businessProfile.name}
          </h1>
          <p className="text-xs text-[#6B7280]">
            {businessProfile.businessName 
              ? `${businessProfile.businessName} · ${businessProfile.address || 'Lokasi usaha'}` 
              : 'Profil usaha belum dilengkapi · Silakan isi di menu 1M Mapping'}
          </p>
        </div>
        {isApproved && (
          <span className="pill-verified">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mustahik BAZNAS</span>
          </span>
        )}
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
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1 font-mono">
              Rp {isDraft ? '0' : isDisbursed || isApproved ? '7.000.000' : '3.500.000'}
            </div>
            {isDraft && (
              <span className="text-[10px] text-[#A3B8AD] mt-1 block">
                Ajukan formulir 1M Mapping untuk verifikasi bantuan modal
              </span>
            )}
          </div>

          {(isDisbursed || isApproved || submissionStatus === 'dibatalkan') && (
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
              isDisbursed
                ? 'bg-[#277A4D]/30 text-[#E8F3ED] border-[#277A4D]'
                : isApproved
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400'
                : 'bg-red-500/20 text-red-200 border-red-400'
            }`}>
              {isDisbursed 
                ? 'Dana Disalurkan' 
                : isApproved 
                ? 'Disetujui BAZNAS' 
                : 'Dibatalkan'}
            </span>
          )}
        </div>

        {/* 6M Progress Bar inside Dark Card */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A3B8AD]">Tahapan Program 6M</span>
            <span className="font-bold text-white font-mono">
              {isDraft ? '0 dari 6 Tahap' : `Tahap ${currentActiveStep} dari 6`}
            </span>
          </div>
          
          <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#277A4D] h-full rounded-full transition-all duration-500"
              style={{ width: isDraft ? '0%' : `${Math.round((currentActiveStep / 6) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#A3B8AD] pt-1">
            {isDraft ? (
              <span>Lengkapi profil dan pemetaan usaha Anda di tahap <strong>1M: Mapping</strong></span>
            ) : (
              <>
                Skor Potensi Usaha: <strong className="text-white">{businessProfile.calculatedScore}%</strong> · {
                  businessProfile.calculatedScore >= 75 
                    ? 'Sangat Layak' 
                    : businessProfile.calculatedScore >= 50 
                    ? 'Layak Binaan' 
                    : 'Perlu Pendampingan'
                }
              </>
            )}
          </p>
        </div>
      </div>

      {/* 3. Next Step Banner (Guideline 5: Banner info tahap selanjutnya - Dinamis sesuai langkah aktif) */}
      <div className="taste-card bg-[#E8F3ED] border border-[#277A4D]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1A4331] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#277A4D] tracking-wider">
              {activeConfig.tag}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#111827]">
              {activeConfig.title}
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {activeConfig.desc}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpen6M(currentActiveStep)}
          className="btn-primary text-xs shrink-0 self-end sm:self-center"
        >
          <span>{activeConfig.btnText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Quick Action Tabs to 6M (Anti-slop Tasteful UI) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#111827]">
              Progres 6M Pemberdayaan
            </h2>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              Alur bertahap pemetaan hingga kemandirian ekonomi binaan.
            </p>
          </div>
          <button
            onClick={() => setMustahikTab('6m')}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-[#1A4331] text-slate-700 hover:text-white flex items-center justify-center transition-all group shrink-0 shadow-2xs"
            title="Buka Detail Program 6M"
            aria-label="Buka Detail Program 6M"
          >
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { 
              step: 1, 
              title: '1M: Mapping', 
              desc: 'Pemetaan profil & skor', 
              status: isDraft ? 'Belum Diisi' : 'Selesai' 
            },
            { 
              step: 2, 
              title: '2M: Matching', 
              desc: 'Paket modal & alat', 
              status: isDraft ? 'Terkunci' : isApproved ? 'Selesai' : 'Aktif' 
            },
            { 
              step: 3, 
              title: '3M: Mentoring', 
              desc: '6 Modul pembukuan', 
              status: isDraft || !isApproved ? 'Terkunci' : mentoringPercent >= 80 ? 'Selesai' : 'Aktif' 
            },
            { 
              step: 4, 
              title: '4M: Market', 
              desc: 'Toko & jejaring pasar', 
              status: isDraft || !isApproved ? 'Terkunci' : activeChannelsCount >= 3 ? 'Selesai' : mentoringPercent >= 80 ? 'Aktif' : 'Menunggu' 
            },
            { 
              step: 5, 
              title: '5M: Monitoring', 
              desc: 'Laporan omzet bulanan', 
              status: isDraft || !isApproved ? 'Terkunci' : recordedMonthsCount >= 3 ? 'Selesai' : activeChannelsCount >= 3 ? 'Rutin' : 'Menunggu' 
            },
            { 
              step: 6, 
              title: '6M: Moving Up', 
              desc: `${metIndicators}/6 Tolok ukur mandiri`, 
              status: isDraft || !isApproved ? 'Terkunci' : isFullyGraduated ? 'Lulus' : 'Target' 
            },
          ].map(m => {
            const isCardActive = m.status === 'Aktif' || m.status === 'Rutin';
            const isCardDone = m.status === 'Selesai' || m.status === 'Lulus';
            const isCardLocked = m.status === 'Terkunci' || m.status === 'Menunggu' || m.status === 'Belum Diisi';

            return (
              <button
                key={m.step}
                onClick={() => handleOpen6M(m.step)}
                className={`taste-card text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-[110px] ${
                  isCardActive
                    ? 'bg-white border-[#1A4331] ring-1 ring-[#1A4331]/10 shadow-xs'
                    : isCardDone
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-slate-50/60 border-slate-200/60 opacity-60 hover:opacity-85'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-[#1A4331] block font-mono">
                    Tahap {m.step}
                  </span>
                  <span className="text-xs font-bold text-[#111827] block mt-0.5">
                    {m.title}
                  </span>
                  <span className="text-[10px] text-[#6B7280] block mt-0.5 line-clamp-1">
                    {m.desc}
                  </span>
                </div>
                
                <div className="pt-2.5">
                  {isCardDone ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A4331]">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Selesai</span>
                    </span>
                  ) : isCardActive ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#111827]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A4331] animate-pulse" />
                      <span>Sedang Berjalan</span>
                    </span>
                  ) : m.status === 'Target' ? (
                    <span className="text-[11px] font-medium text-slate-500">
                      Target Akhir
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400">
                      Terkunci
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. List Section: Dokumen Legalitas & Usaha (Guideline 5: Clean Editorial List) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-bold text-[#111827]">
              Dokumen Verifikasi Legalitas
            </h2>
            <p className="text-[11px] text-[#6B7280]">
              Berkas fisik diperiksa oleh Amil BAZNAS sebelum pencairan bantuan.
            </p>
          </div>
          <button
            onClick={() => handleOpen6M(1)}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-[#1A4331] text-slate-700 hover:text-white flex items-center justify-center transition-all group shrink-0 shadow-2xs"
            title="Kelola Dokumen di 1M Mapping"
            aria-label="Kelola Dokumen di 1M Mapping"
          >
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="space-y-2">
          {documents.map(doc => {
            const isDocVerified = doc.status === 'terverifikasi';
            const isDocWaiting = doc.status === 'menunggu' && doc.filename;

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
                      {doc.filename ? `${doc.filename} · ${doc.notes}` : `Belum diunggah · ${doc.notes}`}
                    </span>
                  </div>
                </div>

                <div>
                  {isDocVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A4331]">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Terverifikasi</span>
                    </span>
                  ) : isDocWaiting ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sedang Ditinjau</span>
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-slate-400">
                      Belum Diunggah
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
