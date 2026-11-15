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
  Award,
  Lock
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

  const isProfileComplete = Boolean(
    businessProfile.businessName && businessProfile.businessName.trim() !== '' &&
    businessProfile.businessType && businessProfile.businessType.trim() !== '' &&
    businessProfile.duration && businessProfile.duration.trim() !== '' &&
    businessProfile.monthlyRevenue > 0 &&
    businessProfile.address && businessProfile.address.trim() !== ''
  );
  const isDocumentsComplete = documents.length > 0 && documents.every(d => Boolean(d.filename && d.filename.trim() !== ''));

  const isStage1Approved = submissionStatus === 'disetujui' || applicationStep >= 3;
  const isStage1Submitted = submissionStatus === 'diajukan';
  const isDraft = submissionStatus === 'draft' || !isProfileComplete || !isDocumentsComplete;
  const isApproved = isStage1Approved;
  const isDisbursed = applicationStep === 4;

  const verifiedModulesCount = mentoringModules.filter(m => m.status === 'terverifikasi').length;
  const mentoringPercent = mentoringModules.length > 0 ? Math.round((verifiedModulesCount / mentoringModules.length) * 100) : 0;
  const activeChannelsCount = marketChannels.filter(c => c.status === 'terverifikasi').length;
  const recordedMonthsCount = monthlyReports.filter(r => r.status === 'terverifikasi').length;
  const metIndicators = independenceIndicators.filter(i => i.isMet).length;

  // Hitung tahapan 6M yang sedang aktif & menjadi langkah selanjutnya
  let currentActiveStep = 1;
  if (!isStage1Approved) {
    // Jika belum lolos tahap satu atau belum diverifikasi oleh amil/admin -> Tetap di Tahap 1
    currentActiveStep = 1;
  } else if (!isDisbursed && applicationStep < 4) {
    // Tahap 1 sudah disetujui, lanjut ke Tahap 2 Matching
    currentActiveStep = 2;
  } else if (mentoringPercent < 80) {
    currentActiveStep = 3;
  } else if (activeChannelsCount < 3) {
    currentActiveStep = 4;
  } else if (recordedMonthsCount < 3) {
    currentActiveStep = 5;
  } else {
    currentActiveStep = 6;
  }

  const handleOpen6M = (stepNumber: number) => {
    // Jika belum lolos tahap 1 dan mencoba membuka tahap > 1, arahkan ke tahap 1
    if (!isStage1Approved && stepNumber > 1) {
      setCurrent6MStep(1);
      setMustahikTab('6m');
      return;
    }
    setCurrent6MStep(stepNumber);
    setMustahikTab('6m');
  };

  const getStep1Config = () => {
    if (isStage1Submitted) {
      return {
        tag: 'Tahap 1 · Sedang Ditinjau',
        title: '1M: Mapping (Menunggu Verifikasi Amil)',
        desc: 'Berkas dan formulir usaha Anda sedang ditinjau oleh Amil BAZNAS. Tahap 2M Matching akan dibuka setelah disetujui.',
        btnText: 'Lihat Pengajuan 1M',
      };
    }
    if (submissionStatus === 'dibatalkan') {
      return {
        tag: 'Pengajuan Dibatalkan',
        title: '1M: Mapping (Pengajuan Dibatalkan)',
        desc: 'Pengajuan berkas Anda sebelumnya dibatalkan. Silakan tinjau kembali profil usaha dan ajukan ulang ke Amil BAZNAS.',
        btnText: 'Ajukan Ulang 1M',
      };
    }
    return {
      tag: 'Tahap 1 · Belum Lengkap',
      title: 'Lengkapi 1M: Mapping (Pemetaan Usaha)',
      desc: 'Lengkapi data usaha dan unggah seluruh berkas persyaratan legalitas agar dapat diverifikasi oleh Amil BAZNAS.',
      btnText: 'Lengkapi Berkas 1M',
    };
  };

  const nextStepConfigs = {
    1: getStep1Config(),
    2: {
      tag: 'Tahap 2 Terbuka',
      title: 'Lanjutkan ke 2M: Matching (Paket Bantuan Modal)',
      desc: 'Cek alokasi bantuan alat produksi, modal bahan baku, dan pantau proses persetujuan SK BAZNAS.',
      btnText: 'Buka Tahap 2M',
    },
    3: {
      tag: 'Tahap 3 Terbuka',
      title: 'Lanjutkan ke 3M: Mentoring (Modul Bisnis)',
      desc: 'Pelajari 6 modul pembukuan & standardisasi usaha serta unggah tugas praktik binaan.',
      btnText: 'Buka Tahap 3M',
    },
    4: {
      tag: 'Tahap 4 Terbuka',
      title: 'Lanjutkan ke 4M: Market (Jejaring Pasar)',
      desc: 'Buka dan daftarkan minimal 3 saluran penjualan offline maupun online (toko lokal, medsos, reseller).',
      btnText: 'Buka Tahap 4M',
    },
    5: {
      tag: 'Tahap 5 Terbuka',
      title: 'Lanjutkan ke 5M: Monitoring (Laporan Omzet)',
      desc: 'Catat laporan keuangan bulanan dan lampirkan bukti nota transaksi secara tertib.',
      btnText: 'Buka Tahap 5M',
    },
    6: {
      tag: 'Tahap Akhir',
      title: 'Lanjutkan ke 6M: Moving Up (Kemandirian)',
      desc: 'Pantau pemenuhan 6 indikator kemandirian ekonomi untuk kelulusan menjadi muzakki berdaya.',
      btnText: 'Buka Tahap 6M',
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
              Rp {isDisbursed || isApproved ? '7.000.000' : '0'}
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
            {isDraft || businessProfile.calculatedScore === 0 ? (
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
              desc: 'Pemetaan profil & berkas', 
              status: isStage1Approved 
                ? 'Selesai' 
                : isStage1Submitted 
                ? 'Menunggu Verifikasi' 
                : 'Belum Lengkap' 
            },
            { 
              step: 2, 
              title: '2M: Matching', 
              desc: 'Paket modal & alat', 
              status: !isStage1Approved 
                ? 'Terkunci' 
                : isDisbursed 
                ? 'Selesai' 
                : 'Aktif' 
            },
            { 
              step: 3, 
              title: '3M: Mentoring', 
              desc: '6 Modul pembukuan', 
              status: !isStage1Approved || !isDisbursed 
                ? 'Terkunci' 
                : mentoringPercent >= 80 
                ? 'Selesai' 
                : 'Aktif' 
            },
            { 
              step: 4, 
              title: '4M: Market', 
              desc: 'Toko & jejaring pasar', 
              status: !isStage1Approved || !isDisbursed || mentoringPercent < 80 
                ? 'Terkunci' 
                : activeChannelsCount >= 3 
                ? 'Selesai' 
                : 'Aktif' 
            },
            { 
              step: 5, 
              title: '5M: Monitoring', 
              desc: 'Laporan omzet bulanan', 
              status: !isStage1Approved || !isDisbursed || mentoringPercent < 80 || activeChannelsCount < 3 
                ? 'Terkunci' 
                : recordedMonthsCount >= 3 
                ? 'Selesai' 
                : 'Aktif' 
            },
            { 
              step: 6, 
              title: '6M: Moving Up', 
              desc: `${metIndicators}/6 Tolok ukur mandiri`, 
              status: !isStage1Approved || !isDisbursed || recordedMonthsCount < 3 
                ? 'Terkunci' 
                : isFullyGraduated 
                ? 'Lulus' 
                : 'Target' 
            },
          ].map(m => {
            const isCardActive = m.status === 'Aktif';
            const isCardDone = m.status === 'Selesai' || m.status === 'Lulus';
            const isCardWaiting = m.status === 'Menunggu Verifikasi';
            const isCardIncomplete = m.status === 'Belum Lengkap';
            const isCardLocked = m.status === 'Terkunci';

            return (
              <button
                key={m.step}
                onClick={() => handleOpen6M(m.step)}
                disabled={isCardLocked}
                className={`taste-card text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-[115px] ${
                  isCardActive
                    ? 'bg-white border-[#1A4331] ring-1 ring-[#1A4331]/10 shadow-xs'
                    : isCardDone
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    : isCardWaiting
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    : isCardIncomplete
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#1A4331] block font-mono">
                      Tahap {m.step}
                    </span>
                    {isCardLocked && (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
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
                      <span>{m.status === 'Lulus' ? 'Mandiri (Lulus)' : 'Selesai'}</span>
                    </span>
                  ) : isCardActive ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#111827]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A4331] animate-pulse" />
                      <span>Sedang Berjalan</span>
                    </span>
                  ) : isCardWaiting ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Menunggu Verifikasi</span>
                    </span>
                  ) : isCardIncomplete ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>Belum Lengkap</span>
                    </span>
                  ) : m.status === 'Target' ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <Award className="w-3 h-3 text-slate-400" />
                      <span>Target Akhir</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Terkunci</span>
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
