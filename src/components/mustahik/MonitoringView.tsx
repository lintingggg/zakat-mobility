'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, CheckCircle2, UploadCloud, TrendingUp, Plus, Minus, Clock, Eye } from 'lucide-react';

export const MonitoringView: React.FC = () => {
  const { monthlyReports, submitMonthlyReport, setMustahikTab, setCurrent6MStep } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<string>('Jul');
  const [omzet, setOmzet] = useState<number>(4200000);
  const [biaya, setBiaya] = useState<number>(2200000);
  const [tenagaKerja, setTenagaKerja] = useState<number>(1);
  const [notaFile, setNotaFile] = useState<string>('kuitansi_belanja.jpg');
  const [notaUrl, setNotaUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNotaFile(file.name);

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
            setNotaUrl(compressed);
          } else {
            setNotaUrl(loadEv.target?.result as string);
          }
        };
        img.src = loadEv.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (loadEv) => {
        setNotaUrl(loadEv.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitMonthlyReport({
        month: selectedMonth,
        year: 2026,
        revenue: omzet,
        expenses: biaya,
        netIncome: omzet - biaya,
        employeeCount: tenagaKerja,
        receiptFilename: notaFile,
        receiptUrl: notaUrl || undefined,
      });
      setSubmittedFeedback(true);
      setTimeout(() => setSubmittedFeedback(false), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayReports = monthlyReports.length > 0 ? monthlyReports : [
    { id: 'rep-mei', month: 'Mei', year: 2026, revenue: 3000000, expenses: 1500000, netIncome: 1500000, employeeCount: 1, status: 'terverifikasi' as const },
    { id: 'rep-jun', month: 'Jun', year: 2026, revenue: 3720000, expenses: 1800000, netIncome: 1920000, employeeCount: 1, status: 'terverifikasi' as const },
  ];

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
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">5M: Monitoring (Evaluasi Rutin)</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Pencatatan omzet kotor, beban operasional, dan bukti kuitansi belanja bulanan ke database Supabase.
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
        {/* Left Column: Tren Omzet Chart & Riwayat */}
        <div className="md:col-span-6 space-y-5">
          {/* Tren Omzet Visual Chart */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pertumbuhan Omzet Bulanan</h3>
                <p className="text-xs text-slate-500">Data riwayat tercatat di sistem pendampingan</p>
              </div>
              <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +24%
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-44 flex items-end justify-around gap-4 pt-6 pb-2 px-4 bg-slate-50 rounded-xl border border-slate-200">
              {displayReports.slice(-3).map((r, idx) => {
                const maxRev = 6000000;
                const barHeightPercent = Math.min(Math.round((r.revenue / maxRev) * 100), 100);
                const isLatest = idx === displayReports.slice(-3).length - 1;

                return (
                  <div key={r.id || idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[85px]">
                    <span className="text-[11px] text-slate-600 font-mono font-bold">
                      Rp{(r.revenue / 1000000).toFixed(1)}jt
                    </span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 relative ${
                        isLatest ? 'bg-[#1A4331]' : 'bg-emerald-700/60'
                      }`}
                      style={{ height: `${Math.max(barHeightPercent * 1.3, 24)}px` }}
                    >
                      {isLatest && (
                        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full" />
                      )}
                    </div>
                    <span className={`text-xs ${isLatest ? 'font-bold text-[#111827]' : 'font-medium text-slate-600'}`}>
                      {r.month} {isLatest ? '(Aktif)' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Riwayat Laporan Keuangan */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Riwayat Pembukuan Laporan
            </h3>
            <div className="space-y-2 text-xs">
              {displayReports.map(rep => (
                <div
                  key={rep.id}
                  className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rep.month} {rep.year}</span>
                      {rep.receiptUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewUrl(rep.receiptUrl || null)}
                          className="text-[10px] text-emerald-800 font-bold hover:underline flex items-center gap-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Nota</span>
                        </button>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                      Omzet: Rp{rep.revenue.toLocaleString('id-ID')} · Beban: Rp{rep.expenses.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      rep.status === 'terverifikasi'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {rep.status === 'terverifikasi' ? 'Terverifikasi' : 'Menunggu verifikasi'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Form Laporan Baru */}
        <div className="md:col-span-6 space-y-5">
          <form onSubmit={handleSubmit} className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Formulir Laporan Bulanan
              </h3>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="taste-input text-xs font-mono font-bold py-1 px-2.5 rounded-lg border-slate-200"
              >
                <option value="Mei">Mei 2026</option>
                <option value="Jun">Jun 2026</option>
                <option value="Jul">Jul 2026</option>
                <option value="Agu">Agu 2026</option>
                <option value="Sep">Sep 2026</option>
              </select>
            </div>

            {/* Input Omzet */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-700 font-semibold">Omzet Penjualan Kotor</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  Rp{omzet.toLocaleString('id-ID')}
                </span>
              </div>
              <input
                type="range"
                min="1000000"
                max="10000000"
                step="100000"
                value={omzet}
                onChange={e => setOmzet(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Input Biaya */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-700 font-semibold">Biaya Operasional & Bahan</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  Rp{biaya.toLocaleString('id-ID')}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="6000000"
                step="100000"
                value={biaya}
                onChange={e => setBiaya(Number(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Estimasi Laba Bersih */}
            <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-700 font-medium">Estimasi Laba Bersih:</span>
              <span className="font-mono text-base font-extrabold text-emerald-800">
                Rp{(omzet - biaya).toLocaleString('id-ID')}
              </span>
            </div>

            {/* Bukti Transaksi */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Bukti Nota Transaksi</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Diverifikasi Amil</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Foto nota belanja bahan baku atau kuitansi transaksi penjualan.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded truncate max-w-[190px]">
                  📎 {notaFile}
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="taste-btn text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Pilih File
                </button>
              </div>
            </div>

            {/* Counter Tenaga Kerja */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Jumlah Tenaga Kerja</span>
                <span className="text-[11px] text-slate-500">Pekerja aktif di luar pemilik usaha</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTenagaKerja(Math.max(1, tenagaKerja - 1))}
                  className="taste-btn w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center font-bold"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-900 min-w-5 text-center">
                  {tenagaKerja}
                </span>
                <button
                  type="button"
                  onClick={() => setTenagaKerja(tenagaKerja + 1)}
                  className="taste-btn w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {submittedFeedback && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Laporan finansial {selectedMonth} berhasil disimpan ke database.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Menyimpan ke Supabase...' : `Kirim Laporan ${selectedMonth} 2026`}
            </button>

            <button
              type="button"
              onClick={() => setCurrent6MStep(6)}
              className="btn-primary w-full text-xs py-2 bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center gap-1.5"
            >
              <span>Lanjut ke Tahap 6M (Moving Up)</span>
              <span>→</span>
            </button>
          </form>
        </div>
      </div>

      {/* Modal Preview Nota */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Bukti Nota Transaksi</span>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Tutup
              </button>
            </div>
            <div className="max-h-[60vh] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center p-2">
              <img src={previewUrl} alt="Nota transaksi" className="max-h-[55vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
