'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, Clock, UploadCloud, Trash2, Lock, FileText } from 'lucide-react';

export const MappingView: React.FC = () => {
  const {
    businessProfile,
    updateBusinessProfile,
    updateAspects,
    documents,
    uploadDocument,
    deleteDocument,
    applicationStep,
    setMustahikTab,
    setCurrent6MStep,
    submissionStatus,
    saveMustahikMappingToCloud,
    cancelMustahikSubmission,
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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

  // Upload berkas nyata (Image & PDF) dengan kompresi Data URL agar foto langsung tampil
  const handleFileChange = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (loadEv) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200; // Resolusi tajam HD untuk dokumen/foto
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            uploadDocument(docId, file.name, compressedDataUrl);
          } else {
            uploadDocument(docId, file.name, loadEv.target?.result as string);
          }
        };
        img.src = loadEv.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // Dokumen PDF atau format berkas lainnya
      const reader = new FileReader();
      reader.onload = (loadEv) => {
        uploadDocument(docId, file.name, loadEv.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    setSavedSuccess(`Berkas "${file.name}" berhasil diunggah.`);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleTriggerUpload = (docId: string) => {
    fileInputRefs.current[docId]?.click();
  };

  const handleDeleteFile = (docId: string) => {
    deleteDocument(docId);
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId]!.value = '';
    }
    setSavedSuccess('Berkas berhasil dihapus.');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  // Validasi kelengkapan isian & berkas dokumen
  const isProfileComplete = Boolean(
    businessProfile.businessName && businessProfile.businessName.trim() !== '' &&
    businessProfile.businessType && businessProfile.businessType.trim() !== '' &&
    businessProfile.duration && businessProfile.duration.trim() !== '' &&
    businessProfile.monthlyRevenue > 0 &&
    businessProfile.address && businessProfile.address.trim() !== ''
  );

  const isDocumentsComplete = documents.length > 0 && documents.every(d => Boolean(d.filename && d.filename.trim() !== ''));
  const isApprovedByAmil = submissionStatus === 'disetujui' || applicationStep >= 3;
  const canProceedTo2M = isProfileComplete && isDocumentsComplete && isApprovedByAmil;

  return (
    <div className="space-y-6 taste-enter">
      {/* Top Header: Clean & Minimalist with Elegant Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">1M: Mapping (Pemetaan)</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Pengisian data operasional, dokumen legalitas, dan 5 indikator aspek kelayakan usaha.
          </p>
        </div>

        {/* Minimalist Top Status Indicator (Anti-slop) */}
        <div className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs shadow-2xs">
          <span className={`w-2 h-2 rounded-full ${
            submissionStatus === 'disetujui'
              ? 'bg-[#1A4331]'
              : submissionStatus === 'diajukan'
              ? 'bg-amber-500 animate-pulse'
              : submissionStatus === 'dibatalkan'
              ? 'bg-red-500'
              : 'bg-slate-300'
          }`} />
          <span className="font-semibold text-[#111827]">
            {submissionStatus === 'draft'
              ? 'Draf Belum Diajukan'
              : submissionStatus === 'diajukan'
              ? 'Diajukan · Menunggu Verifikasi Amil'
              : submissionStatus === 'disetujui'
              ? 'Disetujui Amil BAZNAS'
              : submissionStatus === 'dibatalkan'
              ? 'Pengajuan Dibatalkan'
              : 'Status: Menunggu'}
          </span>
        </div>
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

          {/* Dokumen Verifikasi Section (Dukungan Gambar & PDF, Ganti & Hapus) */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3.5">
            <div>
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Dokumen Verifikasi Legalitas
              </h3>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                Dukung format gambar (JPG, PNG) dan dokumen PDF. Maksimal 10MB per berkas.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {documents.map(doc => {
                const isVerified = doc.status === 'terverifikasi';
                const isWaiting = doc.status === 'menunggu';
                const hasFile = Boolean(doc.filename && doc.filename.trim() !== '');

                return (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-[#F8F9FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Hidden Native File Input (Image & PDF) */}
                    <input
                      type="file"
                      ref={el => { fileInputRefs.current[doc.id] = el; }}
                      accept="image/png,image/jpeg,image/webp,application/pdf"
                      className="hidden"
                      onChange={e => handleFileChange(doc.id, e)}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111827]">{doc.name}</span>
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A4331]">
                            <CheckCircle2 className="w-3 h-3 text-[#1A4331]" />
                            <span>Terverifikasi</span>
                          </span>
                        ) : isWaiting && hasFile ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Sedang Ditinjau</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-normal text-slate-400">
                            Belum diunggah
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">{doc.notes}</p>
                      
                      {hasFile && (
                        <div className="mt-2.5 flex items-center gap-2.5">
                          {doc.fileUrl && !doc.filename?.toLowerCase().endsWith('.pdf') ? (
                            <img 
                              src={doc.fileUrl} 
                              alt={doc.name} 
                              className="w-11 h-11 object-cover rounded-xl border border-slate-300 shadow-2xs shrink-0 bg-slate-100" 
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0 border border-slate-300">
                              <FileText className="w-5 h-5 text-red-600" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1A4331] bg-white px-2 py-0.5 rounded-md border border-slate-200 truncate max-w-[200px] sm:max-w-xs block">
                              <span className="truncate">{doc.filename}</span>
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                              <span>Tersimpan di Database</span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Unggah, Ganti, Hapus */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {hasFile ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleTriggerUpload(doc.id)}
                            className="taste-btn py-1 px-2.5 text-xs font-semibold text-slate-700 hover:text-[#1A4331] hover:bg-white rounded-lg border border-slate-200 transition-all"
                            title="Ganti berkas file"
                          >
                            Ganti
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(doc.id)}
                            className="taste-btn p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-all"
                            title="Hapus berkas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleTriggerUpload(doc.id)}
                          className="taste-btn py-1.5 px-3 text-xs font-semibold text-[#1A4331] bg-white hover:bg-[#E8F3ED] rounded-xl border border-slate-200 flex items-center gap-1.5 transition-all shadow-2xs"
                          title="Unggah berkas foto (JPG/PNG) atau PDF"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-[#277A4D]" />
                          <span>Unggah</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons: Simpan, Batalkan, dan Kunci Lanjut Tahap 2M */}
          <div className="space-y-3">
            {savedSuccess && (
              <div className="p-3 bg-slate-900 text-white text-xs rounded-xl flex items-center gap-2 shadow-xs taste-enter">
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
                    <span>{isUpdating ? 'Menyimpan...' : 'Perbarui Data'}</span>
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

            {/* Tombol Lanjut ke Tahap 2M (Terkunci jika data belum lengkap atau belum di-ACC Amil) */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={!canProceedTo2M}
                onClick={() => {
                  if (canProceedTo2M) {
                    setCurrent6MStep(2);
                  }
                }}
                className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  canProceedTo2M
                    ? 'btn-primary'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                }`}
              >
                {!canProceedTo2M && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                <span>Lanjut ke Tahap 2M (Matching)</span>
                {canProceedTo2M && <span>→</span>}
              </button>

              {!canProceedTo2M && (
                <p className="text-[11px] text-center text-slate-500 leading-relaxed px-2">
                  {!isProfileComplete || !isDocumentsComplete
                    ? '🔒 Tombol terkunci. Mohon lengkapi profil usaha dan unggah 4 berkas dokumen persyaratan di atas terlebih dahulu.'
                    : '🔒 Berkas lengkap. Menunggu peninjauan & persetujuan Amil BAZNAS untuk membuka Tahap 2M.'}
                </p>
              )}
            </div>
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
