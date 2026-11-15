'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const AmilVerifications: React.FC = () => {
  const { evidenceQueue, verifyEvidence } = useApp();

  return (
    <div className="space-y-6 taste-enter">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Verifikasi Bukti Digital</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Pemeriksaan berkas administrasi dan nota transaksi. Hanya bukti valid yang dihitung pada tolok ukur kemandirian.
        </p>
      </div>

      {/* Responsive Grid: 2 columns on tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidenceQueue.map(item => {
          const isVerified = item.status === 'terverifikasi';
          const isRevised = item.status === 'perlu_revisi';

          return (
            <div
              key={item.id}
              className={`taste-card rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                isVerified
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-emerald-800 font-mono mt-0.5">
                      📎 {item.filename}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    {item.applicantName}
                  </span>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Status or Action Buttons */}
              <div className="pt-2">
                {isVerified ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1A4331] bg-[#E8F3ED] p-2.5 rounded-xl border border-[#277A4D]/20">
                    <CheckCircle2 className="w-4 h-4 text-[#277A4D] shrink-0" />
                    <span>Dinyatakan Valid oleh Amil BAZNAS</span>
                  </div>
                ) : isRevised ? (
                  <div className="text-xs font-semibold text-[#B45309] bg-[#FEF3C7] p-2.5 rounded-xl border border-amber-200">
                    <span>Permintaan revisi/unggah ulang dikirim ke Mustahik</span>
                  </div>
                ) : item.type === 'laporan' && item.title.includes('Laporan') ? (
                  <button
                    onClick={() => verifyEvidence(item.id, true)}
                    className="btn-primary w-full text-xs py-2.5"
                  >
                    Verifikasi Laporan Keuangan
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => verifyEvidence(item.id, true)}
                      className="btn-primary text-xs py-2"
                    >
                      Verifikasi
                    </button>
                    <button
                      onClick={() => verifyEvidence(item.id, false)}
                      className="btn-secondary text-xs py-2 text-[#6B7280] border-slate-300 hover:bg-slate-100"
                    >
                      Minta Unggah Ulang
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
