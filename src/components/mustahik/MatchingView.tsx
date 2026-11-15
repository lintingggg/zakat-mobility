'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, CheckCircle2, Check, Clock, Play, Lock } from 'lucide-react';

export const MatchingView: React.FC = () => {
  const {
    businessProfile,
    zakatPackage,
    applicationStep,
    submissionStatus,
    simulateNextStep,
    disburseZakatPackage,
    documents,
    setMustahikTab,
    setCurrent6MStep,
  } = useApp();

  const isApprovedByAmil = submissionStatus === 'disetujui' || applicationStep >= 3;

  if (!isApprovedByAmil) {
    return (
      <div className="taste-enter max-w-lg mx-auto my-8">
        <div className="taste-card bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111827]">Tahap 2M: Matching Terkunci</h3>
            <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
              Tahap alokasi bantuan modal hanya dapat dibuka setelah profil usaha dan berkas legalitas pada <strong>Tahap 1M: Mapping</strong> lengkap serta disetujui oleh Amil BAZNAS.
            </p>
          </div>
          <button
            onClick={() => setCurrent6MStep(1)}
            className="btn-primary text-xs mx-auto"
          >
            Buka Tahap 1M: Mapping
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = zakatPackage.reduce((acc, curr) => acc + curr.amount, 0);

  const steps = [
    {
      num: 1,
      title: 'Berkas Diajukan',
      desc: 'Formulir profil usaha dan 4 dokumen diterima sistem.',
    },
    {
      num: 2,
      title: 'Diverifikasi Amil',
      desc: applicationStep >= 2 ? 'Verifikasi administrasi & survei lapangan disetujui amil.' : 'Menunggu tahap verifikasi lapangan oleh amil.',
    },
    {
      num: 3,
      title: 'Disetujui Lembaga',
      desc: applicationStep >= 3 ? 'Surat Keputusan (SK) alokasi modal produktif telah diterbitkan.' : 'Menunggu penandatanganan SK pimpinan BAZNAS.',
    },
    {
      num: 4,
      title: 'Dana & Mesin Disalurkan',
      desc: applicationStep === 4 ? 'Paket mesin produksi dan transfer modal kerja telah diserahkan.' : 'Menunggu penjadwalan serah terima pengadaan mesin.',
    },
  ];

  return (
    <div className="space-y-6 taste-enter">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">2M: Matching (Alokasi Paket)</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Penyesuaian paket bantuan zakat produktif sesuai aspek usaha yang perlu intervensi.
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
        {/* Left Column: Paket Zakat & Kelengkapan */}
        <div className="md:col-span-6 space-y-5">
          {/* Paket Zakat Produktif Card */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Alokasi Paket Zakat Produktif
              </h3>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded">
                Paket Terarah
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {zakatPackage.map(item => (
                <div key={item.category} className="flex justify-between items-center py-1 border-b border-slate-50 text-slate-600">
                  <span>{item.category}</span>
                  <span className="font-bold text-slate-900 font-mono">
                    Rp{item.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
              <span>Total Nilai Bantuan</span>
              <span className="text-emerald-800 font-mono text-base font-extrabold">
                Rp{totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Rencana Penggunaan Dana */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Rencana Penggunaan Alokasi
            </h3>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-mono">
              {businessProfile.businessName 
                ? `Pengadaan peralatan produksi ${businessProfile.businessName} dan cadangan modal bahan baku operasional.` 
                : 'Alokasi pengadaan peralatan usaha produktif dan modal bahan baku operasional binaan.'}
            </p>
          </div>

          {/* Kelengkapan Dokumen */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Dokumen Persyaratan Matching
            </h3>
            <div className="space-y-2 text-xs">
              {documents.map(doc => {
                const isVerified = doc.status === 'terverifikasi';
                return (
                  <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isVerified ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span className="text-slate-800 font-medium">{doc.name}</span>
                    </div>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A4331]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1A4331]" />
                        <span>Terverifikasi</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sedang Ditinjau</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Status Pengajuan Stepper */}
        <div className="md:col-span-6 space-y-5">
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Status Alur Persetujuan
              </h3>
              <span className="text-xs font-mono text-[#6B7280] font-medium">
                Langkah {applicationStep} / 4
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {steps.map(s => {
                const isPassed = applicationStep >= s.num;
                const isCurrent = applicationStep === s.num;

                return (
                  <div key={s.num} className="flex items-start gap-3.5">
                    {/* Step Icon Indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isPassed
                          ? 'bg-[#1A4331] text-white shadow-2xs'
                          : 'bg-slate-200 text-[#6B7280]'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                    </div>

                    {/* Step Body */}
                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            isPassed ? 'text-[#111827]' : 'text-[#6B7280]'
                          }`}
                        >
                          {s.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] bg-[#1A4331] text-white px-2.5 py-0.5 rounded-full font-mono font-bold">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Action & Navigation */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              {applicationStep === 3 ? (
                <button
                  type="button"
                  onClick={disburseZakatPackage}
                  className="btn-primary w-full text-xs py-2.5 shadow-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konfirmasi Serah Terima Mesin & Akad Komitmen</span>
                </button>
              ) : applicationStep >= 4 ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Dana & Mesin Telah Disalurkan</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Paket bantuan zakat produktif telah diserahkan. Silakan lanjut ke modul pelatihan usaha.
                  </p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setCurrent6MStep(3)}
                className="btn-primary w-full text-xs py-2 bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center gap-1.5"
              >
                <span>Lanjut ke Tahap 3M (Mentoring)</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={simulateNextStep}
                className="taste-btn w-full text-[11px] text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 py-1"
              >
                <Play className="w-3 h-3 text-slate-400" />
                <span>Simulasikan Alur (Debug / Pengujian)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
