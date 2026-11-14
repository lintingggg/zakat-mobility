'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, CheckCircle2, UploadCloud, TrendingUp, Plus, Minus } from 'lucide-react';

export const MonitoringView: React.FC = () => {
  const { monthlyReports, submitMonthlyReport, setMustahikTab, setCurrent6MStep } = useApp();

  const [omzet, setOmzet] = useState<number>(4200000);
  const [biaya, setBiaya] = useState<number>(2200000);
  const [tenagaKerja, setTenagaKerja] = useState<number>(1);
  const [notaFile, setNotaFile] = useState<string>('bukti_nota.jpg');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitMonthlyReport({
        month: 'Jul',
        year: 2026,
        revenue: omzet,
        expenses: biaya,
        netIncome: omzet - biaya,
        employeeCount: tenagaKerja,
        receiptFilename: notaFile,
      });
      setIsSubmitting(false);
      setSubmittedFeedback(true);
      setTimeout(() => setSubmittedFeedback(false), 3000);
    }, 400);
  };

  return (
    <div className="space-y-6 taste-enter">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">5M: Monitoring (Evaluasi Rutin)</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Pencatatan omzet kotor, beban operasional, dan bukti kuitansi belanja bulanan.
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
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pertumbuhan Omzet Bulanan</h3>
                <p className="text-xs text-slate-500">Performa 3 periode pendampingan</p>
              </div>
              <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +24%
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-44 flex items-end justify-around gap-6 pt-6 pb-2 px-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                <span className="text-xs text-slate-500 font-mono">Rp3.0 jt</span>
                <div className="w-full bg-slate-300 rounded-t-lg h-24 transition-all" />
                <span className="text-xs font-semibold text-slate-700">Mei</span>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                <span className="text-xs text-slate-500 font-mono">Rp3.72 jt</span>
                <div className="w-full bg-emerald-700/70 rounded-t-lg h-32 transition-all" />
                <span className="text-xs font-semibold text-slate-700">Jun</span>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                <span className="text-xs text-emerald-900 font-mono font-bold">Rp4.2 jt</span>
                <div className="w-full bg-emerald-800 rounded-t-lg h-40 transition-all relative">
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                </div>
                <span className="text-xs font-bold text-emerald-950">Jul (Baru)</span>
              </div>
            </div>
          </div>

          {/* Riwayat Laporan Keuangan */}
          <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Riwayat Pembukuan Laporan
            </h3>
            <div className="space-y-2 text-xs">
              {monthlyReports.map(rep => (
                <div
                  key={rep.id}
                  className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div>
                    <span className="font-bold text-slate-900">{rep.month} {rep.year}</span>
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
          <form onSubmit={handleSubmit} className="taste-card bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Formulir Laporan Periode Jul 2026
            </h3>

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
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                  Menunggu verifikasi
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Foto nota pembelian jagung atau kuitansi penjualan.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  📎 {notaFile}
                </span>
                <button
                  type="button"
                  onClick={() => setNotaFile(`nota_${Date.now().toString().slice(-4)}.jpg`)}
                  className="taste-btn text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Ganti Berkas
                </button>
              </div>
            </div>

            {/* Counter Tenaga Kerja */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Jumlah Tenaga Kerja</span>
                <span className="text-[11px] text-slate-500">Pekerja aktif di luar pemilik</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTenagaKerja(Math.max(1, tenagaKerja - 1))}
                  className="taste-btn w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-900 min-w-5 text-center">
                  {tenagaKerja}
                </span>
                <button
                  type="button"
                  onClick={() => setTenagaKerja(tenagaKerja + 1)}
                  className="taste-btn w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {submittedFeedback && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Laporan finansial berhasil dikirim ke antrean amil.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="taste-btn w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Laporan Jul 2026'}
            </button>

            <button
              type="button"
              onClick={() => setCurrent6MStep(6)}
              className="taste-btn w-full py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Tahap 6M (Moving Up)</span>
              <span>→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
