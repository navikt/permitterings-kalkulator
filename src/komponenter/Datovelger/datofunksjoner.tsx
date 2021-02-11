export const skrivOmDato = (dato?: Date) => {
    if (dato) {
        const year = dato.getFullYear().toString();
        let day = dato.getDate().toString();
        let month = (dato.getMonth() + 1).toString();
        if (day.length < 2) {
            day = '0' + day;
        }
        if (month.length < 2) {
            month = '0' + month;
        }
        return day + '/' + month + '/' + year;
    }
    return '';
};

export const skrivOmDatoStreng = (datoStreng: string) => {
    const parts = datoStreng.split('/');
    const year = parseInt(parts[2]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[0]);
    if (year > 1970 && month > 0 && day > 0) {
        const returnDate = new Date(year, month - 1, day);
        return returnDate;
    } else {
        return false;
    }
};

export const datoValidering = (day?: Date, after?: Date, before?: Date) => {
    if (day) {
        if (after) {
            if (day.getTime() < after.getTime()) {
                return 'Til-dato må være etter fra-dato';
            }
        }
        if (before) {
            if (day.getTime() > before.getTime()) {
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
