'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Shield, Building, Award, LogOut } from 'lucide-react';

export const AmilAccount: React.FC = () => {
  const { logout } = useApp();

  return (
    <div className="space-y-6 taste-enter">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Akun Lembaga Penyelenggara</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Identitas pengelola zakat produktif & petugas verifikator lapangan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* User Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="taste-card bg-white rounded-2xl p-6 border border-slate-200 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-teal-900 text-teal-100 font-mono font-bold text-lg flex items-center justify-center">
              BZ
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Hilman Ramadhan</h3>
                <span className="text-[10px] bg-teal-50 text-teal-800 font-semibold px-2 py-0.5 rounded border border-teal-200">
                  Amil Verifikator
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">BAZNAS Kabupaten Malang</p>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">ID Petugas: AM-0812-MLG</span>
            </div>

            <button
              onClick={logout}
              className="taste-btn w-full py-2.5 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl border border-red-200 flex items-center justify-center gap-1.5 mt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar dari Akun
            </button>
          </div>
        </div>

        {/* Detail Info */}
        <div className="md:col-span-7 space-y-4">
          <div className="taste-card bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Legalitas & Kerangka Kerja
            </h4>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Lembaga Penyelenggara</span>
                  <strong className="text-slate-900">BAZNAS (Badan Amil Zakat Nasional) Kab. Malang</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Kerangka Intervensi</span>
                  <strong className="text-slate-900">Framework 6M (Mapping, Matching, Mentoring, Market, Monitoring, Moving Up)</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Dasar Hukum & Regulasi</span>
                  <strong className="text-slate-900">UU No. 23 Tahun 2011 tentang Pengelolaan Zakat & Regulasi BAZNAS</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
