export const idDate = (date: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }) =>
    new Intl.DateTimeFormat('id-ID', opts).format(new Date(`${date}T00:00:00`));

export const idWeekday = (date: string) =>
    new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date(`${date}T00:00:00`));

export const idDay = (date: string) =>
    new Intl.DateTimeFormat('id-ID', { day: '2-digit' }).format(new Date(`${date}T00:00:00`));

export const idMonth = (date: string) =>
    new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(`${date}T00:00:00`));
