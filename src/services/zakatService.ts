import { supabase } from '@/lib/supabase';
import { UserRole, BusinessProfile } from '@/types';

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
  nominalModal: number = 3500000
) {
  try {
    const cleanEmail = userEmail.trim().toLowerCase();
    const statusScore = profile.calculatedScore >= 75 ? 'Sangat Layak' : profile.calculatedScore >= 50 ? 'Layak' : 'Perlu Pendampingan';
    const programRec = profile.calculatedScore >= 70 ? 'Z-Mart & Z-Auto' : 'Z-Preneur Pelatihan Usaha';

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
      updated_at: new Date().toISOString(),
    };

    // Periksa apakah mapping sudah ada untuk user ini
    const { data: existingMapping } = await supabase
      .from('mustahik_mapping')
      .select('id')
      .eq('user_email', cleanEmail)
      .maybeSingle();

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
