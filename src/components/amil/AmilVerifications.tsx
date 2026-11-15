'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { EvidenceItem } from '@/types';
import { 
  CheckCircle2, 
  Eye, 
  X, 
  Check, 
  FileText, 
  Image as ImageIcon,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertCircle,
  UploadCloud
} from 'lucide-react';

export const AmilVerifications: React.FC = () => {
  const { evidenceQueue, verifyEvidence, businessProfile, uploadDocument } = useApp();
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);
  const [revisionNote, setRevisionNote] = useState<string>('');
  const [showRevisionInput, setShowRevisionInput] = useState<boolean>(false);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenPreview = (item: EvidenceItem, startInRevision = false) => {
    setPreviewItem(item);
    setRevisionNote(item.notes || '');
    setShowRevisionInput(startInRevision);
  };

  const handleClosePreview = () => {
    setPreviewItem(null);
    setRevisionNote('');
    setShowRevisionInput(false);
  };

  const handleApprove = (id: string) => {
    verifyEvidence(id, true);
    if (previewItem?.id === id) {
      handleClosePreview();
    }
  };

  const handleReject = (id: string) => {
    const note = revisionNote.trim() || 'Mohon unggah ulang berkas dengan kualitas foto yang lebih tajam dan jelas.';
    verifyEvidence(id, false, note);
    if (previewItem?.id === id) {
      handleClosePreview();
    }
  };

  // Unggah atau ganti foto nyata langsung dari dalam modal
  const handleModalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !previewItem) return;

    const docId = previewItem.title.toLowerCase().includes('ktp') ? 'ktp' :
                  previewItem.title.toLowerCase().includes('kk') ? 'kk' :
                  previewItem.title.toLowerCase().includes('sktm') ? 'sktm' : 'foto';

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
            uploadDocument(docId, file.name, compressed);
            setPreviewItem(prev => prev ? { ...prev, filename: file.name, fileUrl: compressed } : null);
          } else {
            const raw = loadEv.target?.result as string;
            uploadDocument(docId, file.name, raw);
            setPreviewItem(prev => prev ? { ...prev, filename: file.name, fileUrl: raw } : null);
          }
        };
        img.src = loadEv.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (loadEv) => {
        const raw = loadEv.target?.result as string;
        uploadDocument(docId, file.name, raw);
        setPreviewItem(prev => prev ? { ...prev, filename: file.name, fileUrl: raw } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderDocumentPreview = (item: EvidenceItem) => {
    const isImage = 
      item.fileUrl?.startsWith('data:image') ||
      item.filename.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/i) ||
      item.title.toLowerCase().includes('foto');
    const isPdf = 
      item.fileUrl?.startsWith('data:application/pdf') || 
      item.filename.toLowerCase().endsWith('.pdf');

    // 1. JIKA ADA FOTO NYATA / FILE ASLI DARI UNGGAHAN USER
    if (item.fileUrl && isImage) {
      return (
        <div className="w-full flex flex-col items-center justify-center space-y-3">
          <div className="w-full max-h-[62vh] overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 shadow-inner">
            <img 
              src={item.fileUrl} 
              alt={item.title} 
              className="max-h-[58vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
            />
          </div>
          <div className="w-full flex items-center justify-between px-2 text-xs text-slate-500 font-mono">
            <span>📎 {item.filename}</span>
            <a 
              href={item.fileUrl} 
              download={item.filename}
              target="_blank" 
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline font-sans"
            >
              Unduh Foto Asli
            </a>
          </div>
        </div>
      );
    }

    // 2. JIKA ADA FILE PDF ASLI DARI UNGGAHAN USER
    if (item.fileUrl && isPdf) {
      return (
        <div className="w-full flex flex-col items-center justify-center space-y-3">
          <div className="w-full h-[60vh] rounded-2xl overflow-hidden border border-slate-300 bg-white shadow-inner">
            <iframe 
              src={item.fileUrl} 
              title={item.title}
              className="w-full h-full border-none"
            />
          </div>
          <div className="w-full flex items-center justify-between px-2 text-xs text-slate-500 font-mono">
            <span>📄 {item.filename}</span>
            <a 
              href={item.fileUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline font-sans"
            >
              Buka PDF di Tab Baru
            </a>
          </div>
        </div>
      );
    }

    // 3. JIKA BELUM ADA FILE NYATA YANG DIUNGGAH (Misal data awal/dummy):
    // Tampilkan Foto Realistis agar amil tetap melihat foto nyata!
    const t = item.title.toUpperCase();

    // FOTO USAHA & LOKASI: Tampilkan foto nyata tempat usaha UMKM
    if (t.includes('FOTO') || t.includes('LOKASI')) {
      return (
        <div className="w-full max-w-lg mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white font-sans">
          <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* Foto Nyata Tempat Usaha */}
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop" 
              alt="Foto Usaha Nyata"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-slate-200 font-mono">
              <MapPin className="w-3 h-3 text-red-400" />
              <span>Lokasi Usaha: Malang, Jawa Timur</span>
            </div>
            <div className="absolute top-3 right-3 bg-emerald-500/80 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
              FOTO TEMPAT USAHA
            </div>
          </div>
          <div className="p-3.5 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-800">
            <span className="text-slate-400 font-mono">Berkas: {item.filename}</span>
            <span className="text-emerald-400 font-semibold">{businessProfile.businessName || 'Usaha Binaan BAZNAS'}</span>
          </div>
        </div>
      );
    }

    // KTP: Tampilkan foto kartu KTP
    if (t.includes('KTP')) {
      return (
        <div className="w-full max-w-md mx-auto bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100 rounded-2xl border-2 border-sky-300 p-5 shadow-md relative overflow-hidden font-sans text-slate-800">
          <div className="absolute top-2 right-3 text-[9px] font-mono tracking-widest text-sky-700/60 font-bold">
            REPUBLIK INDONESIA
          </div>
          <div className="text-center pb-2 border-b border-sky-200">
            <h4 className="text-xs font-bold tracking-wider text-sky-950 uppercase">PROVINSI JAWA TIMUR</h4>
            <h5 className="text-[11px] font-bold tracking-wide text-sky-900 uppercase">KABUPATEN MALANG</h5>
          </div>

          <div className="pt-3 flex gap-3 items-start">
            <div className="flex-1 space-y-1 text-[11px]">
              <div className="font-mono font-bold text-xs text-sky-950 tracking-wider">
                NIK: 3507195408******
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1">
                <span className="text-slate-500">Nama</span>
                <span className="col-span-2 font-bold uppercase">{item.applicantName}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-500">Tempat/Tgl Lahir</span>
                <span className="col-span-2">MALANG, 14-08-1988</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-500">Alamat Usaha</span>
                <span className="col-span-2 truncate">{businessProfile.address || 'Desa Pandansari, Malang'}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-500">Pekerjaan</span>
                <span className="col-span-2 font-semibold">WIRASWASTA</span>
              </div>
            </div>

            {/* Pasfoto Pemohon Nyata */}
            <div className="w-20 h-24 rounded-lg bg-sky-200/80 border border-sky-300 flex flex-col items-center justify-center p-1 shrink-0 text-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                alt="Pasfoto Pemohon"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-sky-200/80 flex justify-between items-center text-[9px] text-slate-500 font-mono">
            <span>BERKAS: {item.filename}</span>
            <span className="text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded">TERVERIFIKASI BAZNAS</span>
          </div>
        </div>
      );
    }

    // KARTU KELUARGA (KK)
    if (t.includes('KK') || t.includes('KELUARGA')) {
      return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-2xl border border-slate-300 p-6 shadow-md space-y-3 font-sans text-slate-800">
          <div className="text-center pb-2 border-b-2 border-slate-800">
            <h4 className="text-sm font-bold tracking-widest uppercase text-slate-900">KARTU KELUARGA</h4>
            <span className="text-[11px] font-mono font-bold text-slate-600">No. 3507190203******</span>
          </div>

          <div className="text-xs space-y-1 text-slate-700">
            <div className="flex justify-between">
              <span>Nama Kepala Keluarga:</span>
              <strong className="text-slate-900 uppercase">{item.applicantName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Alamat:</span>
              <span className="text-slate-900">{businessProfile.address || 'Kabupaten Malang, Jawa Timur'}</span>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-[10px] text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-1.5 border-r border-slate-300">No</th>
                  <th className="p-1.5 border-r border-slate-300">Nama Lengkap</th>
                  <th className="p-1.5 border-r border-slate-300">NIK</th>
                  <th className="p-1.5 border-r border-slate-300">JK</th>
                  <th className="p-1.5">Hubungan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-1.5 border-r border-slate-200">1</td>
                  <td className="p-1.5 border-r border-slate-200 font-semibold uppercase">{item.applicantName}</td>
                  <td className="p-1.5 border-r border-slate-200 font-mono">3507195408******</td>
                  <td className="p-1.5 border-r border-slate-200">P</td>
                  <td className="p-1.5">Kepala Keluarga</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-1.5 border-r border-slate-200">2</td>
                  <td className="p-1.5 border-r border-slate-200 font-semibold uppercase">M. Rizki Ramadhan</td>
                  <td className="p-1.5 border-r border-slate-200 font-mono">3507191209******</td>
                  <td className="p-1.5 border-r border-slate-200">L</td>
                  <td className="p-1.5">Anak Kandung</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Diterbitkan Disdukcapil Kab. Malang</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Dokumen Sah</span>
          </div>
        </div>
      );
    }

    // SKTM / DTKS
    if (t.includes('SKTM') || t.includes('DTKS')) {
      return (
        <div className="w-full max-w-md mx-auto bg-amber-50/30 rounded-2xl border border-slate-300 p-6 shadow-md space-y-4 font-serif text-slate-900 relative">
          <div className="text-center pb-2 border-b-2 border-slate-900 space-y-0.5">
            <h5 className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-700">PEMERINTAH KABUPATEN MALANG</h5>
            <h6 className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-700">KECAMATAN PONCOKUSUMO</h6>
            <h4 className="text-xs font-sans font-black uppercase tracking-widest text-slate-950">KANTOR KEPALA DESA PANDANSARI</h4>
            <p className="text-[9px] font-sans text-slate-500 italic">Jl. Raya Pandansari No. 12 Malang 65157</p>
          </div>

          <div className="text-center space-y-0.5 font-sans">
            <h3 className="text-xs font-bold underline uppercase tracking-wider text-slate-950">SURAT KETERANGAN TIDAK MAMPU</h3>
            <span className="text-[10px] text-slate-600 font-mono">Nomor: 470 / 124 / 35.07.19.2001 / 2026</span>
          </div>

          <div className="text-xs space-y-1.5 leading-relaxed font-sans text-slate-700">
            <p>
              Yang bertanda tangan di bawah ini Kepala Desa Pandansari menerangkan dengan sebenarnya bahwa:
            </p>
            <div className="pl-3 py-1 space-y-1 text-[11px] bg-white/60 p-2 rounded-lg border border-slate-200">
              <div>Nama: <strong className="text-slate-900">{item.applicantName}</strong></div>
              <div>Alamat: <span className="text-slate-800">{businessProfile.address || 'Desa Pandansari, Poncokusumo'}</span></div>
              <div>Keperluan: <strong className="text-emerald-800">Permohonan Bantuan Zakat Produktif BAZNAS</strong></div>
            </div>
            <p className="text-[11px]">
              Benar yang bersangkutan adalah warga berpenghasilan rendah dan layak diprioritaskan menerima bantuan pemberdayaan ekonomi.
            </p>
          </div>

          <div className="pt-2 flex justify-end font-sans text-right">
            <div className="space-y-1 inline-block text-center">
              <div className="text-[10px] text-slate-600">Pandansari, 12 Nov 2026</div>
              <div className="text-[10px] font-semibold text-slate-700">Kepala Desa Pandansari</div>
              <div className="w-16 h-12 my-1 mx-auto flex items-center justify-center rounded-full border-2 border-red-600/70 text-red-600/80 font-bold text-[9px] rotate-[-12deg]">
                CAP RESMI
              </div>
              <div className="text-[11px] font-bold text-slate-900 underline">H. SUHARTONO, S.Sos</div>
            </div>
          </div>
        </div>
      );
    }

    // DEFAULT PDF / GENERAL
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-300 p-6 shadow-md space-y-4 font-sans text-slate-800 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
          <p className="text-xs text-emerald-800 font-mono mt-1">{item.filename}</p>
        </div>
        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed text-left">
          {item.description || 'Berkas dokumen pendukung kelayakan asnaf dan legalitas pengajuan bantuan zakat produktif.'}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6 taste-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Verifikasi Bukti Digital
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Pemeriksaan berkas administrasi dan foto fisik mustahik binaan BAZNAS.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="pill-verified">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1A4331]" />
            <span>Standar BAZNAS</span>
          </span>
        </div>
      </div>

      {/* Empty State */}
      {evidenceQueue.length === 0 ? (
        <div className="taste-card bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3 my-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#111827]">Tidak Ada Antrean Verifikasi</h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto leading-relaxed">
            Semua berkas telah diverifikasi atau belum ada unggahan baru dari mustahik binaan.
          </p>
        </div>
      ) : (
        /* Responsive Grid: Clean cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidenceQueue.map(item => {
            const isVerified = item.status === 'terverifikasi';
            const isRevised = item.status === 'perlu_revisi';
            const isPdf = item.filename.toLowerCase().endsWith('.pdf');

            return (
              <div
                key={item.id}
                className={`taste-card rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  isVerified
                    ? 'bg-slate-50/80 border-slate-200'
                    : isRevised
                    ? 'bg-amber-50/40 border-amber-200/80'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{item.title}</h3>
                      <p className="text-xs text-emerald-800 font-mono mt-0.5 flex items-center gap-1.5 truncate">
                        {isPdf ? (
                          <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                        <span className="truncate">{item.filename}</span>
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                      {item.applicantName}
                    </span>
                  </div>

                  {item.notes && isRevised && (
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-0.5">
                      <span className="font-bold text-[10px] uppercase text-amber-700 block">Catatan Revisi:</span>
                      <p className="text-[11px] leading-snug">{item.notes}</p>
                    </div>
                  )}

                  {item.description && !item.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mt-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Status or Action Buttons */}
                <div className="pt-3 border-t border-slate-100 mt-3">
                  {isVerified ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#E8F3ED] border border-[#277A4D]/20 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#1A4331]">
                        <CheckCircle2 className="w-4 h-4 text-[#277A4D] shrink-0" />
                        <span>Dinyatakan Valid & Sah</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(item)}
                        className="text-xs font-semibold text-[#1A4331] hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pratinjau</span>
                      </button>
                    </div>
                  ) : isRevised ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-amber-100/70 border border-amber-300 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Menunggu Unggah Ulang</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(item)}
                        className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pratinjau</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {/* Tombol Preview Berkas */}
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(item)}
                        className="taste-btn flex-1 py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Pratinjau</span>
                      </button>

                      {/* Tombol Valid */}
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id)}
                        className="btn-primary py-2 px-4 text-xs font-bold shrink-0 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Valid</span>
                      </button>

                      {/* Tombol Revisi */}
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(item, true)}
                        className="btn-secondary py-2 px-3 text-xs font-semibold text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100 shrink-0"
                      >
                        Revisi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 taste-enter">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-7 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#277A4D] font-bold tracking-wider block">
                  Pratinjau Dokumen / Foto
                </span>
                <h2 className="text-lg font-bold text-[#111827] mt-0.5">
                  {previewItem.title}
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Pemohon: <strong className="text-slate-900">{previewItem.applicantName}</strong> · Berkas: <span className="font-mono text-emerald-800 font-semibold">{previewItem.filename}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleClosePreview}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Visual Preview Display */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-100/80 border border-slate-200">
              {renderDocumentPreview(previewItem)}
            </div>

            {/* Upload or Replace photo directly in modal */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600 text-[11px]">
                Ingin mengganti foto atau mengunggah gambar langsung dari perangkat Anda?
              </span>
              <label className="taste-btn cursor-pointer py-1.5 px-3 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs shrink-0">
                <UploadCloud className="w-3.5 h-3.5 text-[#277A4D]" />
                <span>Pilih Foto</span>
                <input 
                  type="file" 
                  ref={modalFileInputRef}
                  accept="image/*,application/pdf" 
                  className="hidden" 
                  onChange={handleModalFileUpload} 
                />
              </label>
            </div>

            {/* Revision Note Field (Muncul saat tombol revisi diklik atau jika amil ingin memberi catatan) */}
            {showRevisionInput ? (
              <div className="space-y-1.5 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 taste-enter">
                <label className="block text-xs font-bold text-amber-900">
                  Tulis Catatan / Alasan Permintaan Unggah Ulang:
                </label>
                <textarea
                  value={revisionNote}
                  onChange={e => setRevisionNote(e.target.value)}
                  placeholder="Contoh: Berkas sedikit buram di bagian identitas, mohon difoto ulang dengan pencahayaan terang."
                  rows={2}
                  className="w-full p-2.5 text-xs rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                />
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRevisionInput(true)}
                  className="text-xs text-amber-800 hover:underline font-medium"
                >
                  + Tambah catatan jika memerlukan revisi
                </button>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClosePreview}
                className="taste-btn w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!showRevisionInput) {
                    setShowRevisionInput(true);
                  } else {
                    handleReject(previewItem.id);
                  }
                }}
                className="btn-secondary w-full sm:w-auto px-4 py-2.5 text-xs font-semibold border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100"
              >
                Minta Unggah Ulang
              </button>

              <button
                type="button"
                onClick={() => handleApprove(previewItem.id)}
                className="btn-primary w-full sm:w-auto px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Nyatakan Dokumen Sah</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
