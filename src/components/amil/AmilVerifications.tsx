'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { EvidenceItem } from '@/types';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Eye, 
  X, 
  Check, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  FileCheck2,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

interface VerificationCriteria {
  fullName: string;
  category: string;
  guide: string;
  checkpoints: string[];
}

const getCriteria = (title: string, type: string): VerificationCriteria => {
  const t = title.toUpperCase();
  if (t.includes('KTP')) {
    return {
      fullName: 'Kartu Tanda Penduduk (KTP)',
      category: 'Identitas Diri Pemohon',
      guide: 'Pastikan NIK 16 digit dan identitas pemohon sesuai dengan nama akun pendaftar.',
      checkpoints: [
        'NIK 16 digit terbaca tajam tanpa buram, pantulan cahaya, atau editan.',
        'Nama lengkap dan tanggal lahir sesuai dengan profil pendaftar akun BAZNAS.',
        'Foto wajah pemohon jelas dan 4 sudut fisik KTP terlihat utuh.',
      ],
    };
  }
  if (t.includes('KK') || t.includes('KELUARGA')) {
    return {
      fullName: 'Kartu Keluarga (KK)',
      category: 'Legalitas Susunan Keluarga',
      guide: 'Pastikan pemohon terdaftar sah dalam susunan anggota keluarga dan berkas resmi.',
      checkpoints: [
        'Nomor KK dan nama Kepala Keluarga terbaca jelas.',
        'Nama pemohon tercantum resmi dalam daftar susunan anggota keluarga.',
        'Memiliki tanda tangan basah pejabat Disdukcapil atau barcode QR resmi yang sah.',
      ],
    };
  }
  if (t.includes('SKTM') || t.includes('DTKS')) {
    return {
      fullName: 'Surat Keterangan Tidak Mampu (SKTM) / DTKS',
      category: 'Kelayakan Asnaf Mustahik',
      guide: 'Pastikan surat diterbitkan resmi oleh Kelurahan/Desa setempat dengan masa berlaku aktif.',
      checkpoints: [
        'Diterbitkan resmi oleh Kepala Desa / Lurah domisili pemohon.',
        'Tanggal penerbitan masih aktif (berlaku maksimal 6-12 bulan terakhir).',
        'Menerangkan pemohon berhak menerima bantuan asnaf zakat produktif.',
      ],
    };
  }
  if (t.includes('FOTO') || t.includes('LOKASI')) {
    return {
      fullName: 'Foto Fisik Tempat Usaha & Produk',
      category: 'Verifikasi Operasional Nyata',
      guide: 'Pastikan foto merupakan dokumentasi fisik tempat usaha riil, bukan foto comotan internet.',
      checkpoints: [
        'Menampilkan fisik tempat produksi atau rombong/lapak dagang nyata.',
        'Terlihat produk jadi, etalase, atau stok bahan baku operasional.',
        'Kondisi lokasi sinkron dengan alamat domisili usaha yang diajukan.',
      ],
    };
  }
  if (type === 'laporan' || t.includes('LAPORAN') || t.includes('NOTA')) {
    return {
      fullName: 'Bukti Nota & Kuitansi Finansial',
      category: 'Akuntabilitas Keuangan 5M',
      guide: 'Pastikan bukti transaksi nyata dan relevan dengan pencatatan omzet bulanan.',
      checkpoints: [
        'Tanggal nota transaksi sesuai dengan bulan periode pelaporan.',
        'Nominal belanja/penjualan wajar dan sesuai dengan catatan omzet.',
        'Nota transaksi sah mencantumkan rincian barang dan stempel/tanda tangan.',
      ],
    };
  }
  return {
    fullName: title,
    category: 'Dokumen Persyaratan Program',
    guide: 'Periksa kesesuaian berkas lampiran dengan standar program pemberdayaan 6M BAZNAS.',
    checkpoints: [
      'Format dan isi berkas dapat terbaca jelas tanpa kerusakan file.',
      'Kesesuaian berkas dengan tahapan pendampingan terkait.',
      'Keabsahan data pendukung pemohon memenuhi kriteria asnaf.',
    ],
  };
};

export const AmilVerifications: React.FC = () => {
  const { evidenceQueue, verifyEvidence, businessProfile } = useApp();
  const [inspectItem, setInspectItem] = useState<EvidenceItem | null>(null);
  const [checkedPoints, setCheckedPoints] = useState<{ [key: number]: boolean }>({ 0: false, 1: false, 2: false });
  const [revisionNotes, setRevisionNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOpenInspect = (item: EvidenceItem) => {
    setInspectItem(item);
    setCheckedPoints({ 0: false, 1: false, 2: false });
    setRevisionNotes(item.notes || '');
  };

  const handleToggleCheck = (index: number) => {
    setCheckedPoints(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleConfirmValid = (id: string) => {
    setIsSubmitting(true);
    verifyEvidence(id, true);
    setTimeout(() => {
      setIsSubmitting(false);
      setInspectItem(null);
    }, 300);
  };

  const handleConfirmRevision = (id: string) => {
    setIsSubmitting(true);
    verifyEvidence(id, false, revisionNotes.trim() || 'Mohon unggah ulang berkas dengan kualitas foto yang lebih tajam dan jelas.');
    setTimeout(() => {
      setIsSubmitting(false);
      setInspectItem(null);
    }, 300);
  };

  return (
    <div className="space-y-6 taste-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Verifikasi Bukti & Berkas Digital
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Pemeriksaan keabsahan dokumen legalitas dan nota transaksi fisik sesuai parameter syariah BAZNAS.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="pill-verified">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1A4331]" />
            <span>Standar Audit BAZNAS</span>
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
            Semua berkas dan dokumen persyaratan telah diverifikasi atau belum ada unggahan berkas baru dari mustahik binaan.
          </p>
        </div>
      ) : (
        /* Grid of Verification Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {evidenceQueue.map(item => {
            const isVerified = item.status === 'terverifikasi';
            const isRevised = item.status === 'perlu_revisi';
            const criteria = getCriteria(item.title, item.type);
            const isPdf = item.filename.toLowerCase().endsWith('.pdf');

            return (
              <div
                key={item.id}
                className={`taste-card rounded-2xl p-5 border flex flex-col justify-between transition-all space-y-4 ${
                  isVerified
                    ? 'bg-[#F8F9FA] border-slate-200'
                    : isRevised
                    ? 'bg-amber-50/40 border-amber-200/80'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Top: Header Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#277A4D] font-bold tracking-wider block">
                        {criteria.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#111827] mt-0.5 truncate">
                        {criteria.fullName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-slate-700 font-semibold truncate flex items-center gap-1">
                          {isPdf ? (
                            <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          ) : (
                            <ImageIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                          <span className="truncate">{item.filename}</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-mono text-slate-600 uppercase font-bold shrink-0">
                          {isPdf ? 'PDF' : 'IMAGE'}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 block">
                        {item.applicantName}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {item.submittedAt}
                      </span>
                    </div>
                  </div>

                  {/* Cross-Check Context Bar (Pembanding Data Usaha) */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-[#6B7280] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Data Pembanding Profil:
                    </span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-slate-700 font-medium">
                      <span>Usaha: <strong className="text-[#111827]">{businessProfile.businessName || 'Belum diisi'}</strong></span>
                      <span>·</span>
                      <span className="truncate max-w-[200px]">Alamat: <strong className="text-[#111827]">{businessProfile.address || 'Belum diisi'}</strong></span>
                    </div>
                  </div>

                  {/* Verification Checkpoints Preview */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-[#111827] block">
                      3 Poin Parameter Validitas BAZNAS:
                    </span>
                    <ul className="space-y-1 text-xs text-[#6B7280]">
                      {criteria.checkpoints.map((cp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1A4331] mt-1.5 shrink-0" />
                          <span className="text-[11px] leading-snug">{cp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Display Revision Note if Any */}
                  {item.notes && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-0.5">
                      <span className="font-bold text-[10px] uppercase text-amber-700 block">Catatan Revisi Terkirim:</span>
                      <p className="text-[11px]">{item.notes}</p>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {isVerified ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E8F3ED] border border-[#277A4D]/20 text-xs">
                      <div className="flex items-center gap-2 font-bold text-[#1A4331]">
                        <CheckCircle2 className="w-4 h-4 text-[#277A4D] shrink-0" />
                        <span>Dokumen Dinyatakan Valid & Sah</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenInspect(item)}
                        className="text-[11px] font-bold text-[#1A4331] hover:underline"
                      >
                        Tinjau Ulang
                      </button>
                    </div>
                  ) : isRevised ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Menunggu Mustahik Unggah Ulang</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenInspect(item)}
                        className="text-[11px] font-bold text-amber-900 hover:underline"
                      >
                        Buka Detail
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenInspect(item)}
                        className="taste-btn w-full sm:flex-1 py-2 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Pratinjau & Periksa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConfirmValid(item.id)}
                        className="btn-primary w-full sm:w-auto py-2 px-4 text-xs font-bold shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Valid</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INSPECTION & PREVIEW MODAL */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 taste-enter">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#277A4D] font-bold tracking-wider block">
                  Pemeriksaan Detail Dokumen
                </span>
                <h2 className="text-lg font-bold text-[#111827] mt-0.5">
                  {getCriteria(inspectItem.title, inspectItem.type).fullName}
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Pemohon: <strong className="text-slate-900">{inspectItem.applicantName}</strong> · Berkas: <span className="font-mono text-emerald-800 font-semibold">{inspectItem.filename}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Visual Mockup Container */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 border border-slate-200 text-center space-y-3 relative overflow-hidden">
              <span className="absolute top-2 right-3 text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold pointer-events-none">
                BAZNAS DIGITAL EVIDENCE AUDIT
              </span>

              {/* Realistic Simulated Document Preview */}
              <div className="max-w-md mx-auto bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm text-left space-y-3 font-sans">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#1A4331] text-white flex items-center justify-center text-[10px] font-bold">
                      BZ
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#111827] block leading-tight">
                        {inspectItem.title.toUpperCase()}
                      </span>
                      <span className="text-[9px] text-[#6B7280]">
                        Format: {inspectItem.filename.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-[#1A4331] border border-[#277A4D]/20 px-2 py-0.5 rounded font-bold">
                    TERVERIFIKASI SISTEM
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#6B7280]">Nama Pemohon:</span>
                    <strong className="text-[#111827]">{inspectItem.applicantName}</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#6B7280]">Nama Usaha:</span>
                    <strong className="text-[#111827]">{businessProfile.businessName || 'Usaha Binaan BAZNAS'}</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#6B7280]">Lokasi Usaha:</span>
                    <strong className="text-[#111827] truncate max-w-[220px]">{businessProfile.address || 'Kabupaten Malang'}</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#6B7280]">Nama Berkas Fisik:</span>
                    <strong className="text-emerald-800 font-mono truncate max-w-[200px]">{inspectItem.filename}</strong>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 text-center italic">
                  Dokumen asli tersimpan di penyimpanan aman BAZNAS dan diverifikasi langsung oleh petugas amil.
                </p>
              </div>
            </div>

            {/* Checklist Parameters for Verification */}
            <div className="space-y-3 bg-[#F8F9FA] p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#1A4331]" />
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Checklist Parameter Keabsahan Berkas
                </h4>
              </div>
              <p className="text-xs text-[#6B7280]">
                {getCriteria(inspectItem.title, inspectItem.type).guide}
              </p>

              <div className="space-y-2 pt-1">
                {getCriteria(inspectItem.title, inspectItem.type).checkpoints.map((cp, idx) => {
                  const isChecked = checkedPoints[idx] || false;
                  return (
                    <label
                      key={idx}
                      onClick={() => handleToggleCheck(idx)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-white border-[#1A4331] ring-1 ring-[#1A4331]/20 shadow-2xs' 
                          : 'bg-white/80 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-slate-300 text-[#1A4331] focus:ring-[#1A4331]"
                      />
                      <span className={`text-xs ${isChecked ? 'font-semibold text-[#111827]' : 'text-[#6B7280]'}`}>
                        {cp}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Rejection / Revision Note Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#111827]">
                Catatan Evaluasi / Alasan Revisi (Opsional):
              </label>
              <textarea
                value={revisionNotes}
                onChange={e => setRevisionNotes(e.target.value)}
                placeholder="Contoh: Foto KTP sedikit buram di bagian NIK, mohon foto ulang dengan pencahayaan terang."
                rows={2}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1A4331] transition-all resize-none"
              />
              <span className="text-[10px] text-[#6B7280] block">
                Catatan ini akan langsung terbaca oleh Mustahik jika Anda memilih &quot;Minta Unggah Ulang&quot;.
              </span>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectItem(null)}
                className="taste-btn w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Tutup
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleConfirmRevision(inspectItem.id)}
                className="btn-secondary w-full sm:w-auto px-4 py-2.5 text-xs font-semibold border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100"
              >
                Minta Unggah Ulang
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleConfirmValid(inspectItem.id)}
                className="btn-primary w-full sm:w-auto px-5 py-2.5 text-xs font-bold"
              >
                <Check className="w-4 h-4" />
                <span>Nyatakan Dokumen Valid</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
