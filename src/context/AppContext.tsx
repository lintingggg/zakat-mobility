'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  UserRole,
  VerificationStatus,
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
  deleteDocument: (id: string) => void;

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
  verifyEvidence: (id: string, isApproved: boolean, notes?: string) => void;

  // Global Mock Reset
  resetAllMockData: () => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
}

const emptyBusinessProfile = (name: string = ''): BusinessProfile => ({
  name,
  businessName: '',
  businessType: '',
  duration: '',
  monthlyRevenue: 0,
  address: '',
  aspects: {
    experienceYears: 'Kurang dari 1 tahun',
    trainingsAttended: 'Belum pernah',
    premisesStatus: 'Menumpang di rumah',
    regularCustomers: 'Kurang dari 5',
    networkMembership: 'Tidak ada',
  },
  calculatedScore: 0,
});

const emptyDocuments: DocumentItem[] = [
  { id: 'ktp', name: 'KTP', filename: '', status: 'belum_diunggah', notes: 'Foto KTP jelas dan tidak terpotong' },
  { id: 'kk', name: 'Kartu Keluarga', filename: '', status: 'belum_diunggah', notes: 'Untuk memverifikasi anggota keluarga' },
  { id: 'sktm', name: 'SKTM / bukti DTKS', filename: '', status: 'belum_diunggah', notes: 'Surat keterangan dari desa atau kelurahan' },
  { id: 'foto', name: 'Foto usaha dan lokasi', filename: '', status: 'belum_diunggah', notes: 'Minimal 2 foto: tempat produksi dan produk' },
];

const cleanModules: MentoringModule[] = [
  { id: 'm0', title: 'Pengelolaan keuangan', description: 'Kuis modul dan tugas praktik (contoh: foto pembukuan)', status: 'belum_diunggah' },
  { id: 'm1', title: 'Kualitas produk', description: 'Kuis modul dan tugas praktik (standar mutu pengolahan)', status: 'belum_diunggah' },
  { id: 'm2', title: 'Pengemasan', description: 'Kuis modul dan tugas praktik (kemasan higienis tahan lama)', status: 'belum_diunggah' },
  { id: 'm3', title: 'Branding', description: 'Kuis modul dan tugas praktik (label merk dan identitas)', status: 'belum_diunggah' },
  { id: 'm4', title: 'Legalitas usaha', description: 'Kuis modul dan tugas praktik (NIB & P-IRT dasar)', status: 'belum_diunggah' },
  { id: 'm5', title: 'Pemasaran digital', description: 'Kuis modul dan tugas praktik (katalog WhatsApp/Medsos)', status: 'belum_diunggah' },
];

const cleanChannels: MarketChannel[] = [
  { id: 'c0', name: 'Toko lokal', description: 'Tangkapan layar akun atau foto toko, atau bukti transaksi pertama', status: 'belum_diunggah' },
  { id: 'c1', name: 'Media sosial', description: 'Tangkapan layar akun medsos (Instagram/WhatsApp Business)', status: 'belum_diunggah' },
  { id: 'c2', name: 'Reseller', description: 'Daftar mitra agen/reseller warung terdekat', status: 'belum_diunggah' },
  { id: 'c3', name: 'Komunitas', description: 'Jaringan grup pengajian/arisan/koperasi tani', status: 'belum_diunggah' },
  { id: 'c4', name: 'Marketplace', description: 'Toko online di platform digital populer', status: 'belum_diunggah' },
];

const defaultPackage: ZakatPackageItem[] = [
  { category: 'Pendampingan usaha', amount: 700000 },
  { category: 'Modal kerja', amount: 3000000 },
  { category: 'Peralatan produksi', amount: 3000000 },
  { category: 'Penguatan jaringan', amount: 300000 },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('mustahik');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Start from Onboarding/Login screen
  const [mustahikTab, setMustahikTab] = useState<'beranda' | '6m' | 'dana' | 'profil'>('beranda');
  const [current6MStep, setCurrent6MStep] = useState<number>(1); // Start from 1M (Mapping)
  const [amilTab, setAmilTab] = useState<'dasbor' | 'pengajuan' | 'verifikasi' | 'akun'>('dasbor');

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(emptyBusinessProfile(''));
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: UserRole } | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'draft' | 'diajukan' | 'disetujui' | 'ditolak' | 'dibatalkan'>('draft');
  const [documents, setDocuments] = useState<DocumentItem[]>(emptyDocuments);
  const [zakatPackage] = useState<ZakatPackageItem[]>(defaultPackage);
  const [applicationStep, setApplicationStep] = useState<number>(0);
  const [mentoringModules, setMentoringModules] = useState<MentoringModule[]>(cleanModules);
  const [isEnrolledTraining, setIsEnrolledTraining] = useState<boolean>(false);
  const [marketChannels, setMarketChannels] = useState<MarketChannel[]>(cleanChannels);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [evidenceQueue, setEvidenceQueue] = useState<EvidenceItem[]>([]);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Restore user session on browser reload or rebuild
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSession = localStorage.getItem('zm_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed && parsed.email) {
            setCurrentUser(parsed);
            setRole(parsed.role || 'mustahik');
            setIsLoggedIn(true);
          }
        }
      } catch (e) {
        console.warn('Error restoring session from localStorage:', e);
      }
    }
  }, []);

  // Recalculate potential score when business inputs change
  const calculateScore = (aspects: BusinessProfile['aspects']) => {
    let score = 30;
    if (aspects.experienceYears.includes('3')) score += 15;
    if (aspects.trainingsAttended.includes('2')) score += 10;
    if (aspects.regularCustomers.includes('6')) score += 12;
    if (aspects.premisesStatus.includes('Milik')) score += 15;
    return Math.min(score, 95);
  };

  // Sinkronisasi data real-time dengan Supabase
  const syncDataFromCloud = useCallback(async () => {
    try {
      // 1. Fetch Mapping jika Mustahik
      if (currentUser?.email) {
        const { data: mappingData } = await supabase
          .from('mustahik_mapping')
          .select('*')
          .eq('user_email', currentUser.email.toLowerCase())
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (mappingData) {
          let savedDocs: DocumentItem[] = [];
          let savedAspects = emptyBusinessProfile('').aspects;
          let savedAddress = '';
          let savedDuration = '';

          if (mappingData.catatan_amil) {
            try {
              const parsed = JSON.parse(mappingData.catatan_amil);
              if (parsed.documents && Array.isArray(parsed.documents)) {
                savedDocs = parsed.documents;
              }
              if (parsed.address) savedAddress = parsed.address;
              if (parsed.duration) savedDuration = parsed.duration;
              if (parsed.aspects) savedAspects = parsed.aspects;
            } catch {}
          }

          // Fallback to localStorage jika belum tersimpan di DB
          if (savedDocs.length === 0 && typeof window !== 'undefined') {
            const cached = localStorage.getItem(`zm_docs_${currentUser.email.toLowerCase()}`);
            if (cached) {
              try {
                savedDocs = JSON.parse(cached);
              } catch {}
            }
          }

          setBusinessProfile(prev => ({
            ...prev,
            businessName: mappingData.nama_usaha || prev.businessName,
            businessType: mappingData.kategori_usaha || prev.businessType,
            monthlyRevenue: Number(mappingData.omzet_bulanan) || prev.monthlyRevenue,
            calculatedScore: mappingData.skor_potensi || prev.calculatedScore,
            address: savedAddress || prev.address,
            duration: savedDuration || prev.duration,
            aspects: savedAspects || prev.aspects,
          }));

          if (savedDocs.length > 0) {
            setDocuments(savedDocs);
          }

          if (mappingData.status_pengajuan) {
            setSubmissionStatus(mappingData.status_pengajuan);
          }
        } else {
          // Akun baru yang belum mapping di cloud: cek local fallback
          let localDocs = emptyDocuments;
          if (typeof window !== 'undefined') {
            const cached = localStorage.getItem(`zm_docs_${currentUser.email.toLowerCase()}`);
            if (cached) {
              try {
                localDocs = JSON.parse(cached);
              } catch {}
            }
          }
          setBusinessProfile(emptyBusinessProfile(currentUser.name));
          setSubmissionStatus('draft');
          setDocuments(localDocs);
        }
      }

      // 2. Fetch Antrean Verifikasi untuk Amil
      const { data: queueData } = await supabase
        .from('verification_queue')
        .select('*')
        .order('created_at', { ascending: false });

      if (queueData && queueData.length > 0) {
        const cloudApplicants: ApplicantItem[] = queueData.map(q => {
          const isAppApproved = q.status === 'disetujui';
          const isAppRejected = q.status === 'ditolak';
          const isAppWithdrawn = q.status === 'dibatalkan';

          return {
            id: q.id || `q-${Math.random()}`,
            name: q.mustahik_name,
            businessName: q.program_name || 'Usaha Binaan',
            businessType: 'Bantuan Zakat Produktif',
            location: 'Kabupaten Malang',
            documentsStatus: isAppWithdrawn ? 'Dibatalkan pemohon' : 'Dokumen berkas terunggah',
            plannedUsage: `Bantuan Modal Rp${Number(q.nominal_bantuan || 3500000).toLocaleString('id-ID')}`,
            potentialScore: q.skor || 50,
            status: isAppApproved ? 'Disetujui' : isAppRejected ? 'Ditolak' : isAppWithdrawn ? 'Ditolak' : 'Baru',
            submissionDate: q.created_at ? new Date(q.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Hari ini',
          };
        });

        setApplicants(cloudApplicants);

        // Ekstrak berkas dari queueData.catatan_amil untuk verifikasi berkas fisik Amil
        const cloudEvidence: EvidenceItem[] = [];
        queueData.forEach(q => {
          if (q.catatan_amil && q.status !== 'dibatalkan') {
            try {
              const parsed = JSON.parse(q.catatan_amil);
              if (parsed.documents && Array.isArray(parsed.documents)) {
                parsed.documents.forEach((doc: DocumentItem) => {
                  if (doc.filename && doc.filename.trim() !== '') {
                    cloudEvidence.push({
                      id: `ev-${doc.id}-${q.id}`,
                      applicantName: q.mustahik_name,
                      title: doc.name || doc.id.toUpperCase(),
                      filename: doc.filename,
                      type: 'dokumen',
                      status: doc.status === 'terverifikasi' ? 'terverifikasi' : doc.status === 'ditolak' ? 'perlu_revisi' : 'menunggu',
                      submittedAt: q.created_at ? new Date(q.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Hari ini',
                      notes: doc.notes,
                    });
                  }
                });
              }
            } catch {}
          }
        });

        if (cloudEvidence.length > 0) {
          setEvidenceQueue(cloudEvidence);
        }
      } else {
        setApplicants([]);
        setEvidenceQueue([]);
      }
    } catch (err) {
      console.warn('Error syncing data from Supabase:', err);
    }
  }, [currentUser?.email, currentUser?.name]);

  useEffect(() => {
    if (isLoggedIn) {
      syncDataFromCloud();

      // Listen to real-time changes
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'verification_queue' },
          () => {
            syncDataFromCloud();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'mustahik_mapping' },
          () => {
            syncDataFromCloud();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isLoggedIn, syncDataFromCloud]);

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
    let nextDocs: DocumentItem[] = [];
    setDocuments(prev => {
      const next = prev.map(d => (d.id === id ? { ...d, filename, status: 'menunggu' as const } : d));
      nextDocs = next;
      if (typeof window !== 'undefined' && currentUser?.email) {
        localStorage.setItem(`zm_docs_${currentUser.email.toLowerCase()}`, JSON.stringify(next));
      }
      return next;
    });

    if (currentUser?.email) {
      import('@/services/zakatService').then(({ saveDocumentsMetadata }) => {
        saveDocumentsMetadata(currentUser.email, nextDocs);
      }).catch(err => console.warn('Cloud sync error:', err));
    }

    // Upsert ke antrean Amil: ganti jika tipe dokumen yang sama sudah ada
    const newEvidence: EvidenceItem = {
      id: `ev-${id}-${Date.now()}`,
      applicantName: currentUser?.name || businessProfile.name,
      title: id.toUpperCase(),
      filename,
      type: 'dokumen',
      status: 'menunggu',
      submittedAt: 'Hari ini',
    };
    setEvidenceQueue(prev => [
      newEvidence,
      ...prev.filter(e => e.title.toUpperCase() !== id.toUpperCase()),
    ]);
  };

  const deleteDocument = (id: string) => {
    let nextDocs: DocumentItem[] = [];
    setDocuments(prev => {
      const next = prev.map(d => (d.id === id ? { ...d, filename: '', status: 'belum_diunggah' as const } : d));
      nextDocs = next;
      if (typeof window !== 'undefined' && currentUser?.email) {
        localStorage.setItem(`zm_docs_${currentUser.email.toLowerCase()}`, JSON.stringify(next));
      }
      return next;
    });

    if (currentUser?.email) {
      import('@/services/zakatService').then(({ saveDocumentsMetadata }) => {
        saveDocumentsMetadata(currentUser.email, nextDocs);
      }).catch(err => console.warn('Cloud sync error:', err));
    }

    setEvidenceQueue(prev => prev.filter(e => e.title.toUpperCase() !== id.toUpperCase()));
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
        applicantName: currentUser?.name || businessProfile.name,
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
        applicantName: currentUser?.name || businessProfile.name,
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
        applicantName: currentUser?.name || businessProfile.name,
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

  const verifyEvidence = (id: string, isApproved: boolean, notes?: string) => {
    setEvidenceQueue(prev =>
      prev.map(item =>
        item.id === id
          ? { 
              ...item, 
              status: isApproved ? 'terverifikasi' : 'perlu_revisi',
              notes: notes || item.notes 
            }
          : item
      )
    );

    // If it's one of the primary docs
    const targetItem = evidenceQueue.find(e => e.id === id);
    if (!targetItem) return;

    if (targetItem.type === 'dokumen') {
      const docKey = targetItem.title.toLowerCase();
      setDocuments(prev => {
        const next = prev.map(d =>
          docKey.includes(d.id.toLowerCase()) || d.name.toLowerCase().includes(docKey)
            ? { 
                ...d, 
                status: (isApproved ? 'terverifikasi' : 'ditolak') as VerificationStatus,
                notes: notes ? `Catatan Amil: ${notes}` : d.notes 
              }
            : d
        );
        if (typeof window !== 'undefined' && currentUser?.email) {
          localStorage.setItem(`zm_docs_${currentUser.email.toLowerCase()}`, JSON.stringify(next));
        }
        return next;
      });

      // Simpan perubahan verifikasi ke Supabase
      import('@/services/zakatService').then(({ updateEvidenceVerification }) => {
        updateEvidenceVerification(id, targetItem.applicantName, isApproved, notes);
      }).catch(err => console.warn('Supabase verify evidence error:', err));
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

  const updateApplicantStatus = async (id: string, status: 'Baru' | 'Disetujui' | 'Didampingi' | 'Ditolak') => {
    setApplicants(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
    // Sinkronkan status pengajuan mustahik
    if (status === 'Disetujui') {
      setApplicationStep(3); // Disetujui
      setSubmissionStatus('disetujui');
    } else if (status === 'Didampingi') {
      setApplicationStep(2); // Diverifikasi amil / didampingi
    } else if (status === 'Ditolak') {
      setApplicationStep(1);
      setSubmissionStatus('ditolak');
    }

    // Push update to Supabase
    try {
      const { updateQueueStatus } = await import('@/services/zakatService');
      const dbStatus = status === 'Disetujui' ? 'disetujui' : status === 'Ditolak' ? 'ditolak' : 'menunggu';
      await updateQueueStatus(id, dbStatus);
    } catch (e) {
      console.warn('Queue update to Supabase:', e);
    }
  };

  // Calculate 6 Independence Indicators dynamically
  const activeChannelsCount = marketChannels.filter(c => c.status === 'terverifikasi').length;
  const verifiedModulesCount = mentoringModules.filter(m => m.status === 'terverifikasi').length;
  const mentoringPercent = mentoringModules.length > 0 ? Math.round((verifiedModulesCount / mentoringModules.length) * 100) : 0;
  const recordedMonthsCount = monthlyReports.filter(r => r.status === 'terverifikasi').length;
  const latestReport = monthlyReports[0] || { revenue: 0, expenses: 0, netIncome: 0, employeeCount: 0 };
  const currentNetIncome = latestReport.revenue - latestReport.expenses;

  const indicator1Met = monthlyReports.length >= 2 && latestReport.revenue > 0;
  const indicator2Met = currentNetIncome >= 2440000;
  const indicator3Met = mentoringPercent >= 80;
  const indicator4Met = recordedMonthsCount >= 3;
  const indicator5Met = activeChannelsCount >= 3;
  const indicator6Met = latestReport.employeeCount >= 2;

  const independenceIndicators: IndependenceIndicator[] = [
    {
      id: 'ind-1',
      title: 'Omzet naik ≥30%',
      currentValue: monthlyReports.length >= 2 ? 'Tercatat' : '0%',
      targetValue: '≥30%',
      isMet: indicator1Met,
      percentageProgress: indicator1Met ? 100 : 0,
    },
    {
      id: 'ind-2',
      title: 'Pendapatan ≥ Rp2,44 jt',
      currentValue: `Rp${(currentNetIncome > 0 ? currentNetIncome : 0).toLocaleString('id-ID')}`,
      targetValue: '≥Rp2.440.000',
      isMet: indicator2Met,
      percentageProgress: Math.min(Math.round(((currentNetIncome > 0 ? currentNetIncome : 0) / 2440000) * 100), 100),
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
    setBusinessProfile(emptyBusinessProfile(currentUser?.name || ''));
    setDocuments(emptyDocuments);
    setApplicationStep(0);
    setMentoringModules(cleanModules);
    setIsEnrolledTraining(false);
    setMarketChannels(cleanChannels);
    setMonthlyReports([]);
    setApplicants([]);
    setEvidenceQueue([]);
    setSubmissionStatus('draft');
  };

  const login = (newRole: UserRole, email?: string, name?: string) => {
    setRole(newRole);
    const targetEmail = email || (newRole === 'mustahik' ? 'mustahik@contoh.id' : newRole === 'amil' ? 'amil@baznas.go.id' : 'muzakki@contoh.id');
    const targetName = name || (newRole === 'mustahik' ? 'Mustahik Binaan' : newRole === 'amil' ? 'Amil Verifikator' : 'Muzakki');
    const userObj = {
      role: newRole,
      email: targetEmail,
      name: targetName,
    };
    setCurrentUser(userObj);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zm_session', JSON.stringify(userObj));
      } catch (e) {
        console.warn('Error saving session to localStorage:', e);
      }
    }

    if (newRole === 'mustahik') {
      // Ambil cache lokal berkas jika sudah ada sebelum cloud sync selesai
      let localDocs = emptyDocuments;
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(`zm_docs_${targetEmail.toLowerCase()}`);
        if (cached) {
          try {
            localDocs = JSON.parse(cached);
          } catch {}
        }
      }

      setBusinessProfile(emptyBusinessProfile(targetName));
      setDocuments(localDocs);
      setSubmissionStatus('draft');
      setCurrent6MStep(1);
      setApplicationStep(0);
      setMentoringModules(cleanModules);
      setMarketChannels(cleanChannels);
      setMonthlyReports([]);
    }

    setIsLoggedIn(true);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('zm_session');
      } catch (e) {
        console.warn('Error removing session from localStorage:', e);
      }
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Batalkan Pengajuan (Withdraw) ke Supabase & Local State
  const cancelMustahikSubmission = async () => {
    setSubmissionStatus('dibatalkan');
    const applicantName = (currentUser?.name || businessProfile.name).toLowerCase();
    setApplicants(prev => prev.map(a => a.name.toLowerCase() === applicantName || a.id.includes(applicantName) ? { ...a, status: 'Ditolak' } : a));
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
    setApplicationStep(1);
    const applicantName = currentUser?.name || businessProfile.name;
    const applicantId = `app-${currentUser?.email?.replace(/[^a-zA-Z0-9]/g, '_') || 'user'}`;

    setApplicants(prev => {
      const existingIdx = prev.findIndex(a => a.name.toLowerCase() === applicantName.toLowerCase() || a.id === applicantId);
      const updatedApplicant: ApplicantItem = {
        id: applicantId,
        name: applicantName,
        businessName: businessProfile.businessName || 'Usaha Binaan Baru',
        businessType: businessProfile.businessType || 'Bantuan Zakat Produktif',
        location: businessProfile.address ? businessProfile.address.split(',')[0] : 'Malang',
        documentsStatus: 'Dokumen berkas terunggah',
        plannedUsage: `Bantuan Modal Rp3.500.000`,
        potentialScore: businessProfile.calculatedScore,
        status: 'Baru',
        submissionDate: 'Hari ini',
      };
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = updatedApplicant;
        return next;
      } else {
        return [updatedApplicant, ...prev];
      }
    });

    try {
      const { saveOrUpdateMapping } = await import('@/services/zakatService');
      if (currentUser?.email) {
        await saveOrUpdateMapping(businessProfile, currentUser.email, currentUser.name, 3500000, documents);
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
        deleteDocument,
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
