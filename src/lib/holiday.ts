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

export async function getHolidays(year: number): Promise<Holiday[]> {
    const base =
        import.meta.env.PUBLIC_HOLIDAY_API_BASE ??
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
