<div align="center">

<img src="public/liburin-wordmark-light.png" alt="Liburin" width="220" />

**Perencana libur & cuti paling efisien di Indonesia.**

Liburin menghitung kombinasi hari cuti terbaik dari data resmi
SKB 3 Menteri (Hari Libur Nasional & Cuti Bersama),
lalu menyusunnya jadi rencana libur siap diajukan ke atasan.

[Live](https://liburin.reys.workers.dev) · [Hitung Cuti](https://liburin.reys.workers.dev/2026/hitung-cuti) · [Rekomendasi](https://liburin.reys.workers.dev/2026/rekomendasi)

</div>

---

## 🏖️ Apa yang dilakukan Liburin

- **Hitung cuti** — geser slider jatah cuti, lihat langsung proyeksi total hari bebas kerja beruntun beserta efisiensinya
- **Rekomendasi otomatis** — algoritma *bridge finder* mencari hari kejepit di antara libur nasional, cuti bersama, dan weekend untuk melipatgandakan libur
- **Kalender tahunan** — peta satu tahun penuh dengan status tiap tanggal (libur nasional, cuti bersama, weekend, kerja)
- **Selalu relevan** — rekomendasi difilter di sisi user berdasarkan tanggal hari ini (WIB), tanpa perlu rebuild berkala

## 🧰 Dibangun dengan

| Teknologi | Peran |
| :--- | :--- |
| [Astro](https://astro.build) 7 | Static site generator (100% SSG, zero JS framework) |
| [Tailwind CSS](https://tailwindcss.com) 4 | Styling dengan custom design token ala Material 3 |
| [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) + [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Tipografi display & body |
| [Unsplash API](https://unsplash.com/developers) | Foto kontekstual per periode libur (build time, dengan cache) |
| [Cloudflare](https://developers.cloudflare.com/workers/) | Hosting & global CDN |

## 📁 Struktur proyek

```text
/
├── public/                  # Aset statis (logo, favicon, webmanifest)
├── scripts/
│   └── refresh-holidays.mjs # Tarik data SKB terbaru
└── src/
    ├── components/
    │   ├── beranda/         # Hero, stats, preview, simulator, cara kerja
    │   ├── hitung-cuti/     # Simulator cuti & long weekend
    │   ├── rekomendasi/     # Kartu rekomendasi & overview
    │   └── pages/           # Komposisi halaman level atas
    ├── lib/
    │   ├── engine.ts        # Inti algoritma: findBridges, recommend, topBridges
    │   ├── holiday.ts       # Sumber data hari libur
    │   ├── unsplash.ts      # Mapping query foto + cache pool
    │   ├── format.ts        # Helper format tanggal Indonesia
    │   └── year.ts          # Resolusi & routing tahun
    ├── pages/[year]/        # Route dinamis per tahun (2026, 2027, ...)
    └── styles/global.css    # Design token (light mode) + utilities
```

## 🚀 Mulai

```sh
npm install
npm run dev        # dev server di localhost:4321
```

**Prasyarat:** Node.js ≥ 22.12.0

### Environment variables

| Variabel | Wajib | Keterangan |
| :--- | :--- | :--- |
| `UNSPLASH_ACCESS_KEY` | Tidak | Key dari [Unsplash Developers](https://unsplash.com/developers). Tanpa ini, build tetap sukses — kartu memakai gradient fallback. |

## 🛠️ Perintah

| Perintah | Aksi |
| :--- | :--- |
| `npm run dev` | Dev server lokal |
| `npm run build` | Build produksi ke `./dist/` |
| `npm run preview` | Preview hasil build |
| `npm run astro check` | Type & lint check seluruh file `.astro` |
| `npm run deploy` | Build lalu deploy ke Cloudflare |
| `npm run refresh-holidays` | Tarik ulang data SKB 3 Menteri terbaru |
| `npm run refresh-photos` | Hapus cache foto Unsplash (pool baru saat build berikutnya) |

## ☁️ Deploy

Situs di-hosting di Cloudflare (Workers static assets):

```sh
npm run deploy
```

Konfigurasi deploy ada di `wrangler.jsonc` (assets dari `./dist`). Set
`UNSPLASH_ACCESS_KEY` sebagai environment variable/secrets di environment
build-nya agar foto ikut ter-render saat proses build.

## 🧠 Cara kerja algoritma

1. `buildCalendar` menyusun 365 hari setahun dengan status: `kerja`, `weekend`, `libur_nasional`, atau `cuti_bersama`
2. `findBridges` mencari semua blok hari kerja yang berpotensi "dijembatani" — cuti 1–3 hari di dalamnya menghasilkan streak libur panjang
3. `recommend` memilih kombinasi bridge terbaik sesuai kuota cuti, mengutamakan efisiensi (`streak ÷ cuti`) tanpa tumpang tindih
4. Di sisi browser, rekomendasi yang tanggalnya sudah lewat disaring berdasarkan tanggal user (zona WIB)

## 📄 Lisensi

Data hari libur mengikuti SKB resmi Kementerian (Pekerjaan, Agama, KPK). Foto oleh kontributor [Unsplash](https://unsplash.com).
