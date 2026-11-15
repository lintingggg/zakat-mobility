'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowDownRight, Clock } from 'lucide-react';

export const DanaView: React.FC = () => {
  const { applicationStep, zakatPackage, currentUser, businessProfile } = useApp();
  const isDisbursed = applicationStep === 4;
  const isApproved = applicationStep >= 3;

  const totalAmount = zakatPackage.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 taste-enter">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Alokasi & Penyaluran Dana</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Rincian penyaluran bantuan dana zakat produktif berbasis akuntabilitas syariah.
        </p>
      </div>

      {/* Responsive Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column: Balance & Pos Dana */}
        <div className="md:col-span-6 space-y-5">
          {/* Main Balance Card: Primary Dark Green #1A4331 per Guideline */}
          <div className="taste-card bg-[#1A4331] text-white rounded-3xl p-6 sm:p-7 shadow-sm">
            <span className="text-xs text-[#A3B8AD] font-semibold uppercase tracking-wider block">
              Total Dana Bantuan Produktif
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 mb-3 text-white">
              Rp {isDisbursed ? '7.000.000' : isApproved ? '7.000.000' : '3.500.000'}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-3 py-1 rounded-full font-semibold border ${
                isDisbursed
                  ? 'bg-white/20 text-white border-white/30'
                  : isApproved
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400'
                  : 'bg-amber-400/20 text-amber-200 border-amber-300'
              }`}>
                Status: {isDisbursed ? 'Disalurkan Penuh' : isApproved ? 'Siap Cair' : 'Menunggu Persetujuan Amil'}
              </span>
            </div>
          </div>

          {/* Rincian Pos Dana */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Rincian Pos Alokasi Dana Zakat
            </h3>
            <div className="space-y-3 text-xs">
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
              <span>Total Alokasi</span>
              <span className="text-emerald-800 font-mono text-base font-extrabold">
                Rp{totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Log Penyaluran */}
        <div className="md:col-span-6 space-y-5">
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Riwayat & Bukti Penyaluran
            </h3>
            {isDisbursed ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Pengadaan Mesin Pipil</span>
                      <span className="text-emerald-800 font-mono font-bold">+Rp3.000.000</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Penyerahan fisik mesin oleh petugas BAZNAS</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">Berita Acara No. BA-812/XI/2026</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Transfer Modal Bahan Baku</span>
                      <span className="text-emerald-800 font-mono font-bold">+Rp3.000.000</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Cadangan bahan baku operasional 3 bulan</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">Rekening BSI ***412 a.n. {currentUser?.name || businessProfile.name}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="font-medium text-slate-600">Belum ada penyaluran dana.</p>
                <p className="text-[11px] max-w-xs mx-auto text-slate-400">
                  Penyaluran alat dan dana kerja akan dicatat di sini secara otomatis setelah SK ditandatangani amil.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
