'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Clock, UploadCloud } from 'lucide-react';

export const MentoringView: React.FC = () => {
  const {
    mentoringModules,
    uploadModuleTask,
    isEnrolledTraining,
    toggleTrainingEnrollment,
    setMustahikTab,
    setCurrent6MStep,
  } = useApp();

  const verifiedCount = mentoringModules.filter(m => m.status === 'terverifikasi').length;
  const progressPercent = Math.round((verifiedCount / mentoringModules.length) * 100);

  const handleSimulateUpload = (moduleId: string) => {
    uploadModuleTask(moduleId, `tugas_${moduleId}_${Date.now().toString().slice(-4)}.jpg`);
  };

  return (
    <div className="space-y-6 taste-enter">
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
            className="bg-emerald-700 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Modules Grid: 2 or 3 Columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentoringModules.map(mod => {
          const isVerified = mod.status === 'terverifikasi';
          const isWaiting = mod.status === 'menunggu';

          return (
            <div
              key={mod.id}
              className="taste-card bg-white rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-xs font-bold text-slate-900">{mod.title}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isWaiting
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isVerified
                      ? 'Terverifikasi'
                      : isWaiting
                      ? 'Menunggu review'
                      : 'Belum diunggah'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{mod.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                {mod.filename && (
                  <div className="text-[11px] text-emerald-800 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    📎 {mod.filename}
                  </div>
                )}

                {!isVerified && !isWaiting && (
                  <button
                    onClick={() => handleSimulateUpload(mod.id)}
                    className="taste-btn w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Unggah Bukti Tugas
                  </button>
                )}

                {isWaiting && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Tugas diunggah. Menunggu penilaian mentor.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pelatihan Terdekat Card */}
      <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Jadwal Kelas Terdekat
          </span>
          <h4 className="text-sm font-bold text-slate-900">
            Pemasaran Digital untuk Usaha Mikro (Katalog WA & Optimasi Medsos)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Sabtu, 10.00 WIB · Daring via Zoom
          </p>
        </div>

        <button
          onClick={toggleTrainingEnrollment}
          className={`taste-btn px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            isEnrolledTraining
              ? 'bg-slate-100 text-slate-800 border border-slate-300'
              : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
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
          className="taste-btn w-full py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center justify-center gap-2"
        >
          <span>Lanjut ke Tahap 4M (Market)</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
