# Design Spec — Liburin

Bahasa desain: mengikuti prinsip Apple Human Interface Guidelines (clarity, deference, depth) — konten jadi fokus utama, UI mendukung tanpa mendominasi, whitespace lega, animasi halus dan bertujuan (bukan dekoratif).

## 1. Prinsip Desain
- **Clarity** — tipografi tegas dan hierarki jelas; setiap layar punya satu fokus utama (di halaman ini: rekomendasi libur terbaik).
- **Deference** — UI chrome minimal; kalender & data adalah bintang utama, bukan tombol/border yang ramai.
- **Depth** — gunakan layering halus (card dengan shadow tipis, blur pada elemen sticky) untuk memberi rasa hierarki spasial, bukan untuk hiasan.
- Mobile-first, karena traffic dari pencarian musiman kemungkinan besar datang dari HP.

## 2. Tipografi
- Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif` (fallback ke Inter untuk non-Apple device agar tetap terasa system-native).
- Skala (mobile / desktop):
  - Display (hero angka libur, misal "9 hari libur"): 40px / 64px, bold, tracking sedikit rapat.
  - H1 (judul halaman): 28px / 36px, semibold.
  - H2 (judul section, misal "Rekomendasi Terbaik"): 20px / 24px, semibold.
  - Body: 15px / 16px, regular, line-height 1.5.
  - Caption/meta (tanggal, label kecil): 12px / 13px, medium, warna sekunder.
- Angka statistik (jumlah hari, efisiensi) pakai tabular numerals agar rapi saat berjajar.

## 3. Warna
Ikuti pendekatan system color Apple: warna semantik, mendukung light & dark mode otomatis mengikuti `prefers-color-scheme`.

| Token | Light | Dark | Penggunaan |
|---|---|---|---|
| `--bg-primary` | #FFFFFF | #000000 | Latar utama |
| `--bg-secondary` | #F5F5F7 | #1C1C1E | Card, section alternatif |
| `--bg-elevated` | #FFFFFF (shadow) | #2C2C2E | Card mengambang, modal |
| `--text-primary` | #1D1D1F | #F5F5F7 | Teks utama |
| `--text-secondary` | #6E6E73 | #A1A1A6 | Caption, meta |
| `--accent` | #0071E3 (Apple blue) | #0A84FF | CTA, link, highlight tanggal terpilih |
| `--success` | #34C759 | #30D158 | Hari cuti bersama / libur panjang terbaik |
| `--warning` | #FF9500 | #FF9F0A | Hari libur nasional biasa |
| `--separator` | #D2D2D7 | #38383A | Border tipis, divider |

Kalender:
- Hari kerja biasa: `--bg-secondary`, teks `--text-primary`.
- Weekend: `--bg-secondary` sedikit lebih gelap/pattern halus.
- Libur nasional: badge `--warning` di sudut tanggal.
- Cuti bersama: badge `--success`.
- Hari yang direkomendasikan untuk diambil cuti: outline `--accent` 2px + fill tint accent 10% opacity.

## 4. Layout & Spacing
- Grid 8pt (spacing kelipatan 8px: 8/16/24/32/48/64).
- Container max-width: 1120px, padding horizontal 24px (mobile) / 64px (desktop).
- Card: radius 16px (besar, khas Apple), padding 20–24px, shadow tipis `0 1px 3px rgba(0,0,0,0.08)` di light mode, border 1px `--separator` di dark mode (shadow kurang terlihat di background gelap).
- Section spacing vertikal: 64px antar section besar, 24px antar elemen dalam satu card.

## 5. Komponen Utama

### 5.1 Hero / Insight Otomatis
- Begitu halaman dibuka (sebelum user input apa-apa), tampilkan card besar: "Libur terpanjang tahun ini: 9 hari, cuma butuh 2 hari cuti" — angka besar (display size), sub-teks penjelasan tanggalnya.
- Ini elemen paling atas, harus terasa seperti headline produk Apple (statement singkat, angka besar, spasi lega).

### 5.2 Input Jatah Cuti
- Stepper/number input bergaya iOS: tombol `−` dan `+` bulat di kiri-kanan angka besar di tengah, bukan input teks polos.
- Slider alternatif (opsional) di bawah 20 hari, dengan snap ke integer.
- CTA utama "Cari Rekomendasi" — pill button, `--accent` fill, radius penuh (999px), animasi scale halus saat ditekan (aktif state 0.96 scale, transisi 150ms ease-out).

### 5.3 Kartu Rekomendasi
- List horizontal-scroll di mobile, grid 2–3 kolom di desktop.
- Tiap kartu: tanggal cuti yang harus diambil (badge accent), total hari libur (angka besar), efisiensi ("2 cuti → 9 hari libur"), dan mini-preview strip 7 kotak kecil merepresentasikan hari (warna sesuai token di atas).
- Kartu "Best pick" (sesuai jatah cuti user) mendapat border accent lebih tebal + label "Rekomendasi terbaik untukmu".

### 5.4 Kalender Tahunan
- Grid 12 bulan (3 kolom mobile-scroll horizontal per baris / 4 kolom desktop), masing-masing kalender bulanan kecil.
- Tap/hover tanggal menampilkan tooltip nama hari libur.
- Legenda warna di atas grid (dot + label: Libur Nasional, Cuti Bersama, Direkomendasikan).

### 5.5 Tabel Referensi Hari Libur
- Table sederhana, sticky header saat di-scroll, di bagian bawah halaman — desain minimal, tidak perlu terlalu dihias karena fungsinya referensi/SEO content.

## 6. Motion & Interaksi
- Transisi antar state (input berubah → rekomendasi update): fade + slight upward slide (8px), 200–250ms, easing `cubic-bezier(0.32, 0.72, 0, 1)` (khas easing Apple, cepat lalu settle halus).
- Loading state (kalau ada delay hitung): skeleton shimmer pada card, bukan spinner generik.
- Hover state (desktop) pada card: elevate shadow sedikit + scale 1.01, transisi 150ms.
- Hindari animasi berlebihan/playful — semua motion harus terasa fungsional (menjelaskan perubahan state), bukan dekoratif.

## 7. Dark Mode
- Wajib didukung sejak awal (bukan tambahan), mengikuti `prefers-color-scheme: dark` secara otomatis via CSS variables di atas.
- Uji kontras: teks sekunder tetap AA-compliant di kedua mode.

## 8. Aksesibilitas
- Kontras warna minimal AA (4.5:1 untuk body text).
- Semua interaksi kalender & stepper harus bisa diakses keyboard (tab order logis, focus ring terlihat jelas — gunakan `--accent` sebagai focus ring color, bukan default browser outline).
- Label ARIA untuk badge warna (jangan hanya mengandalkan warna untuk menyampaikan status hari libur — sertakan teks/ikon).

## 9. Responsive Breakpoints
- Mobile: < 640px (default, prioritas utama).
- Tablet: 640–1024px.
- Desktop: > 1024px, max-width container 1120px seperti disebut di atas.

## 10. Referensi Implementasi
- Karena stack menggunakan Astro + island (Preact/Svelte/React) untuk bagian interaktif, style global sebaiknya ditulis sebagai CSS variables di `:root` (lihat token warna di atas) agar bisa dipakai lintas komponen statis maupun island tanpa duplikasi.
- Gunakan Tailwind (opsional) dengan konfigurasi token warna di atas sebagai `theme.extend.colors`, atau CSS murni jika ingin bundle sekecil mungkin — keputusan ini diserahkan ke tahap implementasi oleh Claude Code.
