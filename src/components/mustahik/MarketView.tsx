'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Clock, UploadCloud, Store, Share2, Users, ShoppingCart, Network } from 'lucide-react';

export const MarketView: React.FC = () => {
  const { marketChannels, uploadChannelProof, setMustahikTab, setCurrent6MStep } = useApp();

  const verifiedCount = marketChannels.filter(c => c.status === 'terverifikasi').length;

  const handleSimulateUpload = (channelId: string) => {
    uploadChannelProof(channelId, `bukti_${channelId}_${Date.now().toString().slice(-4)}.jpg`);
  };

  const getChannelIcon = (id: string) => {
    switch (id) {
      case 'c0':
        return <Store className="w-4 h-4 text-slate-700" />;
      case 'c1':
        return <Share2 className="w-4 h-4 text-slate-700" />;
      case 'c2':
        return <Users className="w-4 h-4 text-slate-700" />;
      case 'c3':
        return <Network className="w-4 h-4 text-slate-700" />;
      case 'c4':
        return <ShoppingCart className="w-4 h-4 text-slate-700" />;
      default:
        return <Store className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6 taste-enter">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">4M: Market (Saluran Pasar)</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Pencatatan kanal penjualan aktif. Ambang batas mandiri: minimal 3 saluran terverifikasi.
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

      {/* Saluran Aktif Counter Card */}
      <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-sm font-bold text-slate-900 block">Kanal Penjualan Aktif</span>
          <p className="text-xs text-slate-500 mt-0.5">
            Dihitung aktif setelah bukti transaksi atau etalase toko disetujui amil.
          </p>
        </div>
        <div className="flex items-baseline gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
          <span className="text-2xl font-mono font-extrabold text-slate-900">{verifiedCount}</span>
          <span className="text-xs text-slate-500 font-medium">/ target min 3 saluran</span>
        </div>
      </div>

      {/* Channels Grid: 2 or 3 Columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketChannels.map(channel => {
          const isVerified = channel.status === 'terverifikasi';
          const isWaiting = channel.status === 'menunggu';

          return (
            <div
              key={channel.id}
              className="taste-card bg-white rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      {getChannelIcon(channel.id)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{channel.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">Saluran Distribusi</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
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
                <p className="text-xs text-slate-600 leading-relaxed">
                  {channel.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                {channel.filename && (
                  <div className="text-[11px] text-emerald-800 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    📎 {channel.filename}
                  </div>
                )}

                {!isVerified && !isWaiting && (
                  <button
                    onClick={() => handleSimulateUpload(channel.id)}
                    className="taste-btn w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Unggah Bukti Transaksi
                  </button>
                )}

                {isWaiting && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Bukti diunggah. Menunggu verifikasi amil.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Factual Note: No marketing clichés */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 text-slate-600 text-xs leading-relaxed">
        <strong className="text-slate-900">Catatan Saluran Zakat Mobility:</strong> Platform ini memfasilitasi integrasi ke toko lokal, grup komunitas, dan akun media sosial yang telah berjalan. Verifikasi memerlukan bukti foto fisik atau tangkapan layar transaksi perdana.
      </div>

      {/* Sequential Next Step */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setCurrent6MStep(5)}
          className="taste-btn w-full py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center justify-center gap-2"
        >
          <span>Lanjut ke Tahap 5M (Monitoring)</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
