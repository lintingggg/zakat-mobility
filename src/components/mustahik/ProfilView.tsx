'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Building, MapPin, Mail, Award, LogOut } from 'lucide-react';

export const ProfilView: React.FC = () => {
  const { businessProfile, currentUser, logout } = useApp();

  const displayName = currentUser?.name || businessProfile.name;
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'MU';

  return (
    <div className="space-y-6 taste-enter">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Profil Binaan</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Identitas penerima manfaat dan data operasional usaha terdaftar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* User Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="taste-card bg-white rounded-2xl p-6 border border-slate-200 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#1A4331] text-white font-mono font-bold text-lg flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-base font-bold text-[#111827]">{displayName}</h3>
                <span className="pill-verified text-[10px]">
                  Mustahik
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{businessProfile.businessName || 'Profil usaha belum diisi'}</p>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                ID: ZM-{currentUser?.email ? currentUser.email.slice(0, 4).toUpperCase() : '2026'}-0891
              </span>
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
              Informasi Binaan & Pembina
            </h4>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Bidang Usaha</span>
                  <strong className="text-slate-900">
                    {businessProfile.businessType ? `${businessProfile.businessType} (${businessProfile.duration || 'Lama usaha belum dicatat'})` : 'Belum dilengkapi (Isi di 1M Mapping)'}
                  </strong>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Lokasi Produksi</span>
                  <strong className="text-slate-900">{businessProfile.address || 'Belum diisi'}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Kontak Email</span>
                  <strong className="text-slate-900 font-mono">{currentUser?.email || 'email@contoh.id'}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Lembaga Pembina</span>
                  <strong className="text-slate-900">BAZNAS Kabupaten Malang (Petugas: Ustadz Hilman)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
