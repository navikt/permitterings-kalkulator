import { Dayjs } from 'dayjs';

export const datoValidering = (day?: Dayjs, after?: Dayjs, before?: Dayjs) => {
    if (day) {
        if (after) {
            if (day.isBefore(after)) {
                return 'Til-dato må være etter fra-dato';
            }
        }
        if (before) {
            if (day.isAfter(before)) {
                return 'Fra-dato må være før til-dato';
            }
        }
    }

    return '';
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
