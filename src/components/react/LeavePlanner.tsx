import { useMemo, useRef, useState } from 'react';
import { buildCalendar, findBridges, recommend } from '../../lib/engine';
import type { Holiday } from '../../lib/types';
import { RecommendationCard } from './RecommendationCard';
import { YearCalendar } from './YearCalendar';

const MAX_QUOTA = 20;

export function LeavePlanner({ holidays, year }: { holidays: Holiday[]; year: number }) {
    const [quota, setQuota] = useState(5);
    const [submitted, setSubmitted] = useState(false);

    const days = useMemo(() => buildCalendar(year, holidays), [year, holidays]);
    const bridges = useMemo(() => findBridges(days), [days]);

    const result = useMemo(
        () => (submitted ? recommend(bridges, quota) : null),
        [submitted, bridges, quota]
    );

    const resultsRef = useRef<HTMLDivElement>(null);

    const search = () => {
        setSubmitted(true);
        requestAnimationFrame(() =>
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        );
    };

    const recommendedDates = useMemo(
        () => new Set(result?.bridges.flatMap((b) => b.leaveDates) ?? []),
        [result]
    );

    const step = (delta: number) => {
        setQuota((q) => Math.min(MAX_QUOTA, Math.max(1, q + delta)));
        setSubmitted(false);
    };

    return (
        <div className="flex flex-col gap-16">
            <section id="planner" className="card mx-auto w-full max-w-xl">
                <h2 className="m-0 text-center text-xl font-semibold">Berapa jatah cutimu?</h2>
                <div className="mt-6 flex items-center justify-center gap-8">
                    <button
                        type="button"
                        aria-label="Kurangi jatah cuti"
                        onClick={() => step(-1)}
                        disabled={quota <= 1}
                        className="flex h-14 w-14 touch-manipulation items-center justify-center rounded-full border border-separator text-2xl font-medium transition-transform duration-150 ease-apple active:scale-90 disabled:opacity-30"
                    >
                        −
                    </button>
                    <output
                        aria-live="polite"
                        aria-label="Jumlah jatah cuti"
                        className="tnum w-16 text-center text-5xl font-bold"
                    >
                        <span key={quota} className="rise-in inline-block">
                            {quota}
                        </span>
                    </output>
                    <button
                        type="button"
                        aria-label="Tambah jatah cuti"
                        onClick={() => step(1)}
                        disabled={quota >= MAX_QUOTA}
                        className="flex h-14 w-14 touch-manipulation items-center justify-center rounded-full border border-separator text-2xl font-medium transition-transform duration-150 ease-apple active:scale-90 disabled:opacity-30"
                    >
                        +
                    </button>
                </div>
                <button
                    type="button"
                    onClick={search}
                    className="mx-auto mt-6 block w-full rounded-full bg-accent px-8 py-3.5 text-[15px] font-semibold text-white transition duration-150 ease-apple hover:opacity-90 active:scale-95 sm:w-auto"
                >
                    Cari Rekomendasi
                </button>
            </section>

            {result && (
                <div ref={resultsRef} className="scroll-mt-6">
                    <section className="flex flex-col gap-6" aria-live="polite">
                    <header className="flex flex-wrap items-baseline justify-between gap-2">
                        <h2 className="m-0 text-xl font-semibold">Rekomendasi untukmu</h2>
                        <p className="m-0 text-sm text-text-secondary">
                            <span className="tnum font-semibold text-text-primary">
                                {result.totalLeaveUsed}
                            </span>{' '}
                            hari cuti →{' '}
                            <span className="tnum font-semibold text-text-primary">
                                {result.totalStreakDays}
                            </span>{' '}
                            hari libur panjang
                        </p>
                    </header>
                    <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
                        {result.bridges.map((b, i) => (
                            <RecommendationCard
                                key={b.streakStart}
                                bridge={b}
                                best={i === 0}
                                days={days}
                            />
                        ))}
                    </div>
                </section>
                </div>
            )}

            <YearCalendar days={days} year={year} recommendedDates={recommendedDates} />
        </div>
    );
}
