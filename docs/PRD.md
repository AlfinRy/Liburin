# PRD — Liburin

## 1. Ringkasan
**Nama produk:** Liburin
**Domain rencana:** liburin.id (verifikasi ketersediaan di registrar sebelum pembelian)

Web app statis yang membantu pekerja Indonesia merencanakan cuti secara efisien: memasukkan jumlah jatah cuti yang tersedia, lalu sistem merekomendasikan tanggal cuti terbaik untuk mendapatkan libur panjang berturut-turut terbanyak, berdasarkan kalender hari libur nasional & cuti bersama resmi (SKB 3 Menteri).

## 2. Masalah
- Orang sering tidak sadar ada "celah" 1–2 hari kerja di antara tanggal merah yang, kalau diambil cuti, bisa jadi libur 4–9 hari.
- Menyusun ini manual (buka kalender, hitung sendiri) membosankan dan gampang salah, apalagi kalau mau bandingkan beberapa skenario jatah cuti.
- Info cuti bersama tiap tahun tersebar di PDF SKB 3 Menteri yang tidak enak dibaca.

## 3. Target Pengguna
- Pekerja kantoran/karyawan swasta di Indonesia dengan jatah cuti tahunan terbatas.
- Pengguna kasual yang datang dari pencarian musiman ("cuti bersama 2026", "libur panjang 2026").
- Tidak butuh akun — sekali pakai, hasil bisa langsung dibagikan.

## 4. Tujuan Produk
- Primer: user bisa memasukkan jatah cuti dan langsung melihat rekomendasi tanggal cuti + panjang libur yang dihasilkan, dalam < 5 detik tanpa perlu mikir.
- Sekunder: halaman ini SEO-friendly & bisa dibagikan (link/screenshot) sehingga dapat traffic organik musiman.

## 5. Non-Tujuan (Out of Scope untuk MVP)
- Tidak ada akun/login, tidak ada penyimpanan histori antar sesi.
- Tidak ada integrasi kalender pribadi (Google Calendar sync) — cukup tombol "download .ics" jika sempat.
- Tidak mendukung multi-negara; hanya kalender Indonesia.
- Tidak menangani cuti berbasis kebijakan HR spesifik perusahaan (misal cuti bersama internal tambahan).

## 6. Fitur (MVP)

### 6.1 Input jatah cuti
- Input angka: jumlah hari cuti yang ingin dialokasikan (default 1, range 1–20).
- Opsional: pilih rentang bulan yang ingin difokuskan (misal "semester 2 saja"), default: seluruh tahun berjalan.

### 6.2 Mesin rekomendasi
- Sistem menghitung semua kombinasi kandidat: cari hari kerja (Senin–Jumat, bukan tanggal merah) yang berdekatan/di antara hari libur & cuti bersama, lalu hitung total panjang libur berturut-turut (termasuk weekend yang mengapit) jika hari itu diambil cuti.
- Untuk N jatah cuti yang dimasukkan user, sistem mencari kombinasi hari kerja optimal (bisa tidak berurutan/split di beberapa periode berbeda) yang memaksimalkan **total hari libur panjang** atau menyajikan beberapa skenario (lihat 6.3).
- Algoritma dasar (greedy + windowing):
  1. Bangun daftar semua hari dalam setahun dengan status: `libur_nasional`, `cuti_bersama`, `weekend`, `kerja`.
  2. Cari semua "jembatan" — blok hari kerja pendek (1–4 hari) yang diapit oleh hari libur/weekend di kedua sisi.
  3. Hitung *efisiensi* tiap jembatan = (total hari libur berturut-turut jika jembatan diambil cuti) ÷ (jumlah hari cuti yang dipakai).
  4. Urutkan jembatan berdasarkan efisiensi tertinggi, lalu pilih greedy sampai jatah cuti user habis (skip jembatan yang overlap dengan blok libur yang sudah dipakai).
- Output tiap rekomendasi: tanggal cuti yang harus diambil, tanggal mulai–selesai libur panjang, total hari libur, jumlah cuti terpakai, efisiensi (rasio).

### 6.3 Tampilan hasil
- List/kartu berisi top rekomendasi jembatan cuti terbaik tahun berjalan (independen dari input, semacam "insight tahun ini"), diurutkan berdasarkan efisiensi.
- Highlight "Best pick" berdasarkan jatah cuti yang dimasukkan user: kombinasi mana yang harus diambil.
- Kalender visual (grid bulanan) dengan warna berbeda untuk: hari libur nasional, cuti bersama, weekend, dan hari yang direkomendasikan untuk cuti.
- Tombol "Bagikan hasil" (copy link dengan query param jatah cuti) dan/atau "Download .ics" per rekomendasi (nice-to-have, bukan blocker MVP).

### 6.4 Informasi pendukung
- Daftar lengkap hari libur nasional & cuti bersama tahun berjalan (dari API), ditampilkan sebagai tabel/referensi di bagian bawah halaman.
- Sumber data & disclaimer bahwa cuti bersama bersifat anjuran, bukan wajib bagi swasta.

## 7. Sumber Data
- API: `https://api.kemendesa.link/libur-nasional/api/holidays/2026.json` (SKB 3 Menteri, field: `date`, `name`, `is_civic`, `is_religious`, `is_cuti_bersama`).
- Fetch dilakukan saat build time (SSG), di-bake jadi JSON statis per tahun. Perlu mekanisme fallback/cache jika di masa depan mau expand ke tahun lain yang datanya belum tersedia.

## 8. Alur Pengguna (User Flow)
1. User membuka halaman → langsung melihat highlight "Top 3 libur panjang tahun ini" tanpa perlu input apa pun (value langsung terlihat).
2. User memasukkan jatah cuti yang dimiliki (misal 5 hari) → klik "Cari rekomendasi".
3. Sistem menampilkan skenario terbaik: tanggal mana yang harus diambil cuti, total libur yang didapat, ditampilkan di kalender + list.
4. User bisa scroll ke kalender tahunan untuk lihat semua hari libur & cuti bersama.
5. (Nice to have) User klik "Bagikan" untuk copy link berisi hasil, atau "Download .ics" untuk impor ke kalender.

## 9. Metrik Sukses (indikatif, bukan wajib diinstrumentasi di MVP)
- Waktu dari landing ke user mendapat rekomendasi pertama < 5 detik.
- Bounce rate rendah karena value terlihat tanpa input (insight default).
- Traffic organik musiman (cek lewat search console jika sempat di-deploy publik).

## 10. Batasan Teknis & Asumsi
- Berjalan sepenuhnya di client + build-time data, tanpa backend server custom untuk MVP.
- Data tahun 2026 sudah tersedia dari API; tahun-tahun lain perlu dicek ketersediaannya sebelum di-hardcode sebagai opsi.
- Asumsi: 1 tahun kalender = 1 build/deploy data statis (di-generate ulang tiap tahun ganti, misal via scheduled rebuild).

## 11. Rencana Rilis
- **MVP (v1):** Insight top jembatan cuti tahun berjalan + input jatah cuti + kalender visual. Deploy ke Vercel (konsisten dengan portofolio Alfin di `alfinry.vercel.app`).
- **v1.1 (nice-to-have):** Share link, download .ics, filter rentang bulan.
- **v2 (opsional, di luar cakupan sekarang):** Dukungan multi-tahun dinamis, mode "gabungkan dengan cuti bersama internal kantor" (input manual tambahan oleh user).
