import type { Bridge, DayInfo, DayStatus, Holiday, Recommendation } from './types';

const MAX_BRIDGE_LEN = 4;

const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function buildCalendar(year: number, holidays: Holiday[]): DayInfo[] {
    const byDate = new Map<string, Holiday>();
    for (const h of holidays) byDate.set(h.date, h);

    const days: DayInfo[] = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const date = iso(d);
        const weekday = d.getDay();
        let status: DayStatus;
        let name: string | undefined;

        const h = byDate.get(date);
        if (h?.isCutiBersama) {
            status = 'cuti_bersama';
            name = h.name;
        } else if (h) {
            status = 'libur_nasional';
            name = h.name;
        } else if (weekday === 0 || weekday === 6) {
            status = 'weekend';
        } else {
            status = 'kerja';
        }

        days.push({ date, weekday, status, name });
    }
    return days;
}

const isOff = (d: DayInfo) => d.status !== 'kerja';

function streakFor(days: DayInfo[], leaveIdxs: number[]): { start: number; end: number } {
    const isFree = new Set(leaveIdxs);

    let start = Math.min(...leaveIdxs);
    let end = Math.max(...leaveIdxs);
    while (start - 1 >= 0 && (isOff(days[start - 1]) || isFree.has(start - 1))) start--;
    while (end + 1 < days.length && (isOff(days[end + 1]) || isFree.has(end + 1))) end++;

    return { start, end };
}

export function findBridges(days: DayInfo[]): Bridge[] {
    const bridges: Bridge[] = [];

    let blockStart = -1;
    const blocks: Array<[number, number]> = [];
    for (let i = 0; i <= days.length; i++) {
        const working = i < days.length && days[i].status === 'kerja';
        if (working && blockStart === -1) blockStart = i;
        if (!working && blockStart !== -1) {
            blocks.push([blockStart, i - 1]);
            blockStart = -1;
        }
    }

    for (const [s, e] of blocks) {
        for (let len = 1; len <= MAX_BRIDGE_LEN; len++) {
            for (let i = s; i + len - 1 <= e; i++) {
                const idxs = Array.from({ length: len }, (_, k) => i + k);
                const { start, end } = streakFor(days, idxs);
                const streak = end - start + 1;
                bridges.push({
                    leaveDates: idxs.map((x) => days[x].date),
                    streakDays: streak,
                    streakStart: days[start].date,
                    streakEnd: days[end].date,
                    efficiency: streak / len,
                    _startIndex: start,
                    _endIndex: end,
                });
            }
        }
    }

    return bridges;
}

export function recommend(bridges: Bridge[], quota: number, today = new Date().toISOString().slice(0, 10)): Recommendation {
    const sorted = bridges
        .filter((b) => b.streakEnd >= today && b.leaveDates[b.leaveDates.length - 1] >= today)
        .sort(
            (a, b) => b.efficiency - a.efficiency || b.streakDays - a.streakDays
        );

    const picked: Bridge[] = [];
    let used = 0;

    for (const b of sorted) {
        if (used >= quota) break;
        if (b.leaveDates.length > quota - used) continue;
        if (picked.some((p) => b._startIndex <= p._endIndex && p._startIndex <= b._endIndex))
            continue;
        picked.push(b);
        used += b.leaveDates.length;
    }

    picked.sort((a, b) => a._startIndex - b._startIndex);

    return {
        bridges: picked,
        totalLeaveUsed: used,
        totalStreakDays: picked.reduce((sum, p) => sum + p.streakDays, 0),
    };
}

export function topBridges(days: DayInfo[], limit = 3, today = new Date().toISOString().slice(0, 10)): Bridge[] {
    const all = findBridges(days).filter((b) => b.streakDays >= 3 && b.streakEnd >= today);
    const sorted = [...all].sort(
        (a, b) =>
            b.efficiency - a.efficiency ||
            b.streakDays - a.streakDays ||
            a.leaveDates.length - b.leaveDates.length ||
            a._startIndex - b._startIndex
    );

    const overlaps = (a: Bridge, b: Bridge) =>
        a._startIndex <= b._endIndex && b._startIndex <= a._endIndex;
    const monthOf = (b: Bridge) => Number(b.streakStart.slice(5, 7));

    const picked: Bridge[] = [];
    const monthsTaken = new Set<number>();
    for (const b of sorted) {
        if (picked.length >= limit) break;
        const m = monthOf(b);
        if (monthsTaken.has(m) || picked.some((p) => overlaps(p, b))) continue;
        picked.push(b);
        monthsTaken.add(m);
    }

    for (const b of sorted) {
        if (picked.length >= limit) break;
        if (picked.some((p) => overlaps(p, b))) continue;
        picked.push(b);
    }

    return picked.sort((a, b) => b.efficiency - a.efficiency || b.streakDays - a.streakDays);
}

export function bridgeHighlights(days: DayInfo[], minEfficiency = 3): Bridge[] {
    const hasOfficialHoliday = (b: Bridge) => {
        for (let i = b._startIndex; i <= b._endIndex; i++) {
            if (days[i].status === 'libur_nasional' || days[i].status === 'cuti_bersama') return true;
        }
        return false;
    };

    const all = findBridges(days).filter(
        (b) => b.efficiency >= minEfficiency && hasOfficialHoliday(b)
    );

    const sorted = [...all].sort(
        (a, b) =>
            b.efficiency - a.efficiency ||
            b.streakDays - a.streakDays ||
            a.leaveDates.length - b.leaveDates.length ||
            a._startIndex - b._startIndex
    );

    const overlaps = (a: Bridge, b: Bridge) =>
        a._startIndex <= b._endIndex && b._startIndex <= a._endIndex;

    const picked: Bridge[] = [];
    for (const b of sorted) {
        if (picked.some((p) => overlaps(p, b))) continue;
        picked.push(b);
    }

    return picked.sort((a, b) => a._startIndex - b._startIndex);
}
