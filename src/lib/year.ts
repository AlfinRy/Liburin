export const AVAILABLE_YEARS = [2026, 2027];

export type SitePage = 'hitung-cuti' | 'rekomendasi' | 'kalender-tahunan';

export function resolveYear(input: string | number | null | undefined): number {
    const n = Number(input);
    if (AVAILABLE_YEARS.includes(n)) return n;

    const now = new Date().getFullYear();
    return AVAILABLE_YEARS.includes(now) ? now : AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1];
}

export const DEFAULT_YEAR = resolveYear(null);

export function yearHref(year: number, page?: SitePage): string {
    return page ? `/${year}/${page}` : `/${year}`;
}
