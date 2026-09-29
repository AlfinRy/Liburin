import type { DayInfo } from '../../lib/types';

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const WEEKDAYS = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];

function MonthGrid({
    year,
    month,
    byDate,
    recommendedDates,
}: {
    year: number;
    month: number;
    byDate: Map<string, DayInfo>;
    recommendedDates: Set<string>;
}) {
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<DayInfo | null> = [
        ...Array.from({ length: offset }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => {
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
            return byDate.get(iso) ?? null;
        }),
    ];

    return (
        <div>
            <h3 className="mb-2 mt-0 text-sm font-semibold">{MONTHS[month]}</h3>
            <div className="grid grid-cols-7 gap-y-1 text-center">
                {WEEKDAYS.map((w, i) => (
                    <span key={`wd-${i}`} className="text-[10px] text-text-secondary">
                        {w}
                    </span>
                ))}
                {cells.map((d, i) => {
                    if (!d) return <span key={`e-${i}`} />;
                    const isLibur = d.status === 'libur_nasional';
                    const isCuti = d.status === 'cuti_bersama';
                    const isWeekend = d.status === 'weekend';
                    const isRec = recommendedDates.has(d.date);
                    const dot = isLibur
                        ? 'var(--warning)'
                        : isCuti
                          ? 'var(--success)'
                          : isRec
                            ? 'var(--accent)'
                            : null;
                    return (
                        <span
                            key={d.date}
                            title={d.name ?? undefined}
                            className="relative mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs"
                            style={{
                                background: isRec
                                    ? 'color-mix(in srgb, var(--accent) 12%, transparent)'
                                    : isWeekend
                                      ? 'color-mix(in srgb, var(--text-primary) 5%, transparent)'
                                      : undefined,
                                outline: isRec ? '2px solid var(--accent)' : undefined,
                                color: isLibur || isCuti || isWeekend
                                    ? 'var(--text-secondary)'
                                    : undefined,
                            }}
                        >
                            {Number(d.date.slice(8))}
                            {dot && (
                                <span
                                    aria-hidden="true"
                                    className="absolute bottom-0 h-1 w-1 rounded-full"
                                    style={{ background: dot }}
                                />
                            )}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export function YearCalendar({
    days,
    year,
    recommendedDates,
}: {
    days: DayInfo[];
    year: number;
    recommendedDates: Set<string>;
}) {
    const byDate = new Map(days.map((d) => [d.date, d]));

    return (
        <section className="flex flex-col gap-6">
            <h2 className="m-0 text-xl font-semibold">Kalender {year}</h2>
            <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
                <Legend color="var(--warning)" label="Libur Nasional" />
                <Legend color="var(--success)" label="Cuti Bersama" />
                <Legend color="var(--accent)" label="Direkomendasikan" />
            </div>
            <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-4">
                {MONTHS.map((_, m) => (
                    <div key={m} className="card w-[260px] shrink-0 snap-start py-4 sm:w-auto">
                        <MonthGrid
                            year={year}
                            month={m}
                            byDate={byDate}
                            recommendedDates={recommendedDates}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
            {label}
        </span>
    );
}
