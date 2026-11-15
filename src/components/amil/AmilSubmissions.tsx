'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ApplicantItem } from '@/types';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight, 
  Building2, 
  MapPin, 
  DollarSign, 
  Award, 
  Eye,
  Check,
  X
} from 'lucide-react';

export const AmilSubmissions: React.FC = () => {
  const { applicants, updateApplicantStatus, businessProfile } = useApp();
  const [selectedId, setSelectedId] = useState<string>(applicants[0]?.id || '');

  const selectedApp = applicants.find(a => a.id === selectedId) || applicants[0];

  return (
    <div className="space-y-5 taste-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Antrean Masuk Pengajuan Mustahik
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Tinjau kelayakan proposal 6M, evaluasi skoring potensi, dan tetapkan keputusan pendampingan.
          </p>
        </div>
        <span className="pill-verified self-start sm:self-auto">
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
            Belum ada berkas formulir pengajuan mustahik baru yang diajukan. Setiap pengajuan dari mustahik akan otomatis masuk ke antrean ini.
          </p>
        </div>
      ) : (
        /* Guideline 6.2: Desktop Adaptation Strategy - Split View / Two-Column Layout */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Kolom Kiri (40% / 5 cols): Daftar Scrollable Pengajuan Mustahik */}
          <div className="md:col-span-5 space-y-3 md:max-h-[calc(100vh-180px)] md:overflow-y-auto pr-0 md:pr-1">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider font-mono">
                Daftar Pemohon ({applicants.length})
              </span>
              <span className="text-[11px] text-[#6B7280]">Urutkan: Terbaru</span>
            </div>

            <div className="space-y-2.5">
              {applicants.map(app => {
                const isSelected = app.id === selectedId;
                const isApproved = app.status === 'Disetujui';
                const isAssisted = app.status === 'Didampingi';
              const isRejected = app.status === 'Ditolak';

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  className={`taste-card cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-[#E8F3ED] border-[#1A4331] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">{app.name}</h3>
                      <p className="text-xs text-[#6B7280]">{app.businessName}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isApproved
                        ? 'bg-[#E8F3ED] text-[#277A4D] border border-[#277A4D]/30'
                        : isAssisted
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : isRejected
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#111827]">{app.potentialScore}%</span>
                      <span>Skor Potensi</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#6B7280]">{app.submissionDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan (60% / 7 cols): Detail Spesifik Pengajuan yang Sedang Dipilih */}
        <div className="md:col-span-7 space-y-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs sticky top-20">
          {selectedApp ? (
            <>
              {/* Header Detail */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#A3B8AD] font-bold tracking-wider block">
                    Detail Verifikasi Pengajuan
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#111827] mt-0.5">
                    {selectedApp.name}
                  </h2>
                  <p className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#1A4331]" />
                    <span>{selectedApp.businessName}</span>
                    <span>·</span>
                    <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>{selectedApp.location}</span>
                  </p>
                </div>

                <span className="pill-verified">
                  Skor Potensi: {selectedApp.potentialScore}%
                </span>
              </div>

              {/* Snapshot Keuangan & Rencana Bantuan */}
              <div className="grid grid-cols-2 gap-3 bg-[#F8F9FA] p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[#6B7280] block text-[11px]">Estimasi Omzet Bulanan:</span>
                  <span className="font-mono font-bold text-[#111827] text-sm">
                    {businessProfile.monthlyRevenue > 0 ? `Rp${businessProfile.monthlyRevenue.toLocaleString('id-ID')}` : 'Sesuai Formulir'}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[11px]">Rencana Alokasi Paket:</span>
                  <span className="font-bold text-[#1A4331] text-xs block truncate">
                    {selectedApp.plannedUsage || 'Bantuan Modal Usaha 6M'}
                  </span>
                </div>
              </div>

              {/* Rincian 5 Aspek Penilaian */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-[#111827] block">
                  Indikator Aspek Kelayakan Usaha (1M Mapping):
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6B7280] bg-[#F8F9FA] p-3 rounded-xl border border-slate-200">
                  <div>• Lama Usaha: <strong className="text-[#111827]">{businessProfile.duration || '-'}</strong></div>
                  <div>• Lokasi Usaha: <strong className="text-[#111827]">{businessProfile.aspects?.premisesStatus || '-'}</strong></div>
                  <div>• Pelanggan Tetap: <strong className="text-[#111827]">{businessProfile.aspects?.regularCustomers || '-'}</strong></div>
                  <div>• Pelatihan: <strong className="text-[#111827]">{businessProfile.aspects?.trainingsAttended || '-'}</strong></div>
                </div>
              </div>

              {/* Dokumen Lampiran */}
              <div className="space-y-2 text-xs pt-1">
                <span className="font-bold text-[#111827] block">
                  Dokumen Legalitas & Verifikasi Fisik:
                </span>
                <div className="space-y-1.5">
                  {[
                    { name: 'KTP & Kartu Keluarga', file: 'bukti_identitas.jpg', status: 'Terverifikasi' },
                    { name: 'Surat Keterangan Tidak Mampu / DTKS', file: 'bukti_dtks.jpg', status: 'Terverifikasi' },
                    { name: 'Foto Tempat Usaha & Dapur Produksi', file: 'foto_usaha.jpg', status: 'Terverifikasi' },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#1A4331]" />
                        <span className="font-semibold text-[#111827]">{d.name}</span>
                        <span className="text-[10px] text-[#6B7280] font-mono">({d.file})</span>
                      </div>
                      <span className="pill-verified text-[10px]">{d.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons (Guideline 4 & 6.2: Tombol Aksi Ganda di Bawah) */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateApplicantStatus(selectedApp.id, 'Disetujui')}
                  className={`btn-primary w-full sm:flex-1 py-3 text-xs ${
                    selectedApp.status === 'Disetujui' ? 'opacity-70 ring-2 ring-[#277A4D]' : ''
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Setujui Bantuan Modal</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateApplicantStatus(selectedApp.id, 'Didampingi')}
                  className="btn-secondary w-full sm:w-auto py-3 text-xs bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100"
                >
                  <span>Dampingi Dulu</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateApplicantStatus(selectedApp.id, 'Ditolak')}
                  className="btn-secondary w-full sm:w-auto py-3 text-xs border-red-200 text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                  <span>Tolak</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-[#6B7280] text-xs">
              Pilih salah satu proposal dari daftar di sebelah kiri untuk melihat rincian dokumen.
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
