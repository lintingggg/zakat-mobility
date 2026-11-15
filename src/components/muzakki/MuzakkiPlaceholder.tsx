'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  HeartHandshake, 
  ArrowLeft, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Store, 
  Award, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { fetchMuzakkiTransparencyData } from '@/services/zakatService';

export const MuzakkiPlaceholder: React.FC = () => {
  const { 
    setRole, 
    businessProfile, 
    current6MStep, 
    applicationStep, 
    monthlyReports,
    mentoringModules,
    marketChannels,
    independenceIndicators,
  } = useApp();

  const [dbData, setDbData] = useState<{ mappings: any[]; reports: any[] }>({ mappings: [], reports: [] });
  const [activeTab, setActiveTab] = useState<'transparansi' | 'riwayat'>('transparansi');

  useEffect(() => {
    fetchMuzakkiTransparencyData().then(data => {
      setDbData(data);
    });
  }, []);

  const metCount = independenceIndicators.filter(i => i.isMet).length;
  const verifiedModulesCount = mentoringModules.filter(m => m.status === 'terverifikasi').length;
  const verifiedChannelsCount = marketChannels.filter(c => c.status === 'terverifikasi').length;

  // Nama mustahik binaan
  const mustahikName = businessProfile.name || 'Faizah Elysia';
  const businessName = businessProfile.businessName || 'Keripik Jagung Renyah';
  const totalDanaDisalurkan = 3500000;

  const displayReports = monthlyReports.length > 0 ? monthlyReports : [
    { id: 'rep-mei', month: 'Mei', year: 2026, revenue: 3000000, expenses: 1500000, netIncome: 1500000, employeeCount: 1, status: 'terverifikasi' as const },
    { id: 'rep-jun', month: 'Jun', year: 2026, revenue: 3720000, expenses: 1800000, netIncome: 1920000, employeeCount: 1, status: 'terverifikasi' as const },
    { id: 'rep-jul', month: 'Jul', year: 2026, revenue: 4200000, expenses: 2000000, netIncome: 2200000, employeeCount: 2, status: 'terverifikasi' as const },
  ];

  const steps6M = [
    { num: 1, name: '1M: Mapping', desc: 'Pemetaan profil & legalitas usaha binaan', isDone: true },
    { num: 2, name: '2M: Matching', desc: 'Alokasi paket mesin produksi & modal kerja Rp3,5 jt', isDone: applicationStep >= 3 },
    { num: 3, name: '3M: Mentoring', desc: `${verifiedModulesCount}/6 modul pelatihan bisnis terselesaikan`, isDone: verifiedModulesCount >= 4 },
    { num: 4, name: '4M: Market', desc: `${verifiedChannelsCount} saluran pasar aktif terhubung`, isDone: verifiedChannelsCount >= 2 },
    { num: 5, name: '5M: Monitoring', desc: `${displayReports.length} bulan pembukuan finansial terverifikasi`, isDone: displayReports.length >= 2 },
    { num: 6, name: '6M: Moving Up', desc: `${metCount}/6 indikator kemandirian BAZNAS tercapai`, isDone: metCount >= 5 },
  ];

  return (
    <div className="space-y-6 taste-enter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
              Transparansi Terbuka Real-Time
            </span>
            <span className="text-xs text-slate-400 font-mono">No: BAZNAS-MLG/ZP/2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dasbor Transparansi Donatur (Muzakki)
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Pantau langsung dampak produktif dari dana zakat yang Anda salurkan hingga mustahik mandiri.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setRole('mustahik')}
            className="taste-btn px-3 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lihat Sisi Mustahik</span>
          </button>
          <button
            onClick={() => setRole('amil')}
            className="taste-btn px-3 py-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 text-xs font-bold border border-emerald-200"
          >
            <span>Sisi Amil</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="taste-card bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Zakat Tersalurkan</span>
          <span className="text-xl sm:text-2xl font-extrabold text-[#1A4331] font-mono block">
            Rp{totalDanaDisalurkan.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>100% dialokasikan</span>
          </span>
        </div>

        <div className="taste-card bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Mustahik Didanai</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono block">
            1 Usaha
          </span>
          <span className="text-[11px] text-slate-500 truncate block">
            {mustahikName} ({businessName})
          </span>
        </div>

        <div className="taste-card bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Pertumbuhan Omzet</span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-800 font-mono block">
            +40%
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            Rp3,0 jt → Rp4,2 jt/bln
          </span>
        </div>

        <div className="taste-card bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Status Kemandirian</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono block">
            {metCount} / 6
          </span>
          <span className="text-[11px] text-slate-500">
            {metCount >= 5 ? '🎓 Lulus Menjadi Muzakki' : 'Menuju Had Kifayah'}
          </span>
        </div>
      </div>

      {/* Responsive 2 Columns: Profil Usaha & Grafik Pertumbuhan */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column: Profil Mustahik & Paket */}
        <div className="md:col-span-6 space-y-5">
          {/* Usaha Binaan Card */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#1A4331]" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Profil Usaha Binaan
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                Terverifikasi Lapangan
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                <span>Nama Pengelola:</span>
                <strong className="text-slate-900">{mustahikName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                <span>Unit Usaha:</span>
                <strong className="text-slate-900">{businessName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                <span>Lokasi Binaan:</span>
                <strong className="text-slate-900">Kabupaten Malang, Jawa Timur</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                <span>Alokasi Bantuan:</span>
                <strong className="text-emerald-800 font-mono">Rp3.500.000</strong>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Wujud Bantuan:</span>
                <span className="text-slate-800 text-right font-medium">
                  Mesin produksi, bahan baku & pelatihan
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Legalitas & Validitas Dokumen Terverifikasi</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                KTP, Kartu Keluarga, dan SKTM/DTKS telah diperiksa dan disahkan oleh Amil Verifikator BAZNAS.
              </p>
            </div>
          </div>

          {/* Akad Wakalah & Pernyataan Syariah */}
          <div className="taste-card bg-[#1A4331] text-white rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-300" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-100 font-mono">
                Sertifikat Penyaluran Syariah
              </h3>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Dana zakat disalurkan dengan akad zakat produktif pemberdayaan (asnaf Miskin/Fakir). Binaan didampingi secara intensif melalui alur 6M untuk mengubah mustahik menjadi muzakki (zakat mobility).
            </p>
            <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-200">
              <span>Audit BAZNAS: Sah & Terbuka</span>
              <span>ISO 9001:2015</span>
            </div>
          </div>
        </div>

        {/* Right Column: Grafik Omzet & Stepper 6M */}
        <div className="md:col-span-6 space-y-5">
          {/* Grafik Omzet */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Performa Finansial Binaan</h3>
                <p className="text-xs text-slate-500">Omzet kotor & laba bersih per bulan</p>
              </div>
              <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Tren Positif
              </span>
            </div>

            {/* Visual Bars */}
            <div className="h-44 flex items-end justify-around gap-4 pt-6 pb-2 px-4 bg-slate-50 rounded-xl border border-slate-200">
              {displayReports.slice(-3).map((r, idx) => {
                const maxRev = 6000000;
                const barHeightPercent = Math.min(Math.round((r.revenue / maxRev) * 100), 100);

                return (
                  <div key={r.id || idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[85px]">
                    <span className="text-[11px] text-slate-600 font-mono font-bold">
                      Rp{(r.revenue / 1000000).toFixed(1)}jt
                    </span>
                    <div
                      className="w-full bg-[#1A4331] rounded-t-lg transition-all duration-500"
                      style={{ height: `${Math.max(barHeightPercent * 1.3, 24)}px` }}
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      {r.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-600 pt-1">
              <span>Ambang Batas Had Kifayah:</span>
              <strong className="text-slate-900 font-mono">Rp2.440.000 / bulan</strong>
            </div>
          </div>

          {/* Stepper 6M */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Jejak Transformasi 6M Mustahik
            </h3>

            <div className="space-y-2.5 pt-1">
              {steps6M.map(s => (
                <div key={s.num} className="flex items-start gap-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                    s.isDone ? 'bg-[#1A4331] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${s.isDone ? 'text-slate-900' : 'text-slate-500'}`}>
                        {s.name}
                      </span>
                      {s.isDone && (
                        <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                          Lolos ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
