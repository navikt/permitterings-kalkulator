import {
    finnInitialgrenserForTidslinjedatoer,
    konstruerTidslinje,
    regnUtHvaSisteDatoPåTidslinjenSkalVære,
} from './tidslinje-utils';
import dayjs from 'dayjs';
import { configureDayJS } from '../../../dayjs-config';
import { finnDato18MndFram } from './dato-utils';

configureDayJS();

describe('Tester for tidslinje-utils.ts', () => {
    test('datoene i tidslinjen har kun én dags mellomrom mellom hver indeks', () => {
        const tidslinje = konstruerTidslinje(
            { permitteringer: [], andreFraværsperioder: [] },
            dayjs().startOf('date'),
            finnInitialgrenserForTidslinjedatoer(dayjs().startOf('date'))
                .datoTil!
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

    test('regnUtHvaSisteDatoPåTidslinjenSkalVære skal regne ut 18 mnd etter siste permitteringsstart', () => {
        const dato = regnUtHvaSisteDatoPåTidslinjenSkalVære(
            {
                permitteringer: [
                    {
                        datoFra: dayjs('2020-01-01'),
                        datoTil: dayjs('2020-02-01'),
                    },
                    {
                        datoFra: dayjs('2020-04-01'),
                        datoTil: dayjs('2020-05-01'),
                    },
                    {
                        datoFra: dayjs('2020-07-01'),
                        datoTil: dayjs('2020-08-01'),
                    },
                ],
                andreFraværsperioder: [],
            },
            dayjs('2021-04-02')
        );
        expect(dato).toEqual(finnDato18MndFram(dayjs('2020-07-01')));
    });
});
