'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  BusinessProfile,
  DocumentItem,
  ZakatPackageItem,
  MentoringModule,
  MarketChannel,
  MonthlyReport,
  IndependenceIndicator,
  ApplicantItem,
  EvidenceItem,
} from '@/types';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  currentUser: { name: string; email: string; role: UserRole } | null;
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;

  // Mustahik Navigation
  mustahikTab: 'beranda' | '6m' | 'dana' | 'profil';
  setMustahikTab: (tab: 'beranda' | '6m' | 'dana' | 'profil') => void;
  current6MStep: number;
  setCurrent6MStep: (step: number) => void;
  submissionStatus: 'draft' | 'diajukan' | 'disetujui' | 'ditolak' | 'dibatalkan';
  setSubmissionStatus: (status: 'draft' | 'diajukan' | 'disetujui' | 'ditolak' | 'dibatalkan') => void;
  cancelMustahikSubmission: () => Promise<void>;
  saveMustahikMappingToCloud: () => Promise<void>;

  // Amil Navigation
  amilTab: 'dasbor' | 'pengajuan' | 'verifikasi' | 'akun';
  setAmilTab: (tab: 'dasbor' | 'pengajuan' | 'verifikasi' | 'akun') => void;

  // Business Data (Mapping)
  businessProfile: BusinessProfile;
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => void;
  updateAspects: (aspectKey: keyof BusinessProfile['aspects'], value: string) => void;
  documents: DocumentItem[];
  uploadDocument: (id: string, filename: string) => void;

  // Matching
  zakatPackage: ZakatPackageItem[];
  applicationStep: number; // 1: Diajukan, 2: Diverifikasi amil, 3: Disetujui, 4: Dana disalurkan
  simulateNextStep: () => void;
  resetApplicationStep: () => void;

  // Mentoring
  mentoringModules: MentoringModule[];
  uploadModuleTask: (id: string, filename: string) => void;
  isEnrolledTraining: boolean;
  toggleTrainingEnrollment: () => void;

  // Market
  marketChannels: MarketChannel[];
  uploadChannelProof: (id: string, filename: string) => void;

  // Monitoring
  monthlyReports: MonthlyReport[];
  submitMonthlyReport: (report: Omit<MonthlyReport, 'id' | 'status'>) => void;

  // Moving Up
  independenceIndicators: IndependenceIndicator[];
  isFullyGraduated: boolean;
  simulateFullGraduation: () => void;

  // Amil Workflow
  applicants: ApplicantItem[];
  updateApplicantStatus: (id: string, status: 'Baru' | 'Disetujui' | 'Didampingi' | 'Ditolak') => void;
  evidenceQueue: EvidenceItem[];
  verifyEvidence: (id: string, isApproved: boolean) => void;

  // Global Mock Reset
  resetAllMockData: () => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
}

const defaultProfile: BusinessProfile = {
  name: 'Faizah Elysia',
  businessName: 'Gerit Jagung Bu Faizah',
  businessType: 'Olahan jagung (gerit)',
  duration: '3 tahun',
  monthlyRevenue: 1800000,
  address: 'Desa Pandansari, Poncokusumo, Kab. Malang',
  aspects: {
    experienceYears: '3 sampai 5 tahun',
    trainingsAttended: '2 sampai 3 kali',
    premisesStatus: 'Menumpang di rumah',
    regularCustomers: '6 sampai 20',
    networkMembership: 'Kelompok tidak aktif',
  },
  calculatedScore: 47,
};

const defaultDocuments: DocumentItem[] = [
  { id: 'ktp', name: 'KTP', filename: 'bukti_ktp.jpg', status: 'terverifikasi', notes: 'Foto KTP jelas dan tidak terpotong' },
  { id: 'kk', name: 'Kartu Keluarga', filename: 'bukti_kk.jpg', status: 'terverifikasi', notes: 'Untuk memverifikasi anggota keluarga' },
  { id: 'sktm', name: 'SKTM / bukti DTKS', filename: 'bukti_dtks.jpg', status: 'menunggu', notes: 'Surat keterangan dari desa atau kelurahan' },
  { id: 'foto', name: 'Foto usaha dan lokasi', filename: 'bukti_foto.jpg', status: 'menunggu', notes: 'Minimal 2 foto: tempat produksi dan produk' },
];

const defaultPackage: ZakatPackageItem[] = [
  { category: 'Pendampingan usaha', amount: 700000 },
  { category: 'Modal kerja', amount: 3000000 },
  { category: 'Peralatan produksi', amount: 3000000 },
  { category: 'Penguatan jaringan', amount: 300000 },
];

const defaultModules: MentoringModule[] = [
  { id: 'm0', title: 'Pengelolaan keuangan', description: 'Kuis modul dan tugas praktik (contoh: foto pembukuan)', status: 'terverifikasi', filename: 'bukti_m0.jpg' },
  { id: 'm1', title: 'Kualitas produk', description: 'Kuis modul dan tugas praktik (standar mutu pengolahan)', status: 'terverifikasi', filename: 'bukti_m1.jpg' },
  { id: 'm2', title: 'Pengemasan', description: 'Kuis modul dan tugas praktik (kemasan higienis tahan lama)', status: 'terverifikasi', filename: 'bukti_m2.jpg' },
  { id: 'm3', title: 'Branding', description: 'Kuis modul dan tugas praktik (label merk dan identitas)', status: 'belum_diunggah' },
  { id: 'm4', title: 'Legalitas usaha', description: 'Kuis modul dan tugas praktik (NIB & P-IRT dasar)', status: 'belum_diunggah' },
  { id: 'm5', title: 'Pemasaran digital', description: 'Kuis modul dan tugas praktik (katalog WhatsApp/Medsos)', status: 'belum_diunggah' },
];

const defaultChannels: MarketChannel[] = [
  { id: 'c0', name: 'Toko lokal', description: 'Tangkapan layar akun atau foto toko, atau bukti transaksi pertama', status: 'terverifikasi', filename: 'bukti_c0.jpg' },
  { id: 'c1', name: 'Media sosial', description: 'Tangkapan layar akun medsos (Instagram/WhatsApp Business)', status: 'terverifikasi', filename: 'bukti_c1.jpg' },
  { id: 'c2', name: 'Reseller', description: 'Daftar mitra agen/reseller warung terdekat', status: 'belum_diunggah' },
  { id: 'c3', name: 'Komunitas', description: 'Jaringan grup pengajian/arisan/koperasi tani', status: 'belum_diunggah' },
  { id: 'c4', name: 'Marketplace', description: 'Toko online di platform digital populer', status: 'belum_diunggah' },
];

const defaultReports: MonthlyReport[] = [
  { id: 'rep-mei', month: 'Mei', year: 2026, revenue: 3000000, expenses: 1400000, netIncome: 1600000, employeeCount: 1, status: 'terverifikasi' },
  { id: 'rep-jun', month: 'Jun', year: 2026, revenue: 3720000, expenses: 1720000, netIncome: 2000000, employeeCount: 1, status: 'terverifikasi' },
  { id: 'rep-jul', month: 'Jul', year: 2026, revenue: 4200000, expenses: 2200000, netIncome: 2000000, employeeCount: 1, receiptFilename: 'bukti_nota.jpg', status: 'menunggu' },
];

const defaultApplicants: ApplicantItem[] = [
  {
    id: 'app-faizah',
    name: 'Faizah Elysia',
    businessName: 'Gerit Jagung Bu Faizah',
    businessType: 'Gerit jagung',
    location: 'Poncokusumo',
    documentsStatus: 'Dokumen 4/4 lengkap',
    plannedUsage: 'Rencana: Mesin pipil jagung',
    potentialScore: 47,
    status: 'Disetujui',
    submissionDate: '12 Nov 2026',
  },
  {
    id: 'app-dimas',
    name: 'Dimas Prakoso',
    businessName: 'Keripik Renyah Mas Dimas',
    businessType: 'Keripik singkong',
    location: 'Dampit',
    documentsStatus: 'Dokumen 4/4 lengkap',
    plannedUsage: 'Rencana: Oven dan kemasan',
    potentialScore: 72,
    status: 'Baru',
    submissionDate: '13 Nov 2026',
  },
  {
    id: 'app-siti',
    name: 'Siti Aminah',
    businessName: 'Kopi Robusta Mbak Siti',
    businessType: 'Kopi bubuk',
    location: 'Dampit',
    documentsStatus: 'Dokumen 4/4 lengkap',
    plannedUsage: 'Rencana: Mesin penggiling',
    potentialScore: 81,
    status: 'Baru',
    submissionDate: '14 Nov 2026',
  },
];

const defaultEvidence: EvidenceItem[] = [
  {
    id: 'ev-1',
    applicantName: 'Faizah E.',
    title: 'SKTM / bukti DTKS',
    filename: 'bukti_dtks.jpg',
    type: 'dokumen',
    description: 'Surat keterangan tidak mampu kelurahan Pandansari',
    status: 'menunggu',
    submittedAt: '12 Nov 2026',
  },
  {
    id: 'ev-2',
    applicantName: 'Faizah E.',
    title: 'Foto usaha dan lokasi',
    filename: 'bukti_foto.jpg',
    type: 'dokumen',
    description: '2 foto dapur pengolahan dan rak penyimpanan jagung',
    status: 'menunggu',
    submittedAt: '12 Nov 2026',
  },
  {
    id: 'ev-3',
    applicantName: 'Faizah E.',
    title: 'Bukti transaksi laporan',
    filename: 'bukti_nota.jpg',
    type: 'laporan',
    description: 'Foto nota belanja bahan jagung dan kwitansi penjualan',
    status: 'menunggu',
    submittedAt: '14 Nov 2026',
  },
  {
    id: 'ev-4',
    applicantName: 'Faizah E.',
    title: 'Laporan Finansial Jul',
    filename: 'laporan_jul.pdf',
    type: 'laporan',
    description: 'Omzet Rp4.200.000 · Biaya Rp2.200.000 · nota terlampir',
    status: 'menunggu',
    submittedAt: '14 Nov 2026',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('mustahik');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Start from Onboarding/Login screen
  const [mustahikTab, setMustahikTab] = useState<'beranda' | '6m' | 'dana' | 'profil'>('beranda');
  const [current6MStep, setCurrent6MStep] = useState<number>(1); // Start from 1M (Mapping)
  const [amilTab, setAmilTab] = useState<'dasbor' | 'pengajuan' | 'verifikasi' | 'akun'>('dasbor');

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(defaultProfile);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: UserRole } | null>({
    name: 'Faizah Elysia',
    email: 'faizah@contoh.id',
    role: 'mustahik',
  });
  const [submissionStatus, setSubmissionStatus] = useState<'draft' | 'diajukan' | 'disetujui' | 'ditolak' | 'dibatalkan'>('diajukan');
  const [documents, setDocuments] = useState<DocumentItem[]>(defaultDocuments);
  const [zakatPackage] = useState<ZakatPackageItem[]>(defaultPackage);
  const [applicationStep, setApplicationStep] = useState<number>(1); // 1: Diajukan
  const [mentoringModules, setMentoringModules] = useState<MentoringModule[]>(defaultModules);
  const [isEnrolledTraining, setIsEnrolledTraining] = useState<boolean>(false);
  const [marketChannels, setMarketChannels] = useState<MarketChannel[]>(defaultChannels);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>(defaultReports);
  const [applicants, setApplicants] = useState<ApplicantItem[]>(defaultApplicants);
  const [evidenceQueue, setEvidenceQueue] = useState<EvidenceItem[]>(defaultEvidence);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Recalculate potential score when business inputs change
  const calculateScore = (aspects: BusinessProfile['aspects']) => {
    let score = 30;
    if (aspects.experienceYears.includes('3')) score += 15;
    if (aspects.trainingsAttended.includes('2')) score += 10;
    if (aspects.regularCustomers.includes('6')) score += 12;
    if (aspects.premisesStatus.includes('Milik')) score += 15;
    return Math.min(score, 95);
  };

  const updateBusinessProfile = (updates: Partial<BusinessProfile>) => {
    setBusinessProfile(prev => {
      const next = { ...prev, ...updates };
      next.calculatedScore = calculateScore(next.aspects);
      return next;
    });
  };

  const updateAspects = (aspectKey: keyof BusinessProfile['aspects'], value: string) => {
    setBusinessProfile(prev => {
      const nextAspects = { ...prev.aspects, [aspectKey]: value };
      const nextScore = calculateScore(nextAspects);
      return {
        ...prev,
        aspects: nextAspects,
        calculatedScore: nextScore,
      };
    });
  };

  const uploadDocument = (id: string, filename: string) => {
    setDocuments(prev =>
      prev.map(d => (d.id === id ? { ...d, filename, status: 'menunggu' } : d))
    );
    // Add to Amil queue
    setEvidenceQueue(prev => [
      {
        id: `ev-${Date.now()}`,
        applicantName: 'Faizah E.',
        title: id.toUpperCase(),
        filename,
        type: 'dokumen',
        status: 'menunggu',
        submittedAt: 'Hari ini',
      },
      ...prev,
    ]);
  };

  const simulateNextStep = () => {
    setApplicationStep(prev => (prev < 4 ? prev + 1 : 1));
  };

  const resetApplicationStep = () => {
    setApplicationStep(1);
  };

  const uploadModuleTask = (id: string, filename: string) => {
    setMentoringModules(prev =>
      prev.map(m => (m.id === id ? { ...m, filename, status: 'menunggu' } : m))
    );
    setEvidenceQueue(prev => [
      {
        id: `ev-task-${Date.now()}`,
        applicantName: 'Faizah E.',
        title: `Tugas Modul: ${id}`,
        filename,
        type: 'tugas',
        status: 'menunggu',
        submittedAt: 'Hari ini',
      },
      ...prev,
    ]);
  };

  const toggleTrainingEnrollment = () => {
    setIsEnrolledTraining(prev => !prev);
  };

  const uploadChannelProof = (id: string, filename: string) => {
    setMarketChannels(prev =>
      prev.map(c => (c.id === id ? { ...c, filename, status: 'menunggu' } : c))
    );
    setEvidenceQueue(prev => [
      {
        id: `ev-channel-${Date.now()}`,
        applicantName: 'Faizah E.',
        title: `Bukti Saluran Pasar: ${id}`,
        filename,
        type: 'pasar',
        status: 'menunggu',
        submittedAt: 'Hari ini',
      },
      ...prev,
    ]);
  };

  const submitMonthlyReport = (report: Omit<MonthlyReport, 'id' | 'status'>) => {
    const newRep: MonthlyReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'menunggu',
    };
    setMonthlyReports(prev => [newRep, ...prev]);
    setEvidenceQueue(prev => [
      {
        id: `ev-rep-${Date.now()}`,
        applicantName: 'Faizah E.',
        title: `Laporan Omzet: ${report.month}`,
        filename: report.receiptFilename || 'bukti_nota.jpg',
        type: 'laporan',
        description: `Omzet Rp${report.revenue.toLocaleString('id-ID')} · Biaya Rp${report.expenses.toLocaleString('id-ID')}`,
        status: 'menunggu',
        submittedAt: 'Hari ini',
      },
      ...prev,
    ]);
  };

  const verifyEvidence = (id: string, isApproved: boolean) => {
    setEvidenceQueue(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: isApproved ? 'terverifikasi' : 'perlu_revisi' }
          : item
      )
    );

    // If it's one of the primary docs
    const targetItem = evidenceQueue.find(e => e.id === id);
    if (!targetItem) return;

    if (targetItem.type === 'dokumen') {
      setDocuments(prev =>
        prev.map(d =>
          targetItem.title.toLowerCase().includes(d.id)
            ? { ...d, status: isApproved ? 'terverifikasi' : 'ditolak' }
            : d
        )
      );
    } else if (targetItem.type === 'tugas') {
      setMentoringModules(prev =>
        prev.map(m =>
          targetItem.title.includes(m.id)
            ? { ...m, status: isApproved ? 'terverifikasi' : 'ditolak' }
            : m
        )
      );
    } else if (targetItem.type === 'pasar') {
      setMarketChannels(prev =>
        prev.map(c =>
          targetItem.title.includes(c.id)
            ? { ...c, status: isApproved ? 'terverifikasi' : 'ditolak' }
            : c
        )
      );
    } else if (targetItem.type === 'laporan') {
      setMonthlyReports(prev =>
        prev.map(r =>
          targetItem.title.includes(r.month) || r.id === 'rep-jul'
            ? { ...r, status: isApproved ? 'terverifikasi' : 'ditolak' }
            : r
        )
      );
    }
  };

  const updateApplicantStatus = (id: string, status: 'Baru' | 'Disetujui' | 'Didampingi' | 'Ditolak') => {
    setApplicants(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
    // If it's Faizah, synchronize with Mustahik matching step
    if (id === 'app-faizah') {
      if (status === 'Disetujui') {
        setApplicationStep(3); // Disetujui
      } else if (status === 'Didampingi') {
        setApplicationStep(2); // Diverifikasi amil / didampingi
      } else if (status === 'Ditolak') {
        setApplicationStep(1);
      }
    }
  };

  // Calculate 6 Independence Indicators dynamically
  const activeChannelsCount = marketChannels.filter(c => c.status === 'terverifikasi').length;
  const verifiedModulesCount = mentoringModules.filter(m => m.status === 'terverifikasi').length;
  const mentoringPercent = Math.round((verifiedModulesCount / mentoringModules.length) * 100);
  const recordedMonthsCount = monthlyReports.filter(r => r.status === 'terverifikasi').length;
  const latestReport = monthlyReports[0] || { revenue: 0, expenses: 0, netIncome: 0, employeeCount: 1 };
  const currentNetIncome = latestReport.revenue - latestReport.expenses;

  const indicator1Met = false; // Omzet naik >= 30% (current 24%)
  const indicator2Met = currentNetIncome >= 2440000;
  const indicator3Met = mentoringPercent >= 80;
  const indicator4Met = recordedMonthsCount >= 3;
  const indicator5Met = activeChannelsCount >= 3;
  const indicator6Met = latestReport.employeeCount >= 2;

  const independenceIndicators: IndependenceIndicator[] = [
    {
      id: 'ind-1',
      title: 'Omzet naik ≥30%',
      currentValue: '24%',
      targetValue: '≥30%',
      isMet: indicator1Met,
      percentageProgress: 24,
    },
    {
      id: 'ind-2',
      title: 'Pendapatan ≥ Rp2,44 jt',
      currentValue: `Rp${(currentNetIncome > 0 ? currentNetIncome : 1620000).toLocaleString('id-ID')}`,
      targetValue: '≥Rp2.440.000',
      isMet: indicator2Met,
      percentageProgress: Math.min(Math.round((1620000 / 2440000) * 100), 100),
    },
    {
      id: 'ind-3',
      title: 'Pendampingan ≥80%',
      currentValue: `${mentoringPercent}%`,
      targetValue: '≥80%',
      isMet: indicator3Met,
      percentageProgress: mentoringPercent,
    },
    {
      id: 'ind-4',
      title: 'Pencatatan ≥3 bulan',
      currentValue: `${recordedMonthsCount} bulan`,
      targetValue: '≥3 bulan',
      isMet: indicator4Met,
      percentageProgress: Math.min(Math.round((recordedMonthsCount / 3) * 100), 100),
    },
    {
      id: 'ind-5',
      title: 'Saluran pasar ≥3',
      currentValue: `${activeChannelsCount} saluran`,
      targetValue: '≥3 saluran',
      isMet: indicator5Met,
      percentageProgress: Math.min(Math.round((activeChannelsCount / 3) * 100), 100),
    },
    {
      id: 'ind-6',
      title: 'Tenaga kerja ≥2',
      currentValue: `${latestReport.employeeCount} orang`,
      targetValue: '≥2 orang',
      isMet: indicator6Met,
      percentageProgress: Math.min(Math.round((latestReport.employeeCount / 2) * 100), 100),
    },
  ];

  const metCount = independenceIndicators.filter(i => i.isMet).length;
  const isFullyGraduated = metCount >= 5;

  const simulateFullGraduation = () => {
    // Approve all modules
    setMentoringModules(prev => prev.map(m => ({ ...m, status: 'terverifikasi', filename: 'tugas_selesai.jpg' })));
    // Approve all channels
    setMarketChannels(prev => prev.map(c => ({ ...c, status: 'terverifikasi', filename: 'toko_aktif.jpg' })));
    // Approve report with > 2 employees and > 2.5jt net income
    setMonthlyReports([
      { id: 'rep-jul', month: 'Jul', year: 2026, revenue: 5800000, expenses: 2600000, netIncome: 3200000, employeeCount: 2, status: 'terverifikasi' },
      { id: 'rep-jun', month: 'Jun', year: 2026, revenue: 4200000, expenses: 2000000, netIncome: 2200000, employeeCount: 2, status: 'terverifikasi' },
      { id: 'rep-mei', month: 'Mei', year: 2026, revenue: 3500000, expenses: 1700000, netIncome: 1800000, employeeCount: 1, status: 'terverifikasi' },
    ]);
    // Approve application
    setApplicationStep(4);
    // Mark evidence as verified
    setEvidenceQueue(prev => prev.map(e => ({ ...e, status: 'terverifikasi' })));
  };

  const resetAllMockData = () => {
    setBusinessProfile(defaultProfile);
    setDocuments(defaultDocuments);
    setApplicationStep(1);
    setMentoringModules(defaultModules);
    setIsEnrolledTraining(false);
    setMarketChannels(defaultChannels);
    setMonthlyReports(defaultReports);
    setApplicants(defaultApplicants);
    setEvidenceQueue(defaultEvidence);
    setSubmissionStatus('diajukan');
  };

  const login = (newRole: UserRole, email?: string, name?: string) => {
    setRole(newRole);
    const targetEmail = email || (newRole === 'mustahik' ? 'faizah@contoh.id' : newRole === 'amil' ? 'hilman@baznas.go.id' : 'rahmat@muzakki.id');
    const targetName = name || (newRole === 'mustahik' ? 'Faizah Elysia' : newRole === 'amil' ? 'Hilman Ramadhan' : 'Bpk. Rahmat Santoso');
    setCurrentUser({
      role: newRole,
      email: targetEmail,
      name: targetName,
    });
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  // Batalkan Pengajuan (Withdraw) ke Supabase & Local State
  const cancelMustahikSubmission = async () => {
    setSubmissionStatus('dibatalkan');
    setApplicants(prev => prev.map(a => a.id === 'app-faizah' ? { ...a, status: 'Ditolak' } : a));
    try {
      const { withdrawSubmission } = await import('@/services/zakatService');
      if (currentUser?.email) {
        await withdrawSubmission(currentUser.email);
      }
    } catch (e) {
      console.warn('Withdraw Supabase error:', e);
    }
  };

  // Simpan / Perbarui Data Usaha (Edit) ke Supabase & Local State
  const saveMustahikMappingToCloud = async () => {
    setSubmissionStatus('diajukan');
    setApplicants(prev => prev.map(a => a.id === 'app-faizah' ? { ...a, businessName: businessProfile.businessName, potentialScore: businessProfile.calculatedScore, status: 'Baru' } : a));
    try {
      const { saveOrUpdateMapping } = await import('@/services/zakatService');
      if (currentUser?.email) {
        await saveOrUpdateMapping(businessProfile, currentUser.email, currentUser.name);
      }
    } catch (e) {
      console.warn('Save to Supabase error:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isLoggedIn,
        currentUser,
        login,
        logout,
        mustahikTab,
        setMustahikTab,
        current6MStep,
        setCurrent6MStep,
        submissionStatus,
        setSubmissionStatus,
        cancelMustahikSubmission,
        saveMustahikMappingToCloud,
        amilTab,
        setAmilTab,
        businessProfile,
        updateBusinessProfile,
        updateAspects,
        documents,
        uploadDocument,
        zakatPackage,
        applicationStep,
        simulateNextStep,
        resetApplicationStep,
        mentoringModules,
        uploadModuleTask,
        isEnrolledTraining,
        toggleTrainingEnrollment,
        marketChannels,
        uploadChannelProof,
        monthlyReports,
        submitMonthlyReport,
        independenceIndicators,
        isFullyGraduated,
        simulateFullGraduation,
        applicants,
        updateApplicantStatus,
        evidenceQueue,
        verifyEvidence,
        resetAllMockData,
        isMobileFrame,
        setIsMobileFrame,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
