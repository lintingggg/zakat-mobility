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
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Dinyatakan Valid oleh Amil BAZNAS</span>
                  </div>
                ) : isRevised ? (
                  <div className="text-xs font-semibold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                    <span>Permintaan revisi/unggah ulang dikirim ke Mustahik</span>
                  </div>
                ) : item.type === 'laporan' && item.title.includes('Laporan') ? (
                  <button
                    onClick={() => verifyEvidence(item.id, true)}
                    className="taste-btn w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Verifikasi Laporan Keuangan
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => verifyEvidence(item.id, true)}
                      className="taste-btn py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl"
                    >
                      Verifikasi
                    </button>
                    <button
                      onClick={() => verifyEvidence(item.id, false)}
                      className="taste-btn py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200"
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
