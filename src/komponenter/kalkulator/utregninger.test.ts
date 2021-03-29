import { DatoIntervall } from './typer';
import { summerFraværsdagerIPermitteringsperiode } from './utregninger';
import dayjs from 'dayjs';
import { configureDayJS } from '../../dayjs-config';

configureDayJS();

describe('Tester for utregninger.ts', () => {
    test('Summer antall fraværsdager i en permitteringsperiode', () => {
        const fraværsIntervall1: DatoIntervall = {
            datoFra: dayjs('2021-03-01'),
            datoTil: dayjs('2021-03-15'),
        };
        const fraværsIntervall2: DatoIntervall = {
            datoFra: dayjs('2021-04-02'),
            datoTil: dayjs('2021-04-02'),
        };
        const fraværsIntervall3: DatoIntervall = {
            datoFra: dayjs('2021-04-29'),
            datoTil: dayjs('2021-05-07'),
        };
        const permitteringsPeriode: DatoIntervall = {
            datoFra: dayjs('2020-02-14'),
            datoTil: dayjs('2021-06-02'),
        };

        expect(
            summerFraværsdagerIPermitteringsperiode(
                permitteringsPeriode,
                Array.of(
                    fraværsIntervall1,
                    fraværsIntervall2,
                    fraværsIntervall3
                )
            )
        ).toBe(25);
    });
});
