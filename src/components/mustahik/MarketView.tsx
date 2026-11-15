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
        return <Store className="w-4 h-4 text-[#1A4331]" />;
      case 'c1':
        return <Share2 className="w-4 h-4 text-[#1A4331]" />;
      case 'c2':
        return <Users className="w-4 h-4 text-[#1A4331]" />;
      case 'c3':
        return <Network className="w-4 h-4 text-[#1A4331]" />;
      case 'c4':
        return <ShoppingCart className="w-4 h-4 text-[#1A4331]" />;
      default:
        return <Store className="w-4 h-4 text-[#1A4331]" />;
    }
  };

  return (
    <div className="space-y-6 taste-enter">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">4M: Market (Saluran Pasar)</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Pencatatan kanal penjualan aktif. Ambang batas mandiri: minimal 3 saluran terverifikasi.
          </p>
        </div>
        <button
          onClick={() => setMustahikTab('beranda')}
          className="taste-btn px-3 py-1.5 text-[#6B7280] hover:text-[#111827] rounded-full hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Saluran Aktif Counter Card */}
      <div className="taste-card bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-sm font-bold text-[#111827] block">Kanal Penjualan Aktif</span>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Dihitung aktif setelah bukti transaksi atau etalase toko disetujui amil.
          </p>
        </div>
        <div className="flex items-baseline gap-2 bg-[#E8F3ED] px-4 py-2 rounded-xl border border-[#277A4D]/20 self-start sm:self-auto">
          <span className="text-2xl font-mono font-extrabold text-[#1A4331]">{verifiedCount}</span>
          <span className="text-xs text-[#277A4D] font-medium">/ target min 3 saluran</span>
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
              className="taste-card bg-white rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#E8F3ED] flex items-center justify-center shrink-0">
                      {getChannelIcon(channel.id)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#111827]">{channel.name}</h3>
                      <span className="text-[10px] text-[#6B7280]">Saluran Pemasaran</span>
                    </div>
                  </div>

                  <span
                    className={
                      isVerified
                        ? 'pill-verified shrink-0'
                        : isWaiting
                        ? 'pill-waiting shrink-0'
                        : 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0'
                    }
                  >
                    {isVerified ? 'Aktif' : isWaiting ? 'Menunggu' : 'Belum aktif'}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">{channel.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                {channel.filename && (
                  <div className="text-[11px] text-[#1A4331] font-mono bg-[#E8F3ED] px-2 py-1 rounded-lg border border-[#277A4D]/20">
                    📎 {channel.filename}
                  </div>
                )}

                {!isVerified && !isWaiting && (
                  <button
                    onClick={() => handleSimulateUpload(channel.id)}
                    className="btn-secondary w-full text-xs py-2"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Unggah Bukti Transaksi</span>
                  </button>
                )}

                {isWaiting && (
                  <div className="text-[11px] text-[#B45309] bg-[#FEF3C7] px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Bukti tersimpan. Menunggu verifikasi amil.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sequential Next Step */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setCurrent6MStep(5)}
          className="btn-secondary w-full text-xs text-[#111827] border-slate-300 hover:bg-slate-100"
        >
          <span>Lanjut ke Tahap 5M (Monitoring)</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
