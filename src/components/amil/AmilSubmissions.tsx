'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ApplicantItem } from '@/types';
import { FileText, Eye, X, CheckCircle2, AlertCircle, MapPin, DollarSign, Award } from 'lucide-react';

export const AmilSubmissions: React.FC = () => {
  const { applicants, updateApplicantStatus, businessProfile } = useApp();
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantItem | null>(null);

  return (
    <div className="space-y-6 taste-enter">
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Antrean Pengajuan Mustahik</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Tinjauan proposal bantuan zakat produktif, kesiapan berkas, dan penetapan status intervensi.
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Cloud Sync</span>
        </span>
      </div>

      {/* Responsive Grid: 1 col on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applicants.map(app => {
          const isApproved = app.status === 'Disetujui';
          const isAssisted = app.status === 'Didampingi';
          const isRejected = app.status === 'Ditolak';

          return (
            <div
              key={app.id}
              className="taste-card bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{app.name}</h3>
                    <p className="text-xs text-slate-500">{app.businessType} · {app.location}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isApproved
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isAssisted
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : isRejected
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>{app.documentsStatus}</span>
                  </div>
                  <p className="font-semibold text-slate-900">{app.plannedUsage}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-500">Skor potensi:</span>
                    <span className="font-mono font-extrabold text-slate-900">{app.potentialScore}%</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      app.potentialScore < 50
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : app.potentialScore < 75
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {app.potentialScore < 50 ? 'Rendah' : app.potentialScore < 75 ? 'Sedang' : 'Tinggi'}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Full Submission Details Button */}
              <button
                type="button"
                onClick={() => setSelectedApplicant(app)}
                className="taste-btn w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat Detail Berkas Masuk</span>
              </button>

              {/* Action Buttons: Setujui, Dampingi dulu, Tolak */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => updateApplicantStatus(app.id, 'Disetujui')}
                  className={`taste-btn py-2 text-xs font-bold rounded-xl transition-all ${
                    isApproved
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
                  }`}
                >
                  Setujui
                </button>

                <button
                  onClick={() => updateApplicantStatus(app.id, 'Didampingi')}
                  className={`taste-btn py-2 text-xs font-bold rounded-xl transition-all ${
                    isAssisted
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
                  }`}
                >
                  Dampingi
                </button>

                <button
                  onClick={() => updateApplicantStatus(app.id, 'Ditolak')}
                  className={`taste-btn py-2 text-xs font-bold rounded-xl transition-all ${
                    isRejected
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-700 border border-slate-200'
                  }`}
                >
                  Tolak
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detail Berkas Pengajuan Masuk */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 taste-enter">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Detail Berkas Pengajuan Mustahik
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedApplicant.name}</h3>
                <p className="text-xs text-slate-500">{selectedApplicant.businessName}</p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="taste-btn p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Business Data Snapshot */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Jenis Usaha:</span>
                  <span className="font-semibold text-slate-900">{selectedApplicant.businessType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Wilayah / Domisili:</span>
                  <span className="font-semibold text-slate-900">{selectedApplicant.location}</span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-500 block">Estimasi Omzet:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    Rp{selectedApplicant.id === 'app-faizah' ? businessProfile.monthlyRevenue.toLocaleString('id-ID') : '2.100.000'} / bln
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-500 block">Skor Potensi 5 Aspek:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {selectedApplicant.potentialScore}% (Layak Intervensi)
                  </span>
                </div>
              </div>

              {/* Rincian 5 Aspek */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block border-b pb-1">
                  Verifikasi 5 Aspek Kelayakan Usaha
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>• Lama Usaha: <strong>{selectedApplicant.id === 'app-faizah' ? businessProfile.duration : '2 tahun'}</strong></div>
                  <div>• Lokasi Usaha: <strong>{selectedApplicant.id === 'app-faizah' ? businessProfile.aspects.premisesStatus : 'Milik sendiri'}</strong></div>
                  <div>• Pelanggan Tetap: <strong>{selectedApplicant.id === 'app-faizah' ? businessProfile.aspects.regularCustomers : '20 orang'}</strong></div>
                  <div>• Pelatihan Pernah Diikuti: <strong>{selectedApplicant.id === 'app-faizah' ? businessProfile.aspects.trainingsAttended : '1 kali'}</strong></div>
                </div>
              </div>

              {/* Dokumen Lampiran */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Dokumen Legalitas & Usaha:</span>
                <p className="text-[11px] text-slate-600">✓ KTP & Kartu Keluarga (Terverifikasi)</p>
                <p className="text-[11px] text-slate-600">✓ Surat Keterangan Tidak Mampu / SKTM Desa</p>
                <p className="text-[11px] text-slate-600">✓ Foto Dapur Produksi & Sampel Produk</p>
              </div>
            </div>

            {/* Action inside modal */}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  updateApplicantStatus(selectedApplicant.id, 'Disetujui');
                  setSelectedApplicant(null);
                }}
                className="taste-btn flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl"
              >
                Setujui Bantuan Modal
              </button>
              <button
                type="button"
                onClick={() => {
                  updateApplicantStatus(selectedApplicant.id, 'Ditolak');
                  setSelectedApplicant(null);
                }}
                className="taste-btn py-2.5 px-4 bg-slate-100 hover:bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-slate-200"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
