import { Dayjs } from 'dayjs';

export const formaterDato = (dato: Dayjs): string => dato.format('DD.MM.YYYY');

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
