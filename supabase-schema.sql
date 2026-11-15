-- ==========================================================
-- SKEMA DATABASE ZAKAT MOBILITY (SUPABASE POSTGRESQL)
-- ==========================================================

-- 1. Tabel Profil Pengguna (Mustahik, Amil, Muzakki)
CREATE TABLE IF NOT EXISTS users_profile (
  id TEXT PRIMARY KEY, -- email atau ID pengguna
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('mustahik', 'amil', 'muzakki')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Pemetaan Usaha & Skoring Potensi (Mapping - M1)
CREATE TABLE IF NOT EXISTS mustahik_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  nama_usaha TEXT NOT NULL,
  kategori_usaha TEXT NOT NULL,
  omzet_bulanan NUMERIC DEFAULT 0,
  kebutuhan_modal NUMERIC DEFAULT 0,
  skor_potensi INTEGER DEFAULT 0,
  skor_status TEXT DEFAULT 'Cukup',
  program_rekomendasi TEXT DEFAULT 'Z-Mart',
  status_pengajuan TEXT DEFAULT 'diajukan' CHECK (status_pengajuan IN ('draft', 'diajukan', 'disetujui', 'ditolak', 'dibatalkan')),
  catatan_amil TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Antrean Verifikasi untuk Amil BAZNAS (Cross-Role Sync)
CREATE TABLE IF NOT EXISTS verification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mustahik_name TEXT NOT NULL,
  mustahik_email TEXT NOT NULL,
  program_name TEXT NOT NULL,
  nominal_bantuan NUMERIC DEFAULT 0,
  skor INTEGER DEFAULT 0,
  status TEXT DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'disetujui', 'ditolak', 'dibatalkan')),
  catatan_amil TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Laporan Monitoring Bulanan (Monitoring - M5)
CREATE TABLE IF NOT EXISTS monitoring_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  bulan_ke INTEGER DEFAULT 1,
  omzet_aktual NUMERIC DEFAULT 0,
  target_omzet NUMERIC DEFAULT 0,
  catatan_kendala TEXT,
  status TEXT DEFAULT 'diajukan' CHECK (status IN ('diajukan', 'terverifikasi', 'dibatalkan')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Nonaktifkan Row Level Security (RLS) untuk kemudahan Uji Coba / Testing Prototipe
ALTER TABLE users_profile DISABLE ROW LEVEL SECURITY;
ALTER TABLE mustahik_mapping DISABLE ROW LEVEL SECURITY;
ALTER TABLE verification_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_reports DISABLE ROW LEVEL SECURITY;

-- 6. Enable Supabase Realtime untuk sinkronisasi antar perangkat
ALTER PUBLICATION supabase_realtime ADD TABLE verification_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE mustahik_mapping;

-- 7. Data Awal (Seed Data) untuk Uji Coba
INSERT INTO users_profile (id, name, email, role, phone)
VALUES 
  ('faizah@contoh.id', 'Faizah Elysia', 'faizah@contoh.id', 'mustahik', '081234567890'),
  ('hilman@baznas.go.id', 'Hilman Ramadhan', 'hilman@baznas.go.id', 'amil', '081198765432')
ON CONFLICT (id) DO NOTHING;

INSERT INTO mustahik_mapping (user_email, nama_usaha, kategori_usaha, omzet_bulanan, kebutuhan_modal, skor_potensi, skor_status, program_rekomendasi, status_pengajuan)
VALUES 
  ('faizah@contoh.id', 'Warung Kelontong Berkah', 'Kuliner & Sembako', 2200000, 3500000, 82, 'Sangat Layak', 'Z-Mart & Z-Auto', 'diajukan')
ON CONFLICT DO NOTHING;

INSERT INTO verification_queue (mustahik_name, mustahik_email, program_name, nominal_bantuan, skor, status)
VALUES 
  ('Faizah Elysia', 'faizah@contoh.id', 'Z-Mart Modal Usaha & Etalase', 3500000, 82, 'menunggu'),
  ('Pak Joko Santoso', 'joko@contoh.id', 'Z-Auto Pelatihan & Toolset', 2800000, 74, 'menunggu')
ON CONFLICT DO NOTHING;
