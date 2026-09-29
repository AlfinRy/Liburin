export type Holiday = {
    date: string;
    name: string;
    isCutiBersama: boolean;
    isCivic: boolean;
    isReligious: boolean;
};

export type DayStatus = 'libur_nasional' | 'cuti_bersama' | 'weekend' | 'kerja';

export type DayInfo = {
    date: string;
    weekday: number;
    status: DayStatus;
    name?: string;
};

export type Bridge = {
    leaveDates: string[];
    streakDays: number;
    streakStart: string;
    streakEnd: string;
    efficiency: number;
    _startIndex: number;
    _endIndex: number;
};

export type Recommendation = {
    bridges: Bridge[];
    totalLeaveUsed: number;
    totalStreakDays: number;
};
