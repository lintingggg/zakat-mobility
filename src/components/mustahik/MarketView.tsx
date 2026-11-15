'use client';

import React, { useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Check, Clock, UploadCloud, Store, Share2, Users, ShoppingCart, Network, Eye } from 'lucide-react';

export const MarketView: React.FC = () => {
  const { marketChannels, uploadChannelProof, setMustahikTab, setCurrent6MStep } = useApp();

  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const verifiedCount = marketChannels.filter(c => c.status === 'terverifikasi').length;

  const handleTriggerUpload = (channelId: string) => {
    setActiveChannelId(channelId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChannelId) return;

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
            uploadChannelProof(activeChannelId, file.name, compressed);
          } else {
            const raw = loadEv.target?.result as string;
            uploadChannelProof(activeChannelId, file.name, raw);
          }
        };
        img.src = loadEv.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (loadEv) => {
        const raw = loadEv.target?.result as string;
        uploadChannelProof(activeChannelId, file.name, raw);
      };
      reader.readAsDataURL(file);
    }
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">4M: Market (Saluran Pasar)</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Pencatatan kanal penjualan aktif. Ambang batas mandiri: minimal 3 saluran terverifikasi.
          </p>
        </div>
        <button
          onClick={() => setMustahikTab('beranda')}
          className="taste-btn px-3 py-1.5 text-[#6B7280] hover:text-[#111827] rounded-lg hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold border border-slate-200"
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

      {/* Channels Grid */}
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

                  <div>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A4331]">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Aktif</span>
                      </span>
                    ) : isWaiting ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sedang Ditinjau</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-normal text-slate-400">
                        Belum Terhubung
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">{channel.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                {channel.filename && (
                  <div className="flex items-center justify-between text-[11px] text-[#1A4331] font-mono bg-[#E8F3ED] px-2 py-1 rounded-lg border border-[#277A4D]/20">
                    <span className="truncate max-w-[170px]">📎 {channel.filename}</span>
                    {channel.fileUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewUrl(channel.fileUrl || null)}
                        className="text-emerald-800 hover:underline flex items-center gap-0.5 text-[10px] font-sans font-bold"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lihat</span>
                      </button>
                    )}
                  </div>
                )}

                {!isVerified && !isWaiting && (
                  <button
                    type="button"
                    onClick={() => handleTriggerUpload(channel.id)}
                    className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Unggah Bukti Transaksi</span>
                  </button>
                )}

                {isWaiting && (
                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>Menunggu verifikasi amil</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTriggerUpload(channel.id)}
                      className="text-emerald-800 text-[10px] font-bold hover:underline"
                    >
                      Ganti
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Preview Bukti */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Bukti Saluran Pasar</span>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Tutup
              </button>
            </div>
            <div className="max-h-[60vh] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center p-2">
              <img src={previewUrl} alt="Bukti pasar" className="max-h-[55vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Sequential Next Step */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setCurrent6MStep(5)}
          className="btn-primary w-full text-xs py-2 bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center gap-1.5"
        >
          <span>Lanjut ke Tahap 5M (Monitoring)</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
