import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Bridge, DayInfo } from './types';

export type DailyImage = {
    url: string;
    alt: string;
    author: string;
    authorUrl: string;
};

const ACCESS_KEY = import.meta.env?.UNSPLASH_ACCESS_KEY;
const API_URL = import.meta.env?.UNSPLASH_API_BASE ?? 'https://api.unsplash.com/search/photos';
const CACHE_FILE = path.join(process.cwd(), 'node_modules', '.cache', 'liburin-unsplash.json');
const POOL_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type PhotoPool = { fetchedAt: number; photos: DailyImage[] };
type CacheFile = { pools: Record<string, PhotoPool> };

let cache: CacheFile = { pools: {} };
let cacheLoaded = false;
const inflight = new Map<string, Promise<DailyImage | null>>();
let persistQueue: Promise<void> = Promise.resolve();

const HOLIDAY_QUERIES: Array<[RegExp, string]> = [
    [/fitri|lebaran|takbir|eid al-fitr|eid al fitr/i, 'eid al fitr mosque indonesia'],
    [/adha|qurban|kurban|haji/i, 'eid al adha qurban festival indonesia'],
    [/maulid|isra|mikraj|ramadan|muharram|asyura|tahun baru islam|hijriah/i, 'mosque sunset architecture'],

    [/natal|christmas/i, 'christmas tree snow'],
    [/kelahiran yesus/i, 'nativity scene'],
    [/wafat|jumat agung|good friday/i, 'church cross sunrise'],
    [/kenaikan|ascension/i, 'sun rays through clouds'],
    [/paskah|easter/i, 'easter eggs pastel'],
    [/kristus|isa almasih/i, 'church interior light'],

    [/nyepi|saka/i, 'bali temple gate'],
    [/waisak|vesak/i, 'borobudur lantern'],
    [/imlek|tahun baru cina|lunar/i, 'chinese new year lantern'],

    [/kemerdekaan|proklamasi/i, 'bendera merah putih indonesia'],
    [/pancasila/i, 'garuda pancasila flag ceremony'],
    [/buruh|labour|labor day/i, 'labor day workers parade'],
    [/masehi|new year(?!.*islam)/i, 'new year fireworks celebration'],
];

const MONTH_QUERIES = [
    'tropical beach aerial turquoise',
    'bali rice terrace morning',
    'rainforest waterfall indonesia',
    'borobudur sunrise mist',
    'raja ampat islands boat',
    'volcano sunrise bromo',
    'lake toba sumatra',
    'komodo island hills',
    'ubud jungle river',
    'nusa penida cliff ocean',
    'tea plantation west java',
    'jakarta skyline dusk',
];

export function imageQueriesForBridge(bridge: Bridge, days: DayInfo[], max = 2): string[] {
    const byDate = new Map(days.map((d) => [d.date, d]));
    const names: string[] = [];
    for (
        let d = new Date(`${bridge.streakStart}T00:00:00`);
        d <= new Date(`${bridge.streakEnd}T00:00:00`);
        d.setDate(d.getDate() + 1)
    ) {
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const info = byDate.get(iso);
        if (info?.name && !names.includes(info.name)) names.push(info.name);
    }
    const fallback = MONTH_QUERIES[Number(bridge.streakStart.slice(5, 7)) - 1];
    return names
        .slice(0, max)
        .map((name) => HOLIDAY_QUERIES.find(([pattern]) => pattern.test(name))?.[1] ?? fallback);
}

const poolKey = (year: number, query: string) => `${year}:${query}`;

const pickForYear = (photos: DailyImage[], year: number, offset = 0): DailyImage | null => {
    if (!photos.length) return null;
    return photos[(year + offset) % photos.length];
};

async function loadCache(): Promise<CacheFile> {
    if (!cacheLoaded) {
        cacheLoaded = true;
        try {
            const parsed = JSON.parse(await readFile(CACHE_FILE, 'utf8')) as Partial<CacheFile>;
            cache = { pools: parsed.pools ?? {} };
        } catch {
            cache = { pools: {} };
        }
    }
    return cache;
}

async function persist(key: string, pool: PhotoPool): Promise<void> {
    persistQueue = persistQueue.then(async () => {
        const base = await loadCache();
        cache = { pools: { ...base.pools, [key]: pool } };
        try {
            await mkdir(path.dirname(CACHE_FILE), { recursive: true });
            await writeFile(CACHE_FILE, JSON.stringify(cache), 'utf8');
        } catch {
        }
    });
    return persistQueue;
}

async function fetchPoolFromUnsplash(query: string): Promise<DailyImage[]> {
    const key = ACCESS_KEY;
    if (!key) return [];

    const url = new URL(API_URL);
    url.searchParams.set('query', query);
    url.searchParams.set('per_page', '12');
    url.searchParams.set('orientation', 'landscape');
    url.searchParams.set('content_filter', 'high');
    url.searchParams.set('client_id', key);

    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`unsplash ${res.status}`);

    const json = (await res.json()) as {
        results: Array<{
            urls: { regular: string };
            alt_description: string | null;
            user: { name: string; links: { html: string } };
        }>;
    };
    return (json.results ?? []).map((photo) => ({
        url: photo.urls.regular,
        alt: photo.alt_description ?? `Foto: ${query}`,
        author: photo.user.name,
        authorUrl: `${photo.user.links.html}?utm_source=liburin&utm_medium=referral`,
    }));
}

export async function getYearlyImage(
    query: string,
    year: number,
    offset = 0
): Promise<DailyImage | null> {
    if (!ACCESS_KEY) return null;

    const key = poolKey(year, query);
    const current = await loadCache();
    const pool = current.pools[key];
    if (pool && Date.now() - pool.fetchedAt < POOL_TTL_MS) {
        return pickForYear(pool.photos, year, offset);
    }

    const existing = inflight.get(key);
    if (existing) return existing;

    const task = fetchPoolFromUnsplash(query)
        .then((photos) => {
            inflight.delete(key);
            void persist(key, { fetchedAt: Date.now(), photos });
            return pickForYear(photos, year, offset);
        })
        .catch(async () => {
            inflight.delete(key);
            const stale = (await loadCache()).pools[key];
            return stale ? pickForYear(stale.photos, year, offset) : null;
        });
    inflight.set(key, task);
    return task;
}
