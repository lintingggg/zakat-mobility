# Design System & UI Guidelines (Zakat Mobility)

Dokumen ini berisi panduan antarmuka pengguna (UI) untuk aplikasi **Zakat Mobility**. Mengadaptasi desain finansial yang modern, bersih, dan terpercaya, antarmuka ini dirancang khusus untuk mengakomodasi alur pemberdayaan Mustahik (Program 6M) dan Dasbor Verifikasi Amil. Desain ini mengutamakan pendekatan *Mobile-First*, dengan penyesuaian tata letak untuk *Desktop*.

## 1. Design Principles

* **Clean & Minimalist:** Penggunaan *white space* yang lega untuk mengurangi beban kognitif pengguna, terutama Mustahik yang mungkin baru mengenal aplikasi digital.
* **Trustworthy & Professional:** Penggunaan warna hijau gelap (*Dark Green*) yang memberikan kesan aman, stabil, dan lekat dengan identitas lembaga zakat/islami.
* **Clear Hierarchy:** Kontras yang tinggi untuk menyoroti status pengajuan, tugas mentoring yang harus dikerjakan, dan total dana bantuan.
* **Mobile-First:** Interaksi dirancang untuk sentuhan jempol (*thumb-friendly*), sangat penting bagi Mustahik yang mayoritas mengakses via *smartphone*.

## 2. Color Palette

Desain ini menggunakan kombinasi warna hijau gelap dan putih bersih, dengan aksen abu-abu untuk elemen pendukung.

### Primary Colors

* **Primary Dark Green:** `#1A4331` (Digunakan untuk *background* layar *Onboarding*, Kartu Dana/Progres Utama, tombol aksi utama, dan grafik omzet).
* **Primary Light Green:** `#E8F3ED` (Digunakan untuk latar belakang *alert/banner* status disetujui, progres selesai, dan elemen *hover*).
* **White:** `#FFFFFF` (Digunakan untuk *background* utama aplikasi, kartu modul/tugas, dan teks di atas latar gelap).

### Accent & Utility Colors

* **Success/Positive:** `#277A4D` (Hijau terang untuk indikator omzet naik, status "Terverifikasi", atau tahap 6M yang selesai).
* **Warning/Pending:** `#F59E0B` (Kuning/Oranye untuk status "Menunggu verifikasi" atau "Diajukan").
* **Danger/Negative:** `#D93A3A` (Merah untuk indikator omzet turun atau verifikasi ditolak/minta diulang).
* **Background App:** `#F8F9FA` (Putih tulang/abu-abu sangat terang untuk membedakan *background* aplikasi dengan *card* putih murni).

### Text Colors

* **Text Primary (On Light):** `#111827` (Hitam pekat untuk *heading*, nama Mustahik, dan nominal dana).
* **Text Secondary (On Light):** `#6B7280` (Abu-abu sedang untuk teks deskripsi, label, dan *subtitle*).
* **Text (On Dark):** `#FFFFFF` (Putih bersih).
* **Text (On Dark Secondary):** `#A3B8AD` (Hijau pudar untuk label pendukung di dalam kartu hijau gelap).

## 3. Typography

Menggunakan font *Sans-serif* yang modern, geometris, dan mudah dibaca (direkomendasikan: **Inter** atau **Plus Jakarta Sans**).

* **Heading 1 (Hero/Onboarding):** 32px - 36px, Bold, *Line height* rapat.
* **Heading 2 (Section Title):** 20px - 24px, Semi-Bold.
* **Main Numbers (Dana/Skor):** 28px - 32px, Bold.
* **Body Primary:** 14px - 16px, Regular/Medium.
* **Body Secondary / Labels:** 12px - 13px, Regular.

## 4. UI Components

### Buttons & Tags

* **Primary Button:** *Background Primary Dark Green* (`#1A4331`), teks putih, *rounded-full*, padding tebal. Digunakan untuk "Ajukan", "Simpan", "Lanjut".
* **Secondary/Upload Button:** *Border* hijau atau abu-abu, *background* putih/transparan, teks hijau. Digunakan untuk "Unggah Bukti" atau "Minta unggah ulang".
* **Status Tags (Pills):** *Rounded-full* ukuran kecil.
  * *Terverifikasi*: *Background* hijau muda, teks hijau tua.
  * *Menunggu*: *Background* kuning/oranye muda, teks oranye tua.

### Cards

* **Main Status & Fund Card (Beranda Mustahik):**
  * *Background*: Primary Dark Green.
  * *Radius*: `rounded-3xl`.
  * *Isi*: Total Dana Zakat Produktif (misal: Rp 0 / Rp 7.000.000), Status Pengajuan, dan Progres 6M (misal: "1 dari 6 selesai").
* **Module/Task Cards (Mentoring & Market):**
  * *Background*: Putih dengan *soft drop shadow*.
  * *Layout*: Judul modul di kiri atas, status di kanan atas, tombol/area unggah bukti di bawah.
* **Applicant Card (Dasbor Amil):**
  * *Layout*: Nama Mustahik & Usaha (tebal), Skor Potensi (indikator persentase), dan tombol aksi cepat (Setujui, Dampingi, Tolak).

### Navigation

* **Mobile Bottom Nav (Mustahik):** Berisi menu: **Beranda**, **Program 6M**, **Dana**, dan **Profil**. Ikon aktif memiliki *background* lingkaran hijau gelap.
* **Top Bar:** Minimalis, *sticky*. Berisi sapaan ("Assalamualaikum, [Nama]") di kiri dan ikon Notifikasi (lonceng) di kanan.

## 5. Screen Layouts (Mobile)

### Alur Mustahik
1. **Auth & Onboarding:**
   * *Background* hijau gelap atau putih bersih.
   * Ikon Zakat ($/Koin). Pilihan *role*: Mustahik, Amil, Muzakki.
2. **Beranda & Mapping:**
   * *Hero Section*: Kartu hijau gelap menampilkan Dana Zakat dan Progres.
   * *Next Step Banner*: Info tahap selanjutnya (misal: "Lanjutkan Matching").
   * *List Section*: Daftar dokumen (KTP, KK, Usaha) dengan status verifikasinya.
3. **Program 6M (Tab Navigasi Horizontal):**
   * *Mentoring*: *List card* untuk Modul Keuangan, Branding, dll. Terdapat *progress bar* melingkar (seperti di referensi desain *Analytics*).
   * *Monitoring*: Tab layout serupa dengan layar *Analytics*. Menampilkan grafik batang (*Bar Chart*) "Tren Omzet", disusul form untuk lapor omzet/biaya bulanan.
   * *Moving Up*: Dasbor kemandirian dengan skor radar/persentase (misal: "Pendapatan >= Rp2,4jt").

### Alur Amil
1. **Dasbor Amil:**
   * *Header*: Ringkasan statistik (Dana teralokasi, Rata-rata skor, Usaha dipantau).
   * *List*: Daftar pengajuan Mustahik yang diurutkan berdasarkan status "Baru" atau skor potensi.
2. **Verifikasi Detail:**
   * Halaman rincian untuk satu Mustahik.
   * Foto/Dokumen tampil dalam *thumbnail* yang bisa di-klik untuk diperbesar (*lightbox*).
   * Tombol aksi ganda di bawah (*Approve* / *Reject*).

## 6. Desktop Adaptation Strategy

Karena sistem ini berbasis *Mobile-First*, berikut panduan layout saat diakses via Tablet/Desktop (sangat penting untuk **Amil** yang sering bekerja dengan laptop):

1. **Navigation Shift:** *Bottom Navigation Bar* pada mobile **harus diubah** menjadi *Left Sidebar Navigation* pada *desktop*. Sidebar berisi menu utama (Beranda, Mustahik, Laporan, Pengaturan).
2. **Amil Workspace (Split View / Two-Column Layout):**
   * **Kolom Kiri (30-40%):** Daftar (*list*) pengajuan Mustahik yang masuk (bisa di-*scroll* independen).
   * **Kolom Kanan (60-70%):** Detail spesifik pengajuan Mustahik yang sedang dipilih (Data diri, dokumen yang diunggah, form persetujuan). Ini mencegah Amil berpindah-pindah halaman (bolak-balik) saat memverifikasi banyak dokumen.
3. **Mustahik View (Container Constriction):**
   * Jika Mustahik mengakses via *desktop*, pertahankan layout terpusat (*center-aligned container* dengan `max-w-xl` atau `max-w-2xl`) agar antarmuka tetap fokus layaknya aplikasi mobile, tidak merenggang berlebihan.
4. **Data Analytics (Monitoring/Moving Up):**
   * Di *desktop*, grafik tren omzet dan indikator kemandirian bisa ditampilkan bersisian (kiri-kanan) alih-alih bertumpuk atas-bawah seperti di *mobile*.