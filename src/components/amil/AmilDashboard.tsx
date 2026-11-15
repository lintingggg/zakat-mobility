'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowRight } from 'lucide-react';

export const AmilDashboard: React.FC = () => {
  const { setAmilTab, applicants, evidenceQueue } = useApp();

  const pendingEvidenceCount = evidenceQueue.filter(e => e.status === 'menunggu').length;
  const totalSubmissions = applicants.length;
  const pendingDecisions = applicants.filter(a => a.status === 'Baru').length;
  const approvedSubmissions = applicants.filter(a => a.status === 'Disetujui').length;
  const totalAllocated = approvedSubmissions * 3500000;
  const avgScore = applicants.length > 0
    ? Math.round(applicants.reduce((acc, a) => acc + (a.potentialScore || 0), 0) / applicants.length)
    : 0;

  return (
    <div className="space-y-6 taste-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dasbor Amil Verifikator
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Ringkasan pemantauan dan pengelolaan program pendayagunaan zakat produktif 6M.
          </p>
        </div>
        <span className="pill-verified self-start sm:self-auto">
          BAZNAS Kabupaten Malang
        </span>
      </div>

      {/* Banner Bukti Menunggu Verifikasi */}
      <div
        onClick={() => setAmilTab('verifikasi')}
        className="taste-card bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl flex items-center justify-between cursor-pointer shadow-xs hover:border-[#1A4331]"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#1A4331] text-white flex items-center justify-center font-mono font-extrabold text-sm shadow-2xs">
            {pendingEvidenceCount}
          </div>
          <div>
            <span className="text-sm font-bold text-[#111827] block">
              {pendingEvidenceCount} Berkas Menunggu Verifikasi Validitas
            </span>
            <span className="text-xs text-[#6B7280]">
              Dokumen SKTM, foto tempat usaha, dan laporan finansial bulanan mustahik.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A4331] shrink-0">
          <span className="hidden sm:inline">Buka Antrean</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setAmilTab('pengajuan')}
          className="taste-card bg-white p-4 rounded-2xl border border-slate-200 cursor-pointer space-y-1"
        >
          <span className="text-xs font-semibold text-slate-500">Pengajuan Masuk</span>
          <span className="text-3xl font-extrabold text-slate-900 font-mono block">{totalSubmissions}</span>
          <span className="text-[11px] text-slate-400">Proposal mustahik baru</span>
        </div>

        <div 
          onClick={() => setAmilTab('pengajuan')}
          className="taste-card bg-white p-4 rounded-2xl border border-slate-200 cursor-pointer space-y-1"
        >
          <span className="text-xs font-semibold text-slate-500">Menunggu Keputusan</span>
          <span className="text-3xl font-extrabold text-amber-600 font-mono block">{pendingDecisions}</span>
          <span className="text-[11px] text-amber-700 font-medium">Perlu review amil</span>
        </div>

        <div className="taste-card bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Disetujui Bantuan</span>
          <span className="text-3xl font-extrabold text-emerald-800 font-mono block">{approvedSubmissions}</span>
          <span className="text-[11px] text-emerald-700 font-medium">Siap serah terima mesin</span>
        </div>

        <div className="taste-card bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Dana Teralokasi</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono block mt-1">
            Rp{totalAllocated.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-slate-400">Total anggaran terserap</span>
        </div>
      </div>

      {/* 2-Column Responsive Section: Skor Potensi & Usaha Dipantau */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rata-rata Skor Potensi */}
        <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
          <div className="flex justify-between items-baseline">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rata-rata Skor Potensi</h3>
              <p className="text-xs text-slate-500">Kalkulasi 5 aspek kelayakan usaha pemohon</p>
            </div>
            <span className="text-xl font-extrabold text-teal-800 font-mono">
              {avgScore > 0 ? `${avgScore}%` : '-'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-teal-700 h-full rounded-full transition-all duration-500" style={{ width: `${avgScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-500">
            Ambang batas pendampingan mandiri: 70%. Nilai di bawah 50% diprioritaskan untuk pendampingan dasar.
          </p>
        </div>

        {/* Usaha Dipantau */}
        <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Status Usaha Binaan</h3>
          {applicants.length > 0 ? (
            <>
              <p className="text-xs text-slate-600">
                <strong>{approvedSubmissions} usaha disetujui</strong> dari {totalSubmissions} pengajuan masuk.
              </p>
              <div className="pt-1 flex flex-col gap-2 text-xs">
                {applicants.slice(0, 3).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-200">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full ${app.status === 'Disetujui' ? 'bg-emerald-600' : 'bg-amber-500'} shrink-0`} />
                      <span className="font-semibold truncate">{app.businessName} ({app.name})</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">{app.status}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              Belum ada data usaha binaan yang terdaftar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
