'use client';

import React, { useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Check, Clock, UploadCloud, Eye, Image as ImageIcon } from 'lucide-react';

export const MentoringView: React.FC = () => {
  const {
    mentoringModules,
    uploadModuleTask,
    isEnrolledTraining,
    toggleTrainingEnrollment,
    setMustahikTab,
    setCurrent6MStep,
  } = useApp();

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const verifiedCount = mentoringModules.filter(m => m.status === 'terverifikasi').length;
  const progressPercent = Math.round((verifiedCount / mentoringModules.length) * 100);

  const handleTriggerUpload = (moduleId: string) => {
    setActiveModuleId(moduleId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeModuleId) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (loadEv) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
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
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            uploadModuleTask(activeModuleId, file.name, compressed);
          } else {
            const raw = loadEv.target?.result as string;
            uploadModuleTask(activeModuleId, file.name, raw);
          }
        };
        img.src = loadEv.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (loadEv) => {
        const raw = loadEv.target?.result as string;
        uploadModuleTask(activeModuleId, file.name, raw);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 taste-enter">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      {/* Top Bar with Back */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">3M: Mentoring (Pelatihan)</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Pengerjaan kuis dan unggah tugas praktik. Ambang batas kelulusan program: 80%.
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

      {/* Progress Bar Card */}
      <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Tingkat Penyelesaian Modul</h3>
            <p className="text-xs text-slate-500">
              {verifiedCount} dari {mentoringModules.length} tugas praktik telah disetujui mentor.
            </p>
          </div>
          <span className="font-mono font-extrabold text-xl text-emerald-800">
            {progressPercent}% <span className="text-xs text-slate-400 font-normal">/ target 80%</span>
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#277A4D] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentoringModules.map(mod => {
          const isVerified = mod.status === 'terverifikasi';
          const isWaiting = mod.status === 'menunggu';

          return (
            <div
              key={mod.id}
              className="taste-card bg-white rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-xs font-bold text-[#111827]">{mod.title}</h3>
                  <div>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A4331]">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Terverifikasi</span>
                      </span>
                    ) : isWaiting ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sedang Ditinjau</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-normal text-slate-400">
                        Belum Diunggah
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">{mod.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                {mod.filename && (
                  <div className="flex items-center justify-between text-[11px] text-[#1A4331] font-mono bg-[#E8F3ED] px-2 py-1 rounded-lg border border-[#277A4D]/20">
                    <span className="truncate max-w-[170px]">📎 {mod.filename}</span>
                    {mod.fileUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewUrl(mod.fileUrl || null)}
                        className="text-emerald-800 hover:underline flex items-center gap-0.5 text-[10px] font-sans font-bold"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lihat</span>
                      </button>
                    )}
                  </div>
                )}

                {!isVerified && !isWaiting && (
                  <button
                    type="button"
                    onClick={() => handleTriggerUpload(mod.id)}
                    className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Unggah Bukti Tugas</span>
                  </button>
                )}

                {isWaiting && (
                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>Menunggu verifikasi mentor</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTriggerUpload(mod.id)}
                      className="text-emerald-800 text-[10px] font-bold hover:underline"
                    >
                      Ganti
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Preview Bukti */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Bukti Tugas Praktik</span>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Tutup
              </button>
            </div>
            <div className="max-h-[60vh] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center p-2">
              <img src={previewUrl} alt="Bukti tugas" className="max-h-[55vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Pelatihan Terdekat Card */}
      <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
            Jadwal Kelas Terdekat
          </span>
          <h4 className="text-sm font-bold text-[#111827]">
            Pemasaran Digital untuk Usaha Mikro (Katalog WA & Optimasi Medsos)
          </h4>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Sabtu, 10.00 WIB · Daring via Zoom
          </p>
        </div>

        <button
          onClick={toggleTrainingEnrollment}
          className={`btn-primary text-xs shrink-0 ${
            isEnrolledTraining ? 'bg-[#E8F3ED] text-[#1A4331] border border-[#1A4331]' : ''
          }`}
        >
          {isEnrolledTraining ? 'Terdaftar ✓' : 'Daftar Kelas'}
        </button>
      </div>

      {/* Sequential Next Step */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setCurrent6MStep(4)}
          className="btn-secondary w-full text-xs text-[#111827] border-slate-300 hover:bg-slate-100 flex items-center justify-center gap-1.5"
        >
          <span>Lanjut ke Tahap 4M (Market)</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
