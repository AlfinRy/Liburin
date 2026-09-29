import type { Bridge, DayInfo } from '../../lib/types';

const fmt = (d: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
    new Intl.DateTimeFormat('id-ID', opts).format(new Date(`${d}T00:00:00`));

function Strip({ bridge, days }: { bridge: Bridge; days: DayInfo[] }) {
    const byDate = new Map(days.map((d) => [d.date, d]));
    const leaveSet = new Set(bridge.leaveDates);
    const pad = (n: number) => String(n).padStart(2, '0');
    const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const cells = Array.from({ length: bridge.streakDays }, (_, i) => {
        const date = new Date(`${bridge.streakStart}T00:00:00`);
        date.setDate(date.getDate() + i);
        const iso = isoOf(date);
        const info = byDate.get(iso);
        const kind = leaveSet.has(iso)
            ? 'leave'
            : info?.status === 'cuti_bersama'
              ? 'cuti'
              : info?.status === 'libur_nasional'
                ? 'libur'
                : 'off';
        return (
            <span
                key={iso}
                title={fmt(iso, { weekday: 'short', day: 'numeric', month: 'short' })}
                className="h-2 w-2 rounded-[2px]"
                style={{
                    background:
                        kind === 'leave'
                            ? 'var(--accent)'
                            : kind === 'cuti'
                              ? 'var(--success)'
                              : kind === 'libur'
                                ? 'var(--warning)'
                                : 'var(--separator)',
                }}
            />
        );
    });

    return <div className="flex gap-1">{cells.slice(0, 12)}</div>;
}

export function RecommendationCard({
    bridge,
    best,
    days,
}: {
    bridge: Bridge;
    best?: boolean;
    days: DayInfo[];
}) {
    return (
        <article
            className={`card rise-in w-[80vw] max-w-[320px] shrink-0 snap-start transition duration-150 ease-apple hover:-translate-y-0.5 hover:shadow-lg sm:w-auto sm:max-w-none ${
                best ? 'border-2 border-accent' : ''
            }`}
        >
            {best && (
                <p className="mt-0 text-xs font-semibold uppercase tracking-wide text-accent">
                    Rekomendasi terbaik untukmu
                </p>
            )}
            <p className="tnum m-0 text-xs font-medium text-text-secondary">
                {fmt(bridge.streakStart, { month: 'long' })}
            </p>
            <p className="display-num my-1 text-4xl font-bold">
                {bridge.streakDays}
                <span className="ml-1.5 text-sm font-medium tracking-normal text-text-secondary">
                    hari libur
                </span>
            </p>
            <p className="mt-2 mb-0 text-sm text-text-secondary">
                Ambil cuti{' '}
                <span className="font-semibold text-accent">
                    {bridge.leaveDates.map((d) => fmt(d)).join(', ')}
                </span>{' '}
                → libur {fmt(bridge.streakStart)}–{fmt(bridge.streakEnd)}
            </p>
            <p className="tnum mt-4 mb-0 text-sm">
                <span className="font-semibold">{bridge.leaveDates.length}</span> cuti →{' '}
                <span className="font-semibold">{bridge.streakDays}</span> hari libur (
                <span className="font-semibold">{bridge.efficiency.toFixed(1)}×</span> efektif)
            </p>
            <div className="mt-4">
                <Strip bridge={bridge} days={days} />
            </div>
        </article>
    );
}
