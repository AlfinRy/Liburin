import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Holiday } from './types';

interface ApiHoliday {
    date: string;
    name: string;
    is_civic: boolean;
    is_religious: boolean;
    is_cuti_bersama: boolean;
}

interface ApiResponse {
    metadata: { year: number; last_updated: string };
    data: ApiHoliday[];
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data', 'holidays');

function normalizeBase(base: string): string {
    return base
        .replace(/\/+$/, '')
        .replace(/\/\d{4}\.json$/i, '')
        .replace(/\.json$/i, '');
}

function dataFile(year: number): string {
    return path.join(DATA_DIR, `${year}.json`);
}

async function readStored(year: number): Promise<Holiday[] | null> {
    try {
        const parsed = JSON.parse(await readFile(dataFile(year), 'utf8')) as Holiday[];
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

async function store(year: number, holidays: Holiday[]): Promise<void> {
    try {
        await mkdir(DATA_DIR, { recursive: true });
        await writeFile(dataFile(year), JSON.stringify(holidays, null, 4), 'utf8');
    } catch {
    }
}

async function fetchHolidays(year: number): Promise<Holiday[]> {
    const base =
        normalizeBase(import.meta.env.PUBLIC_HOLIDAY_API_BASE ?? '') ||
        'https://api.kemendesa.link/libur-nasional/api/holidays';
    const res = await fetch(`${base}/${year}.json`);
    if (!res.ok) throw new Error(`Gagal fetch holiday ${year}: ${res.status}`);

    const json = (await res.json()) as ApiResponse;
    return json.data.map((h) => ({
        date: h.date,
        name: h.name,
        isCutiBersama: h.is_cuti_bersama,
        isCivic: h.is_civic,
        isReligious: h.is_religious,
    }));
}

export async function getHolidays(year: number): Promise<Holiday[]> {
    const stored = await readStored(year);
    if (stored && stored.length) return stored;

    try {
        const holidays = await fetchHolidays(year);
        if (holidays.length) await store(year, holidays);
        return holidays;
    } catch {
        return [];
    }
}
