import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data', 'holidays');
const base =
    (process.env.PUBLIC_HOLIDAY_API_BASE ?? '')
        .replace(/\/+$/, '')
        .replace(/\/\d{4}\.json$/i, '')
        .replace(/\.json$/i, '') || 'https://api.kemendesa.link/libur-nasional/api/holidays';

const argYear = Number(process.argv[2]);
const years = argYear
    ? [argYear]
    : (await readdir(DATA_DIR))
          .filter((f) => /^\d{4}\.json$/.test(f))
          .map((f) => Number(f.slice(0, 4)))
          .sort();

if (!years.length) {
    console.log('Belum ada data tersimpan. Jalankan: npm run refresh-holidays -- <tahun>');
    process.exit(0);
}

for (const year of years) {
    try {
        const res = await fetch(`${base}/${year}.json`);
        if (!res.ok) {
            console.log(`${year}: API ${res.status}, data lama dipertahankan`);
            continue;
        }
        const json = await res.json();
        const holidays = json.data.map((h) => ({
            date: h.date,
            name: h.name,
            isCutiBersama: h.is_cuti_bersama,
            isCivic: h.is_civic,
            isReligious: h.is_religious,
        }));
        await mkdir(DATA_DIR, { recursive: true });
        await writeFile(path.join(DATA_DIR, `${year}.json`), JSON.stringify(holidays, null, 4), 'utf8');
        console.log(`${year}: ${holidays.length} hari libur disimpan`);
    } catch {
        console.log(`${year}: gagal fetch, data lama dipertahankan`);
    }
}
