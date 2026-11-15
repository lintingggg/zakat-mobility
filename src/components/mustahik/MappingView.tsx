'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, CheckCircle2, Clock, UploadCloud } from 'lucide-react';

export const MappingView: React.FC = () => {
  const {
    businessProfile,
    updateBusinessProfile,
    updateAspects,
    documents,
    uploadDocument,
    setMustahikTab,
    setCurrent6MStep,
    submissionStatus,
    saveMustahikMappingToCloud,
    cancelMustahikSubmission,
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await saveMustahikMappingToCloud();
    setIsUpdating(false);
    setSavedSuccess('Data profil usaha dan skoring berhasil diperbarui di database Supabase!');
    setTimeout(() => setSavedSuccess(null), 4000);
  };

  const handleCancelSubmission = async () => {
    const confirmCancel = window.confirm('Apakah Anda yakin ingin membatalkan pengajuan bantuan usaha ini?');
    if (!confirmCancel) return;

    setIsUpdating(true);
    await cancelMustahikSubmission();
    setIsUpdating(false);
    setSavedSuccess('Pengajuan berhasil dibatalkan. Anda dapat mengedit dan mengajukan kembali sewaktu-waktu.');
    setTimeout(() => setSavedSuccess(null), 4000);
  };

  const handleSimulateUpload = (docId: string) => {
    const fakeName = `dokumen_${docId}_${Date.now().toString().slice(-4)}.jpg`;
    uploadDocument(docId, fakeName);
  };

  return (
    <div className="space-y-6 taste-enter">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">1M: Mapping (Pemetaan)</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Pengisian data operasional, indikator 5 aspek kelayakan usaha, dan dokumen legalitas.
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
        {/* Left Column: Data Usaha & Dokumen */}
        <div className="md:col-span-6 space-y-5">
          {/* Form Data Usaha */}
          <form onSubmit={handleSave} className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Profil Usaha Pemohon
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama usaha
              </label>
              <input
                type="text"
                value={businessProfile.businessName}
                placeholder="Contoh: Keripik Jagung Renyah, Warung Berkah"
                onChange={e => updateBusinessProfile({ businessName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Jenis usaha
              </label>
              <input
                type="text"
                value={businessProfile.businessType}
                placeholder="Contoh: Kuliner olahan pangan, Pertanian, Konveksi"
                onChange={e => updateBusinessProfile({ businessType: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Lama usaha
                </label>
                <input
                  type="text"
                  value={businessProfile.duration}
                  placeholder="Contoh: 1 tahun, 6 bulan"
                  onChange={e => updateBusinessProfile({ duration: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Penghasilan/bulan
                </label>
                <input
                  type="text"
                  value={businessProfile.monthlyRevenue > 0 ? `Rp${businessProfile.monthlyRevenue.toLocaleString('id-ID')}` : ''}
                  placeholder="Rp0"
                  onChange={e => {
                    const num = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
                    updateBusinessProfile({ monthlyRevenue: num });
                  }}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alamat lengkap usaha
              </label>
              <input
                type="text"
                value={businessProfile.address}
                placeholder="Contoh: Jl. Raya Poncokusumo No. 15, RT 03/RW 02, Malang"
                onChange={e => updateBusinessProfile({ address: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                required
              />
            </div>
          </form>

          {/* Dokumen Verifikasi Section */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Dokumen Verifikasi Legalitas
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Amil memeriksa dokumen sebelum paket bantuan disetujui.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {documents.map(doc => {
                const isVerified = doc.status === 'terverifikasi';
                const isWaiting = doc.status === 'menunggu';

                return (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            isVerified
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isWaiting
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isVerified ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-600" />
                              Terverifikasi
                            </>
                          ) : isWaiting ? (
                            <>
                              <Clock className="w-3 h-3 inline mr-1 text-amber-600" />
                              Menunggu verifikasi
                            </>
                          ) : (
                            'Belum diunggah'
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{doc.notes}</p>
                      {doc.filename && (
                        <span className="inline-block mt-1 text-[11px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                          📎 {doc.filename}
                        </span>
                      )}
                    </div>

                    {!isVerified && (
                      <button
                        onClick={() => handleSimulateUpload(doc.id)}
                        className="taste-btn shrink-0 p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg border border-slate-200"
                        title="Unggah berkas"
                      >
                        <UploadCloud className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons: Edit, Batalkan, and Next */}
          <div className="space-y-3">
            {/* Status Pengajuan Banner */}
            <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              submissionStatus === 'draft'
                ? 'bg-slate-50 border-slate-200 text-slate-800'
                : submissionStatus === 'diajukan'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : submissionStatus === 'disetujui'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : submissionStatus === 'dibatalkan'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  submissionStatus === 'diajukan'
                    ? 'bg-amber-500 animate-pulse'
                    : submissionStatus === 'disetujui'
                    ? 'bg-emerald-600'
                    : submissionStatus === 'dibatalkan'
                    ? 'bg-red-500'
                    : 'bg-slate-400'
                }`} />
                <span className="font-semibold">
                  {submissionStatus === 'draft'
                    ? 'Status: Draf Profil Usaha (Belum Diajukan ke Amil)'
                    : submissionStatus === 'diajukan'
                    ? 'Status: Berkas Diajukan ke Amil (Menunggu Verifikasi)'
                    : submissionStatus === 'disetujui'
                    ? 'Status: Pengajuan Disetujui Amil BAZNAS'
                    : submissionStatus === 'dibatalkan'
                    ? 'Status: Pengajuan Dibatalkan oleh Pemohon'
                    : 'Status: Menunggu'}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                Cloud Sync
              </span>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-slate-900 text-white text-xs rounded-xl flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{savedSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {submissionStatus === 'draft' ? (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="btn-primary w-full text-xs col-span-1 sm:col-span-2"
                >
                  <span>{isUpdating ? 'Mengirim...' : 'Kirim Pengajuan Pemetaan Usaha'}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="btn-primary w-full text-xs"
                  >
                    <span>{isUpdating ? 'Menyimpan...' : 'Perbarui Data (Edit)'}</span>
                  </button>

                  {submissionStatus === 'diajukan' ? (
                    <button
                      type="button"
                      onClick={handleCancelSubmission}
                      disabled={isUpdating}
                      className="btn-secondary w-full text-xs border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Batalkan Pengajuan
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="btn-primary w-full text-xs"
                    >
                      Ajukan Kembali
                    </button>
                  )}
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCurrent6MStep(2)}
              className="btn-secondary w-full text-xs text-[#111827] border-slate-300 hover:bg-slate-100"
            >
              <span>Lanjut ke Tahap 2M (Matching)</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Right Column: Skor Potensi & 5 Aspek */}
        <div className="md:col-span-6 space-y-5">
          {/* Skor Potensi Card: Crisp typography without slop */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 flex items-center gap-5">
            {/* Circle Gauge */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-700"
                  strokeDasharray={`${businessProfile.calculatedScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-bold text-slate-900 block leading-none font-mono">
                  {businessProfile.calculatedScore}%
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-slate-900">Skor Potensi Awal</span>
                <span className="text-xs bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded border border-slate-200">
                  {businessProfile.calculatedScore < 50 ? 'Perlu Pendampingan' : businessProfile.calculatedScore < 75 ? 'Layak Binaan' : 'Sangat Layak'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Skor awal dihitung dari formulir 5 aspek. Skor final ditetapkan amil setelah survei lokasi lapangan.
              </p>
            </div>
          </div>

          {/* 5 Aspek Usaha Interactive Selectors */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Indikator 5 Aspek Kelayakan
            </h3>

            {/* Aspek 1: Kompetensi */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">1. Kompetensi Pelaku Usaha</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium px-2 py-0.5 rounded">
                  Kategori Baik
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">
                  Pengalaman menjalankan usaha
                </label>
                <select
                  value={businessProfile.aspects.experienceYears}
                  onChange={e => updateAspects('experienceYears', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                >
                  <option value="Kurang dari 1 tahun">Kurang dari 1 tahun</option>
                  <option value="1 sampai 3 tahun">1 sampai 3 tahun</option>
                  <option value="3 sampai 5 tahun">3 sampai 5 tahun</option>
                  <option value="Lebih dari 5 tahun">Lebih dari 5 tahun</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">
                  Pelatihan usaha yang pernah diikuti
                </label>
                <select
                  value={businessProfile.aspects.trainingsAttended}
                  onChange={e => updateAspects('trainingsAttended', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                >
                  <option value="Belum pernah">Belum pernah</option>
                  <option value="1 kali">1 kali</option>
                  <option value="2 sampai 3 kali">2 sampai 3 kali</option>
                  <option value="Lebih dari 3 kali">Lebih dari 3 kali</option>
                </select>
              </div>
            </div>

            {/* Aspek 2: Tempat Usaha */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">2. Fasilitas & Tempat Usaha</span>
              <div>
                <select
                  value={businessProfile.aspects.premisesStatus}
                  onChange={e => updateAspects('premisesStatus', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                >
                  <option value="Menumpang di rumah">Menumpang di rumah</option>
                  <option value="Sewa kios/lapak">Sewa kios/lapak</option>
                  <option value="Milik sendiri">Milik sendiri</option>
                </select>
              </div>
            </div>

            {/* Aspek 3: Jejaring & Pelanggan */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">3. Pelanggan & Jejaring Pasar</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-medium px-2 py-0.5 rounded">
                  Kategori Cukup
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">
                  Pelanggan tetap per bulan
                </label>
                <select
                  value={businessProfile.aspects.regularCustomers}
                  onChange={e => updateAspects('regularCustomers', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                >
                  <option value="Kurang dari 5">Kurang dari 5</option>
                  <option value="6 sampai 20">6 sampai 20</option>
                  <option value="21 sampai 50">21 sampai 50</option>
                  <option value="Lebih dari 50">Lebih dari 50</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">
                  Keanggotaan kelompok usaha
                </label>
                <select
                  value={businessProfile.aspects.networkMembership}
                  onChange={e => updateAspects('networkMembership', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                >
                  <option value="Tidak ada">Tidak ada</option>
                  <option value="Kelompok tidak aktif">Kelompok tidak aktif</option>
                  <option value="Kelompok aktif binaan">Kelompok aktif binaan</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
