'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  FileText, 
  GraduationCap, 
  BarChart2, 
  ShoppingBag, 
  Clock, 
  Calendar, 
  ChevronRight,
  ArrowRight,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const MustahikHome: React.FC = () => {
  const { 
    businessProfile, 
    setMustahikTab, 
    setCurrent6MStep, 
    applicationStep,
    evidenceQueue,
    isEnrolledTraining,
    toggleTrainingEnrollment
  } = useApp();

  const isApproved = applicationStep >= 3;
  const isDisbursed = applicationStep === 4;

  const pendingEvidenceCount = evidenceQueue.filter(
    e => e.applicantName === 'Faizah E.' && e.status === 'menunggu'
  ).length;

  const handleOpen6M = (stepNumber: number) => {
    setCurrent6MStep(stepNumber);
    setMustahikTab('6m');
  };

  return (
    <div className="space-y-6 taste-enter">
      {/* 1. Header: Plain Factual Statement */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {businessProfile.name}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Usaha: <strong>{businessProfile.businessName}</strong> · {businessProfile.address}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Mustahik Terdaftar
          </span>
        </div>
      </div>

      {/* 2. Responsive 2-Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column (7 cols): Financial status, Stepper & Quick Action */}
        <div className="md:col-span-7 space-y-5">
          {/* Main Status Panel: Architectural Solid Dark Card (Anti-slop) */}
          <div className="taste-card bg-slate-900 text-white rounded-2xl p-5 md:p-6 border border-slate-800">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Alokasi Zakat Produktif
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                isDisbursed
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : isApproved
                  ? 'bg-teal-950 text-teal-300 border-teal-800'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {isDisbursed ? 'Disalurkan' : isApproved ? 'Disetujui' : 'Diajukan'}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Rp {isDisbursed ? '7.000.000' : isApproved ? '7.000.000' : '0'}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              {isDisbursed 
                ? 'Paket mesin perontok jagung dan modal operasional 3 bulan telah diserahterimakan.'
                : isApproved
                ? 'SK bantuan modal telah disetujui BAZNAS. Menunggu jadwal pengadaan alat mesin.'
                : 'Berkas profil usaha dan kelayakan 5 aspek sedang ditinjau amil verifikator.'}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Rencana: Mesin Pipil Jagung & Modal Bahan</span>
              <button
                onClick={() => setMustahikTab('dana')}
                className="taste-btn font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Rincian Dana <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper Card */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-xs sm:text-sm">Progres Intervensi 6M</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tahap saat ini: <strong className="text-slate-900">2M Matching</strong> (Alokasi Paket Modal & Mesin)
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                1 / 6 Selesai
              </span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
              <div className="bg-emerald-700 h-full w-1/6" />
              <div className="bg-emerald-400 h-full w-1/6" />
              <div className="bg-slate-200 h-full w-4/6" />
            </div>

            <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono pt-1">
              <span className="text-emerald-800 font-bold">1M Mapping ✓</span>
              <span className="text-slate-900 font-bold">2M Matching</span>
              <span>3M Mentoring</span>
              <span>4M Market</span>
              <span>5M Monitoring</span>
              <span>6M Moving Up</span>
            </div>

            <button
              onClick={() => handleOpen6M(2)}
              className="taste-btn w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs"
            >
              Buka Tahap 2M: Matching
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Menu Cepat */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pintasan Modul 6M
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { step: 1, label: 'Mapping', sub: 'Pemetaan', icon: FileText },
                { step: 3, label: 'Mentoring', sub: 'Pelatihan', icon: GraduationCap },
                { step: 5, label: 'Monitoring', sub: 'Lapor Omzet', icon: BarChart2 },
                { step: 4, label: 'Market', sub: 'Kanal Pasar', icon: ShoppingBag },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.step}
                    onClick={() => handleOpen6M(item.step)}
                    className="taste-card taste-btn flex flex-col items-start p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-left"
                  >
                    <Icon className="w-4 h-4 text-emerald-800 mb-2" />
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    <span className="text-[10px] text-slate-500">{item.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Real Agenda & Verifikasi Status */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Agenda & Catatan Sistem
            </h3>

            {/* Notification 1 */}
            <div 
              onClick={() => handleOpen6M(1)}
              className="taste-card p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">
                  {pendingEvidenceCount > 0 ? `${pendingEvidenceCount} Berkas Menunggu Verifikasi` : 'Semua Berkas Terverifikasi'}
                </span>
                <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-semibold">
                  Dalam Review
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Dokumen SKTM dan foto tempat usaha sedang ditinjau amil BAZNAS.
              </p>
            </div>

            {/* Notification 2 */}
            <div className="taste-card p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Webinar Terdekat</span>
                <button
                  onClick={toggleTrainingEnrollment}
                  className={`taste-btn text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
                    isEnrolledTraining 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                >
                  {isEnrolledTraining ? 'Terdaftar ✓' : 'Daftar'}
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-800">
                Pemasaran Digital untuk Usaha Mikro
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sabtu, 10.00 WIB · Daring via Zoom
              </p>
            </div>

            {/* Notification 3 */}
            <div 
              onClick={() => handleOpen6M(5)}
              className="taste-card p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white cursor-pointer"
            >
              <h4 className="text-xs font-bold text-slate-900">Laporan Keuangan Bulanan</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Input omzet penjualan dan biaya operasional sebelum tanggal 5 tiap bulan.
              </p>
            </div>
          </div>

          {/* Institutional Partner Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs space-y-1.5">
            <span className="text-slate-500 font-semibold text-[11px] block uppercase tracking-wider">
              Lembaga Penyelenggara
            </span>
            <p className="font-bold text-slate-900">BAZNAS Kabupaten Malang</p>
            <p className="text-[11px] text-slate-500">
              Petugas Pendamping Lapangan: Ustadz Hilman Ramadhan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
