import { supabase } from '@/lib/supabase';
import {
  UserRole,
  BusinessProfile,
  DocumentItem,
  MentoringModule,
  MarketChannel,
  MonthlyReport,
  ZakatPackageItem,
} from '@/types';

export interface UserProfileDB {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  created_at?: string;
}

export interface MustahikMappingDB {
  id?: string;
  user_email: string;
  nama_usaha: string;
  kategori_usaha: string;
  omzet_bulanan: number;
  kebutuhan_modal: number;
  skor_potensi: number;
  skor_status: string;
  program_rekomendasi: string;
  status_pengajuan: 'draft' | 'diajukan' | 'disetujui' | 'ditolak' | 'dibatalkan';
  catatan_amil?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VerificationQueueDB {
  id?: string;
  mustahik_name: string;
  mustahik_email: string;
  program_name: string;
  nominal_bantuan: number;
  skor: number;
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan';
  catatan_amil?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MonitoringReportDB {
  id?: string;
  user_email: string;
  bulan_ke: number;
  omzet_aktual: number;
  target_omzet: number;
  catatan_kendala?: string;
  status: 'diajukan' | 'terverifikasi' | 'dibatalkan';
  created_at?: string;
}

// ----------------------------------------------------
// 1. AUTH & USER PROFILE
// ----------------------------------------------------
export async function authenticateUser(email: string, password?: string, role?: UserRole) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch error, fallback to local:', error.message);
      return null;
    }

    if (data) {
      return data as UserProfileDB;
    }

    // Auto-create for trial if not yet registered
    if (role) {
      const newUser: UserProfileDB = {
        id: cleanEmail,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        password: password || '123456',
        role: role,
        phone: '081234567890',
      };
      await supabase.from('users_profile').insert([newUser]);
      return newUser;
    }

    return null;
  } catch (err) {
    console.error('Error during authenticateUser:', err);
    return null;
  }
}

export async function registerNewUser(profile: UserProfileDB) {
  try {
    const cleanEmail = profile.email.trim().toLowerCase();
    const payload = {
      ...profile,
      id: cleanEmail,
      email: cleanEmail,
      password: profile.password || '123456',
    };

    const { data, error } = await supabase
      .from('users_profile')
      .upsert([payload], { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data as UserProfileDB;
  } catch (err) {
    console.error('Error during registerNewUser:', err);
    return null;
  }
}

// ----------------------------------------------------
// 2. MAPPING & SKORING POTENSI (CREATE, READ, UPDATE, CANCEL)
// ----------------------------------------------------
export async function getMappingByUser(email: string): Promise<MustahikMappingDB | null> {
  try {
    const { data, error } = await supabase
      .from('mustahik_mapping')
      .select('*')
      .eq('user_email', email.trim().toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return null;
    return data as MustahikMappingDB;
  } catch {
    return null;
  }
}

export async function saveOrUpdateMapping(
  profile: BusinessProfile,
  userEmail: string,
  userName: string,
  nominalModal: number = 3500000,
  documents?: DocumentItem[]
) {
  try {
    const cleanEmail = userEmail.trim().toLowerCase();
    const statusScore = profile.calculatedScore >= 75 ? 'Sangat Layak' : profile.calculatedScore >= 50 ? 'Layak' : 'Perlu Pendampingan';
    const programRec = profile.calculatedScore >= 70 ? 'Z-Mart & Z-Auto' : 'Z-Preneur Pelatihan Usaha';

    // Periksa apakah mapping sudah ada untuk user ini
    const { data: existingMapping } = await supabase
      .from('mustahik_mapping')
      .select('id, catatan_amil')
      .eq('user_email', cleanEmail)
      .maybeSingle();

    let extraData: Record<string, unknown> = {};
    if (existingMapping?.catatan_amil) {
      try {
        extraData = JSON.parse(existingMapping.catatan_amil);
      } catch {}
    }

    extraData.address = profile.address;
    extraData.duration = profile.duration;
    extraData.aspects = profile.aspects;
    if (documents && documents.length > 0) {
      extraData.documents = documents;
    }

    const catatanAmilJson = JSON.stringify(extraData);

    const mappingPayload: MustahikMappingDB = {
      user_email: cleanEmail,
      nama_usaha: profile.businessName,
      kategori_usaha: profile.businessType,
      omzet_bulanan: profile.monthlyRevenue,
      kebutuhan_modal: nominalModal,
      skor_potensi: profile.calculatedScore,
      skor_status: statusScore,
      program_rekomendasi: programRec,
      status_pengajuan: 'diajukan',
      catatan_amil: catatanAmilJson,
      updated_at: new Date().toISOString(),
    };

    let savedMapping;
    if (existingMapping) {
      const { data, error } = await supabase
        .from('mustahik_mapping')
        .update(mappingPayload)
        .eq('id', existingMapping.id)
        .select()
        .single();
      if (error) console.warn('Mapping update warning:', error.message);
      savedMapping = data;
    } else {
      const { data, error } = await supabase
        .from('mustahik_mapping')
        .insert([mappingPayload])
        .select()
        .single();
      if (error) console.warn('Mapping insert warning:', error.message);
      savedMapping = data;
    }

    // Periksa apakah verification_queue sudah ada untuk user ini
    const { data: existingQueue } = await supabase
      .from('verification_queue')
      .select('id')
      .eq('mustahik_email', cleanEmail)
      .maybeSingle();

    const queuePayload: VerificationQueueDB = {
      mustahik_name: userName || profile.name,
      mustahik_email: cleanEmail,
      program_name: `${programRec} (${profile.businessName || 'Usaha Baru'})`,
      nominal_bantuan: nominalModal,
      skor: profile.calculatedScore,
      status: 'menunggu',
      catatan_amil: catatanAmilJson,
      updated_at: new Date().toISOString(),
    };

    if (existingQueue) {
      await supabase
        .from('verification_queue')
        .update(queuePayload)
        .eq('id', existingQueue.id);
    } else {
      await supabase
        .from('verification_queue')
        .insert([queuePayload]);
    }

    return savedMapping;
  } catch (err) {
    console.error('Error saving mapping to Supabase:', err);
    return null;
  }
}

// Simpan / update metadata dokumen langsung ke Supabase
export async function saveDocumentsMetadata(userEmail: string, documents: DocumentItem[]) {
  try {
    const cleanEmail = userEmail.trim().toLowerCase();

    // 1. Update mustahik_mapping
    const { data: mapping } = await supabase
      .from('mustahik_mapping')
      .select('id, catatan_amil')
      .eq('user_email', cleanEmail)
      .maybeSingle();

    let extraData: Record<string, unknown> = {};
    if (mapping?.catatan_amil) {
      try {
        extraData = JSON.parse(mapping.catatan_amil);
      } catch {}
    }
    extraData.documents = documents;
    const jsonStr = JSON.stringify(extraData);

    if (mapping) {
      await supabase
        .from('mustahik_mapping')
        .update({
          catatan_amil: jsonStr,
          updated_at: new Date().toISOString(),
        })
        .eq('id', mapping.id);
    } else {
      await supabase
        .from('mustahik_mapping')
        .insert([{
          user_email: cleanEmail,
          nama_usaha: 'Usaha Binaan',
          kategori_usaha: 'Z-Preneur',
          omzet_bulanan: 0,
          kebutuhan_modal: 3500000,
          skor_potensi: 45,
          skor_status: 'Perlu Pendampingan',
          program_rekomendasi: 'Z-Preneur Pelatihan Usaha',
          status_pengajuan: 'draft',
          catatan_amil: jsonStr,
          updated_at: new Date().toISOString(),
        }]);
    }

    // 2. Update verification_queue
    const { data: queue } = await supabase
      .from('verification_queue')
      .select('id, catatan_amil')
      .eq('mustahik_email', cleanEmail)
      .maybeSingle();

    if (queue) {
      await supabase
        .from('verification_queue')
        .update({
          catatan_amil: jsonStr,
          updated_at: new Date().toISOString(),
        })
        .eq('id', queue.id);
    } else {
      await supabase
        .from('verification_queue')
        .insert([{
          mustahik_name: 'Pemohon Zakat',
          mustahik_email: cleanEmail,
          program_name: 'Z-Preneur Pelatihan Usaha',
          nominal_bantuan: 3500000,
          skor: 45,
          status: 'menunggu',
          catatan_amil: jsonStr,
          updated_at: new Date().toISOString(),
        }]);
    }

    return true;
  } catch (err) {
    console.error('Error saving documents metadata:', err);
    return false;
  }
}

// Verifikasi bukti (dokumen 1M, tugas 3M, pasar 4M, laporan 5M) oleh Amil dan simpan ke Supabase
export async function updateEvidenceVerification(
  evidenceId: string,
  applicantName: string,
  isApproved: boolean,
  notes?: string,
  evidenceType?: 'dokumen' | 'tugas' | 'pasar' | 'laporan',
  targetKey?: string
) {
  try {
    const parts = evidenceId.split('-');
    const docId = targetKey || parts[1] || '';
    const queueId = parts.slice(2).join('-');

    let queueItem = null;
    if (queueId && queueId.length > 5) {
      const { data } = await supabase
        .from('verification_queue')
        .select('*')
        .eq('id', queueId)
        .maybeSingle();
      queueItem = data;
    }

    if (!queueItem && applicantName) {
      const { data } = await supabase
        .from('verification_queue')
        .select('*')
        .ilike('mustahik_name', applicantName)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      queueItem = data;
    }

    if (!queueItem) {
      // Coba cari dari mustahik_mapping
      const { data: mappingData } = await supabase
        .from('mustahik_mapping')
        .select('*')
        .ilike('user_email', `%${applicantName.toLowerCase().replace(/\s+/g, '')}%`)
        .maybeSingle();
      if (mappingData) {
        queueItem = {
          id: mappingData.id,
          mustahik_name: applicantName,
          mustahik_email: mappingData.user_email,
          catatan_amil: mappingData.catatan_amil,
        };
      }
    }

    if (!queueItem) return false;

    let extraData: {
      documents?: DocumentItem[];
      mentoring?: { enrolled?: boolean; modules?: MentoringModule[] };
      market?: { channels?: MarketChannel[] };
      monthlyReports?: MonthlyReport[];
      [key: string]: unknown;
    } = {};

    if (queueItem.catatan_amil) {
      try {
        extraData = JSON.parse(queueItem.catatan_amil);
      } catch {}
    }

    const type = evidenceType || (
      evidenceId.includes('task') ? 'tugas' :
      evidenceId.includes('channel') ? 'pasar' :
      evidenceId.includes('rep') ? 'laporan' : 'dokumen'
    );

    // 1. Dokumen 1M
    if (type === 'dokumen' && extraData.documents && Array.isArray(extraData.documents)) {
      extraData.documents = extraData.documents.map((d: DocumentItem) => {
        if (d.id.toLowerCase() === docId.toLowerCase() || d.name.toLowerCase().includes(docId.toLowerCase())) {
          return {
            ...d,
            status: isApproved ? 'terverifikasi' : 'ditolak',
            notes: notes || d.notes,
          };
        }
        return d;
      });
    }

    // 2. Tugas Mentoring 3M
    if (type === 'tugas' && extraData.mentoring?.modules && Array.isArray(extraData.mentoring.modules)) {
      extraData.mentoring.modules = extraData.mentoring.modules.map((m: MentoringModule) => {
        if (m.id.toLowerCase() === docId.toLowerCase() || evidenceId.includes(m.id)) {
          return {
            ...m,
            status: isApproved ? 'terverifikasi' : 'ditolak',
          };
        }
        return m;
      });
    }

    // 3. Saluran Pasar 4M
    if (type === 'pasar' && extraData.market?.channels && Array.isArray(extraData.market.channels)) {
      extraData.market.channels = extraData.market.channels.map((c: MarketChannel) => {
        if (c.id.toLowerCase() === docId.toLowerCase() || evidenceId.includes(c.id)) {
          return {
            ...c,
            status: isApproved ? 'terverifikasi' : 'ditolak',
          };
        }
        return c;
      });
    }

    // 4. Laporan Keuangan 5M
    if (type === 'laporan') {
      if (extraData.monthlyReports && Array.isArray(extraData.monthlyReports)) {
        extraData.monthlyReports = extraData.monthlyReports.map((r: MonthlyReport) => {
          if (r.month.toLowerCase() === docId.toLowerCase() || evidenceId.includes(r.id) || r.id === docId) {
            return {
              ...r,
              status: isApproved ? 'terverifikasi' : 'ditolak',
            };
          }
          return r;
        });
      }

      // Update tabel monitoring_reports di Supabase
      if (queueItem.mustahik_email) {
        await supabase
          .from('monitoring_reports')
          .update({
            status: isApproved ? 'terverifikasi' : 'dibatalkan',
          })
          .eq('user_email', queueItem.mustahik_email.toLowerCase());
      }
    }

    const updatedJson = JSON.stringify(extraData);

    // Update verification_queue
    if (queueItem.id) {
      await supabase
        .from('verification_queue')
        .update({
          catatan_amil: updatedJson,
          updated_at: new Date().toISOString(),
        })
        .eq('id', queueItem.id);
    }

    // Update mustahik_mapping
    if (queueItem.mustahik_email) {
      await supabase
        .from('mustahik_mapping')
        .update({
          catatan_amil: updatedJson,
          updated_at: new Date().toISOString(),
        })
        .eq('user_email', queueItem.mustahik_email);
    }

    return true;
  } catch (err) {
    console.error('Error updating evidence verification:', err);
    return false;
  }
}

// ----------------------------------------------------
// TAHAP 2M: MATCHING (ALOKASI BANTUAN & PENYALURAN)
// ----------------------------------------------------
export async function saveMatchingState(
  userEmail: string,
  step: number,
  status: string,
  packageItems?: ZakatPackageItem[]
) {
  try {
    const cleanEmail = userEmail.trim().toLowerCase();
    const { data: mapping } = await supabase
      .from('mustahik_mapping')
      .select('id, catatan_amil')
      .eq('user_email', cleanEmail)
      .maybeSingle();

    let extraData: Record<string, unknown> = {};
    if (mapping?.catatan_amil) {
      try {
        extraData = JSON.parse(mapping.catatan_amil);
      } catch {}
    }

    extraData.matching = {
      step,
      status,
      disbursedAt: step >= 4 ? new Date().toISOString() : ((extraData.matching as Record<string, unknown>)?.disbursedAt || null),
      package: packageItems || (extraData.matching as Record<string, unknown>)?.package || [],
      totalAmount: packageItems ? packageItems.reduce((acc, p) => acc + p.amount, 0) : 3500000,
      notes: step >= 4 ? 'Paket mesin & modal disalurkan' : 'Disetujui lembaga',
    };

    const jsonStr = JSON.stringify(extraData);

    if (mapping) {
      await supabase
        .from('mustahik_mapping')
        .update({
          catatan_amil: jsonStr,
          status_pengajuan: step >= 3 ? 'disetujui' : 'diajukan',
          updated_at: new Date().toISOString(),
        })
        .eq('id', mapping.id);
    }

    await supabase
      .from('verification_queue')
      .update({
        catatan_amil: jsonStr,
        status: step >= 3 ? 'disetujui' : 'menunggu',
        updated_at: new Date().toISOString(),
      })
      .eq('mustahik_email', cleanEmail);

    return true;
  } catch (err) {
    console.error('Error saving matching state:', err);
    return false;
  }
}

// ----------------------------------------------------
// TAHAP 3M: MENTORING (TUGAS & KELAS PELATIHAN)
// ----------------------------------------------------
export async function saveMentoringModules(
  userEmail: string,
  modules: MentoringModule[],
  isEnrolled?: boolean
) {
  try {
    const cleanEmail = userEmail.trim().toLowerCase();
    const { data: mapping } = await supabase
      .from('mustahik_mapping')
      .select('id, catatan_amil')
      .eq('user_email', cleanEmail)
      .maybeSingle();

    let extraData: Record<string, unknown> = {};
    if (mapping?.catatan_amil) {
      try {
        extraData = JSON.parse(mapping.catatan_amil);
      } catch {}
    }

    extraData.mentoring = {
      enrolled: isEnrolled !== undefined ? isEnrolled : Boolean((extraData.mentoring as Record<string, unknown>)?.enrolled),
      modules,
    };

    const jsonStr = JSON.stringify(extraData);

    if (mapping) {
      await supabase
        .from('mustahik_mapping')
        .update({ catatan_amil: jsonStr, updated_at: new Date().toISOString() })
        .eq('id', mapping.id);
    }

    await supabase
      .from('verification_queue')
      .update({ catatan_amil: jsonStr, updated_at: new Date().toISOString() })
      .eq('mustahik_email', cleanEmail);

    return true;
  } catch (err) {
    console.error('Error saving mentoring modules:', err);
    return false;
  }
}

// ----------------------------------------------------
// TAHAP 4M: MARKET (SALURAN PENJUALAN AKTIF)
// ----------------------------------------------------
export async function saveMarketChannels(
  userEmail: string,
  channels: MarketChannel[]
) {
  try {
    const cleanEmail = userEmail.trim().toLowerCase();
    const { data: mapping } = await supabase
      .from('mustahik_mapping')
      .select('id, catatan_amil')
      .eq('user_email', cleanEmail)
      .maybeSingle();

    let extraData: Record<string, unknown> = {};
    if (mapping?.catatan_amil) {
      try {
        extraData = JSON.parse(mapping.catatan_amil);
      } catch {}
    }

    extraData.market = {
      channels,
    };

    const jsonStr = JSON.stringify(extraData);

    if (mapping) {
      await supabase
        .from('mustahik_mapping')
        .update({ catatan_amil: jsonStr, updated_at: new Date().toISOString() })
        .eq('id', mapping.id);
    }

    await supabase
      .from('verification_queue')
      .update({ catatan_amil: jsonStr, updated_at: new Date().toISOString() })
      .eq('mustahik_email', cleanEmail);

    return true;
  } catch (err) {
    console.error('Error saving market channels:', err);
    return false;
  }
}

// ----------------------------------------------------
// TAHAP 5M: MONITORING (LAPORAN FINANSIAL SUPABASE)
// ----------------------------------------------------
export async function submitMonitoringReportDB(
  userEmail: string,
  report: Omit<MonthlyReport, 'id' | 'status'> & { status?: string }
): Promise<MonthlyReport | null> {
  try {
    const cleanEmail = userEmail.trim().toLowerCase();

    const monthOrder: Record<string, number> = {
      'Mei': 1, 'Jun': 2, 'Jul': 3, 'Agu': 4, 'Sep': 5, 'Okt': 6,
      'Nov': 7, 'Des': 8, 'Jan': 9, 'Feb': 10, 'Mar': 11, 'Apr': 12
    };
    const bulanKe = monthOrder[report.month] || 3;

    const extraMetadata = {
      expenses: report.expenses,
      netIncome: report.netIncome,
      employeeCount: report.employeeCount,
      receiptFilename: report.receiptFilename || 'bukti_nota.jpg',
      receiptUrl: report.receiptUrl || '',
      monthName: report.month,
      year: report.year,
    };

    const payload = {
      user_email: cleanEmail,
      bulan_ke: bulanKe,
      omzet_aktual: report.revenue,
      target_omzet: 4000000,
      catatan_kendala: JSON.stringify(extraMetadata),
      status: report.status || 'diajukan',
    };

    const { data, error } = await supabase
      .from('monitoring_reports')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('Error inserting monitoring report to Supabase:', error.message);
    }

    const savedReport: MonthlyReport = {
      id: data?.id || `rep-${Date.now()}`,
      month: report.month,
      year: report.year,
      revenue: report.revenue,
      expenses: report.expenses,
      netIncome: report.netIncome,
      employeeCount: report.employeeCount,
      receiptFilename: report.receiptFilename,
      receiptUrl: report.receiptUrl,
      status: data?.status === 'terverifikasi' ? 'terverifikasi' : 'menunggu',
    };

    // Sinkronkan juga riwayat ke catatan_amil di mustahik_mapping
    const { data: mapping } = await supabase
      .from('mustahik_mapping')
      .select('id, catatan_amil')
      .eq('user_email', cleanEmail)
      .maybeSingle();

    if (mapping) {
      let extraData: Record<string, unknown> = {};
      if (mapping.catatan_amil) {
        try { extraData = JSON.parse(mapping.catatan_amil); } catch {}
      }
      const existingReports = Array.isArray(extraData.monthlyReports) ? (extraData.monthlyReports as MonthlyReport[]) : [];
      extraData.monthlyReports = [
        savedReport,
        ...existingReports.filter(r => r.id !== savedReport.id && r.month !== savedReport.month)
      ];

      const jsonStr = JSON.stringify(extraData);
      await supabase.from('mustahik_mapping').update({ catatan_amil: jsonStr }).eq('id', mapping.id);
      await supabase.from('verification_queue').update({ catatan_amil: jsonStr }).eq('mustahik_email', cleanEmail);
    }

    return savedReport;
  } catch (err) {
    console.error('Error in submitMonitoringReportDB:', err);
    return null;
  }
}

export async function fetchMonitoringReportsDB(userEmail: string): Promise<MonthlyReport[]> {
  try {
    const cleanEmail = userEmail.trim().toLowerCase();
    const { data, error } = await supabase
      .from('monitoring_reports')
      .select('*')
      .eq('user_email', cleanEmail)
      .order('bulan_ke', { ascending: false });

    if (error || !data || data.length === 0) {
      // Check fallback in mustahik_mapping.catatan_amil
      const { data: mapping } = await supabase
        .from('mustahik_mapping')
        .select('catatan_amil')
        .eq('user_email', cleanEmail)
        .maybeSingle();

      if (mapping?.catatan_amil) {
        try {
          const parsed = JSON.parse(mapping.catatan_amil);
          if (Array.isArray(parsed.monthlyReports)) return parsed.monthlyReports;
        } catch {}
      }
      return [];
    }

    return data.map(item => {
      let parsed = { expenses: 0, netIncome: 0, employeeCount: 1, receiptFilename: '', receiptUrl: '', monthName: 'Bulan', year: 2026 };
      if (item.catatan_kendala) {
        try {
          parsed = { ...parsed, ...JSON.parse(item.catatan_kendala) };
        } catch {}
      }

      return {
        id: item.id || `rep-${item.bulan_ke}`,
        month: parsed.monthName || `Bulan ${item.bulan_ke}`,
        year: parsed.year || 2026,
        revenue: Number(item.omzet_aktual) || 0,
        expenses: Number(parsed.expenses) || 0,
        netIncome: Number(parsed.netIncome) || (Number(item.omzet_aktual) - Number(parsed.expenses)),
        employeeCount: Number(parsed.employeeCount) || 1,
        receiptFilename: parsed.receiptFilename,
        receiptUrl: parsed.receiptUrl,
        status: (item.status === 'terverifikasi' ? 'terverifikasi' : 'menunggu') as 'terverifikasi' | 'menunggu',
      };
    });
  } catch (err) {
    console.warn('Error fetching monitoring reports:', err);
    return [];
  }
}

// ----------------------------------------------------
// TAHAP 6M: MOVING UP (KELULUSAN MANDIRI KE MUZAKKI)
// ----------------------------------------------------
export async function saveGraduationStatus(
  userEmail: string,
  isGraduated: boolean,
  notes?: string
) {
  try {
    const cleanEmail = userEmail.trim().toLowerCase();
    const { data: mapping } = await supabase
      .from('mustahik_mapping')
      .select('id, catatan_amil')
      .eq('user_email', cleanEmail)
      .maybeSingle();

    let extraData: Record<string, unknown> = {};
    if (mapping?.catatan_amil) {
      try { extraData = JSON.parse(mapping.catatan_amil); } catch {}
    }

    extraData.movingUp = {
      isGraduated,
      graduatedAt: isGraduated ? new Date().toISOString() : null,
      status: isGraduated ? 'muzakki_baru' : 'mustahik_binaan',
      notes: notes || (isGraduated ? 'Lulus mandiri melampaui Had Kifayah (Muzakki Baru)' : 'Dalam pendampingan')
    };

    const jsonStr = JSON.stringify(extraData);

    if (mapping) {
      await supabase
        .from('mustahik_mapping')
        .update({ catatan_amil: jsonStr, updated_at: new Date().toISOString() })
        .eq('id', mapping.id);
    }

    await supabase
      .from('verification_queue')
      .update({ catatan_amil: jsonStr, updated_at: new Date().toISOString() })
      .eq('mustahik_email', cleanEmail);

    return true;
  } catch (err) {
    console.error('Error saving graduation status:', err);
    return false;
  }
}

// ----------------------------------------------------
// TRANSPARANSI DONATUR (MUZAKKI IMPACT DATA)
// ----------------------------------------------------
export async function fetchMuzakkiTransparencyData() {
  try {
    const { data: mappings } = await supabase
      .from('mustahik_mapping')
      .select('*')
      .order('updated_at', { ascending: false });

    const { data: reports } = await supabase
      .from('monitoring_reports')
      .select('*')
      .order('created_at', { ascending: false });

    return { mappings: mappings || [], reports: reports || [] };
  } catch (err) {
    console.warn('Error fetching muzakki transparency data:', err);
    return { mappings: [], reports: [] };
  }
}

// Fitur: Batal Pengajuan (Withdraw Submission)
export async function withdrawSubmission(userEmail: string) {
  try {
    const cleanEmail = userEmail.trim().toLowerCase();
    // Update mapping status to 'dibatalkan'
    await supabase
      .from('mustahik_mapping')
      .update({ status_pengajuan: 'dibatalkan', updated_at: new Date().toISOString() })
      .eq('user_email', cleanEmail);

    // Update queue to 'dibatalkan'
    await supabase
      .from('verification_queue')
      .update({ status: 'dibatalkan', updated_at: new Date().toISOString() })
      .eq('mustahik_email', cleanEmail);

    return true;
  } catch (err) {
    console.error('Error withdrawing submission:', err);
    return false;
  }
}

// ----------------------------------------------------
// 3. ANTREAN VERIFIKASI UNTUK AMIL (CROSS-ROLE SYNC)
// ----------------------------------------------------
export async function fetchVerificationQueue(): Promise<VerificationQueueDB[]> {
  try {
    const { data, error } = await supabase
      .from('verification_queue')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Error fetching queue from Supabase, using local fallback:', err);
    return [];
  }
}

export async function updateQueueStatus(
  queueId: string,
  newStatus: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan',
  notes?: string
) {
  try {
    const { data, error } = await supabase
      .from('verification_queue')
      .update({
        status: newStatus,
        catatan_amil: notes || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', queueId)
      .select()
      .single();

    if (error) throw error;

    // Sinkronkan juga ke tabel mustahik_mapping
    if (data?.mustahik_email) {
      await supabase
        .from('mustahik_mapping')
        .update({ status_pengajuan: newStatus, updated_at: new Date().toISOString() })
        .eq('user_email', data.mustahik_email);
    }

    return data;
  } catch (err) {
    console.error('Error updating queue status:', err);
    return null;
  }
}

// ----------------------------------------------------
// 4. RESET DATA UJI COBA
// ----------------------------------------------------
export async function resetTrialData() {
  try {
    // Delete non-seed data or set back to initial
    await supabase.from('verification_queue').delete().neq('status', 'menunggu');
    return true;
  } catch (err) {
    console.error('Error resetting trial data:', err);
    return false;
  }
}
