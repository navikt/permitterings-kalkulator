import { konstruerTidslinje } from './tidslinje-utils';
import dayjs from 'dayjs';

describe('Tester for tidslinje-utils.ts', () => {
    test('datoene i tidslinjen har kun én dags mellomrom mellom hver indeks', () => {
        const tidslinje = konstruerTidslinje(
            { permitteringer: [], andreFraværsperioder: [] },
            dayjs().startOf('date')
        );
        let bestårTest = true;
        tidslinje.forEach((objekt, indeks) => {
            if (indeks > 0) {
                if (
                    tidslinje[indeks].dato.date() -
                        tidslinje[indeks - 1].dato.date() !==
                    1
                ) {
                    if (tidslinje[indeks].dato.date() !== 1) {
                        bestårTest = false;
                    }
                    if (
                        tidslinje[indeks].dato.month() -
                            tidslinje[indeks - 1].dato.month() !==
                            1 &&
                        tidslinje[indeks].dato.month() !== 0
                    ) {
                        bestårTest = false;
                    }
                }
            }
        });
        expect(bestårTest).toBe(true);
    });
});
