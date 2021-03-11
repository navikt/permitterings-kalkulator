export const skrivOmDatoStreng = (datoStreng: string) => {
    const parts = datoStreng.split('.');
    const year = parseInt(parts[2]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[0]);
    if (year > 1970 && month > 0 && day > 0) {
        return new Date(year, month - 1, day);
    } else {
        return false;
    }
};

export const WEEKDAYS_SHORT = {
    no: ['Sø', 'Ma', 'Ti', 'On', 'To', 'Fr', 'Lø'],
};
export const MONTHS = {
    no: [
        'Januar',
        'Februar',
        'Mars',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Desember',
    ],
};

export const WEEKDAYS_LONG = {
    no: [
        'Mandag',
        'Tirsdag',
        'Onsdag',
        'Torsdag',
        'Fredag',
        'Lørdag',
        'Søndag',
    ],
};

export const LABELS = {
    no: { nextMonth: 'Neste måned', previousMonth: 'Forrige måned' },
};
