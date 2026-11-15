'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  MapPin, 
  Check, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText,
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export const AmilSubmissions: React.FC = () => {
  const { applicants, updateApplicantStatus, businessProfile, documents, submissionStatus } = useApp();
  const [selectedId, setSelectedId] = useState<string>(applicants[0]?.id || '');

  const selectedApp = applicants.find(a => a.id === selectedId) || applicants[0];

  return (
    <div className="space-y-5 taste-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Antrean Proposal Pengajuan
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Daftar proposal mustahik yang masuk untuk diverifikasi dan ditentukan kelayakannya pada program 6M BAZNAS.
          </p>
        </div>
        <span className="pill-verified self-start sm:self-auto text-xs">
          <span className="w-2 h-2 rounded-full bg-[#277A4D] animate-pulse" />
          <span>{applicants.length} Proposal Aktif</span>
        </span>
      </div>

      {applicants.length === 0 ? (
        <div className="taste-card bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3 my-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#111827]">Belum Ada Pengajuan Masuk</h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto leading-relaxed">
            Belum ada proposal mustahik yang diajukan. Setiap pengajuan dari mustahik binaan akan otomatis masuk ke antrean ini.
          </p>
        </div>
      ) : (
        /* Split View Layout */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Kolom Kiri (5 cols): Daftar Proposal */}
          <div className="md:col-span-5 space-y-2.5 md:max-h-[calc(100vh-180px)] md:overflow-y-auto pr-0 md:pr-1">
            <div className="flex items-center justify-between pb-1 px-1">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider font-mono">
                Daftar Pemohon ({applicants.length})
              </span>
              <span className="text-[11px] text-[#6B7280]">Urutan Terbaru</span>
            </div>

            {applicants.map(app => {
              const isSelected = app.id === selectedId;
              const isApproved = app.status === 'Disetujui' || app.stage === 2;
              const isRejected = app.status === 'Ditolak';
              const currentStage = isApproved ? 2 : (app.stage || 1);

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  className={`taste-card cursor-pointer p-4 rounded-2xl border transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-[#E8F3ED] border-[#1A4331] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#111827] truncate">{app.name}</h3>
                      <p className="text-xs text-[#6B7280] truncate">{app.businessName}</p>
                    </div>

                    {/* Keterangan Tahap 6M */}
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                      currentStage === 2
                        ? 'bg-emerald-100 text-[#1A4331] border border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      Tahap {currentStage}: {currentStage === 2 ? '2M Matching' : '1M Mapping'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#6B7280]">
                    <span className="font-mono font-bold text-[#111827]">
                      Skor {app.potentialScore}%
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isApproved
                        ? 'text-[#277A4D] bg-emerald-50'
                        : isRejected
                        ? 'text-red-700 bg-red-50'
                        : 'text-amber-800 bg-amber-50'
                    }`}>
                      {isApproved ? 'Lolos ke Tahap 2' : isRejected ? 'Ditolak' : 'Menunggu Verifikasi'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kolom Kanan (7 cols): Detail Verifikasi Pengajuan (Clean & Minimalist) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5 sticky top-20">
            {selectedApp ? (
              <>
                {/* Header Detail */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-[#277A4D] font-bold tracking-wider">
                        Verifikasi Proposal Mustahik
                      </span>
                      <span className="text-slate-300">·</span>
                      {/* Badge Keterangan Tahap */}
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        selectedApp.status === 'Disetujui' || selectedApp.stage === 2
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {selectedApp.status === 'Disetujui' || selectedApp.stage === 2
                          ? 'Tahap 2: 2M Matching'
                          : 'Tahap 1: 1M Mapping'}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#111827] tracking-tight">
                      {selectedApp.name}
                    </h2>
                    <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#1A4331] shrink-0" />
                      <span>{selectedApp.businessName}</span>
                      <span>·</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selectedApp.location}</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span className={`self-start text-xs font-bold px-3 py-1 rounded-xl border ${
                    selectedApp.status === 'Disetujui'
                      ? 'bg-emerald-50 text-[#1A4331] border-emerald-200'
                      : selectedApp.status === 'Ditolak'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {selectedApp.status === 'Disetujui' 
                      ? 'Lolos Tahap 1 (Matching)' 
                      : selectedApp.status === 'Ditolak'
                      ? 'Pengajuan Ditolak'
                      : 'Menunggu Persetujuan Amil'}
                  </span>
                </div>

                {/* 4 Clean Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-slate-200 space-y-0.5">
                    <span className="text-[10px] text-[#6B7280] block">Skor Potensi:</span>
                    <span className="text-base font-bold font-mono text-[#111827]">
                      {selectedApp.potentialScore}%
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-slate-200 space-y-0.5">
                    <span className="text-[10px] text-[#6B7280] block">Omzet Bulanan:</span>
                    <span className="text-xs font-bold font-mono text-[#111827] truncate block">
                      Rp{Number(businessProfile.monthlyRevenue || 1800000).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-slate-200 space-y-0.5">
                    <span className="text-[10px] text-[#6B7280] block">Bantuan Modal:</span>
                    <span className="text-xs font-bold font-mono text-[#1A4331] block">
                      Rp3.500.000
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-slate-200 space-y-0.5">
                    <span className="text-[10px] text-[#6B7280] block">Lama Usaha:</span>
                    <span className="text-xs font-bold text-[#111827] block truncate">
                      {businessProfile.duration || '3 tahun'}
                    </span>
                  </div>
                </div>

                {/* Kelengkapan Dokumen Legalitas (Real Data from documents) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Dokumen Legalitas (Tahap 1M)
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      {documents.filter(d => Boolean(d.filename)).length} dari 4 Berkas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {documents.map(d => {
                      const hasUploaded = Boolean(d.filename && d.filename.trim() !== '');
                      const isVerified = d.status === 'terverifikasi';

                      return (
                        <div
                          key={d.id}
                          className="p-2.5 rounded-xl border border-slate-200 bg-[#F8F9FA] flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {d.fileUrl && !d.filename?.toLowerCase().endsWith('.pdf') ? (
                              <img
                                src={d.fileUrl}
                                alt={d.name}
                                className="w-7 h-7 rounded-md object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-800 block truncate text-[11px]">
                                {d.name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono block truncate">
                                {hasUploaded ? d.filename : 'Belum diunggah'}
                              </span>
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                            isVerified
                              ? 'bg-emerald-100 text-[#1A4331]'
                              : hasUploaded
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {isVerified ? 'Sah' : hasUploaded ? 'Menunggu' : 'Kosong'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Aspek Kelayakan Usaha Singkat */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#111827] uppercase tracking-wider block">
                    Parameter Kelayakan Lapangan
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8F9FA] p-3 rounded-2xl border border-slate-200 text-[#6B7280]">
                    <div>Tempat Usaha: <strong className="text-slate-900">{businessProfile.aspects?.premisesStatus || 'Milik sendiri'}</strong></div>
                    <div>Pelanggan: <strong className="text-slate-900">{businessProfile.aspects?.regularCustomers || '6-20 orang'}</strong></div>
                    <div>Pelatihan Usaha: <strong className="text-slate-900">{businessProfile.aspects?.trainingsAttended || '2-3 kali'}</strong></div>
                    <div>Pengalaman: <strong className="text-slate-900">{businessProfile.aspects?.experienceYears || '3-5 tahun'}</strong></div>
                  </div>
                </div>

                {/* Dynamic Action Buttons Sesuaikan dengan Tahap */}
                <div className="pt-3 border-t border-slate-100">
                  {selectedApp.status === 'Disetujui' || (selectedApp.stage && selectedApp.stage >= 2) ? (
                    /* Jika Sudah di Tahap 2 ke atas */
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-[#1A4331] font-semibold">
                        <CheckCircle2 className="w-5 h-5 text-[#277A4D] shrink-0" />
                        <span>
                          {selectedApp.stage === 6 ? 'Binaan telah memenuhi syarat Tahap 6M (Moving Up: Mandiri).' :
                           selectedApp.stage === 5 ? 'Binaan aktif di Tahap 5M (Monitoring: Pencatatan Omzet).' :
                           selectedApp.stage === 4 ? 'Binaan aktif di Tahap 4M (Market: Saluran Pasar).' :
                           selectedApp.stage === 3 ? 'Binaan aktif di Tahap 3M (Mentoring: Pelatihan Usaha).' :
                           'Proposal telah lolos Tahap 1 dan aktif di Tahap 2M (Matching: Alokasi Modal).'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateApplicantStatus(selectedApp.id, 'Baru')}
                        className="text-xs text-slate-600 hover:text-slate-900 underline shrink-0 font-medium"
                      >
                        Tinjau Kembali
                      </button>
                    </div>
                  ) : (
                    /* Jika Masih di Tahap 1: Tombol Lanjut ke Tahap 2 */
                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => updateApplicantStatus(selectedApp.id, 'Disetujui')}
                        className="btn-primary w-full sm:flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>Lanjut ke Tahap 2 (Matching)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateApplicantStatus(selectedApp.id, 'Didampingi')}
                        className="btn-secondary w-full sm:w-auto py-3 px-4 text-xs font-semibold border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100"
                      >
                        <span>Minta Revisi Tahap 1</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateApplicantStatus(selectedApp.id, 'Ditolak')}
                        className="btn-secondary w-full sm:w-auto py-3 px-3 text-xs border-slate-200 text-red-600 hover:bg-red-50"
                        title="Tolak Proposal"
                      >
                        <X className="w-4 h-4" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-[#6B7280] text-xs">
                Pilih proposal dari daftar sebelah kiri untuk melihat rincian verifikasi.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
