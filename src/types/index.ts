export type UserRole = 'mustahik' | 'amil' | 'muzakki';

export type SubmissionStatus = 'diajukan' | 'diverifikasi' | 'disetujui' | 'disalurkan' | 'ditolak' | 'didampingi';

export type VerificationStatus = 'terverifikasi' | 'menunggu' | 'belum_diunggah' | 'ditolak';

export interface DocumentItem {
  id: string;
  name: string;
  filename?: string;
  fileUrl?: string;
  status: VerificationStatus;
  notes?: string;
  uploadDate?: string;
}

export interface BusinessAspects {
  experienceYears: string; // e.g. "3 sampai 5 tahun"
  trainingsAttended: string; // e.g. "2 sampai 3 kali"
  premisesStatus: string; // e.g. "Menumpang di rumah"
  regularCustomers: string; // e.g. "6 sampai 20"
  networkMembership: string; // e.g. "Kelompok tidak aktif"
}

export interface BusinessProfile {
  name: string;
  businessName: string;
  businessType: string;
  duration: string;
  monthlyRevenue: number;
  address: string;
  aspects: BusinessAspects;
  calculatedScore: number;
}

export interface ZakatPackageItem {
  category: string;
  amount: number;
}

export interface MentoringModule {
  id: string;
  title: string;
  description: string;
  status: VerificationStatus;
  filename?: string;
  score?: number;
}

export interface MarketChannel {
  id: string;
  name: string;
  description: string;
  status: VerificationStatus;
  filename?: string;
}

export interface MonthlyReport {
  id: string;
  month: string;
  year: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  employeeCount: number;
  receiptFilename?: string;
  status: VerificationStatus;
}

export interface IndependenceIndicator {
  id: string;
  title: string;
  currentValue: string;
  targetValue: string;
  isMet: boolean;
  percentageProgress: number;
}

export interface ApplicantItem {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  location: string;
  documentsStatus: string; // e.g. "4/4 lengkap"
  plannedUsage: string; // e.g. "Mesin pipil jagung"
  potentialScore: number; // e.g. 47
  status: 'Baru' | 'Disetujui' | 'Didampingi' | 'Ditolak';
  submissionDate: string;
}

export interface EvidenceItem {
  id: string;
  applicantName: string;
  title: string;
  filename: string;
  fileUrl?: string;
  type: 'dokumen' | 'tugas' | 'laporan' | 'pasar';
  description?: string;
  status: 'menunggu' | 'terverifikasi' | 'perlu_revisi';
  submittedAt: string;
  notes?: string;
}
