import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    OversiktOverBrukteOgGjenværendeDager,
} from './typer';
import {
    antallDagerGått,
    finnSisteDato,
    finnTidligsteDato,
    finnUtOmDefinnesOverlappendePerioder,
    konstruerStatiskTidslinje,
    kuttAvDatoIntervallInnefor18mnd,
    summerFraværsdagerIPermitteringsperiode,
    sumPermitteringerOgFravær,
} from './utregninger';
import dayjs from 'dayjs';
import { configureDayJS } from '../../dayjs-config';

configureDayJS();

describe('Tester for utregninger.ts', () => {
    test('datoene i tidslinjen har kun én dags mellomrom mellom hver indeks', () => {
        const tidslinje = konstruerStatiskTidslinje(
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

    test('antall dager mellom to datoer teller riktig for et tilfeldig utvalg av 1000 datoer i tidslinja', () => {
        const tidslinje = konstruerStatiskTidslinje(
            { permitteringer: [], andreFraværsperioder: [] },
            dayjs().startOf('date')
        );
        for (let i = 0; i < 1000; i++) {
            const tilfeldigIndeks = Math.floor(
                Math.random() * tidslinje.length
            );
            const utregnetAntallDagerGått = antallDagerGått(
                tidslinje[0].dato,
                tidslinje[tilfeldigIndeks].dato
            );
            const riktigAntallDagerGått = tilfeldigIndeks + 1;
            expect(utregnetAntallDagerGått).toBe(riktigAntallDagerGått);
        }
    });

    test('Antall dager mellom to datoer', () => {
        const enDagIFebruar = dayjs('2021-02-20');
        const nesteDagIFebruar = dayjs('2021-02-21');
        const enDagIMars = dayjs('2021-03-23');
        const enDagIMarsEtÅrSenere = dayjs('2022-03-23');

        expect(antallDagerGått(enDagIFebruar, enDagIFebruar)).toBe(1);
        expect(antallDagerGått(enDagIFebruar, nesteDagIFebruar)).toBe(2);
        expect(antallDagerGått(enDagIFebruar, enDagIMars)).toBe(32);
        expect(antallDagerGått(enDagIMars, enDagIMarsEtÅrSenere)).toBe(366);
    });

    test('Tester om to datointervaller er overlappende. Samme slutt og startdato skal regnes som overlappende.', () => {
        const startIntervall1 = dayjs('2021-03-01');
        const sluttIntervall1 = dayjs('2021-04-15');

        const startIntervall2 = dayjs('2021-04-15');
        const sluttIntervall2 = dayjs('2021-05-15');

        const periode1: DatoIntervall = {
            datoFra: startIntervall1,
            datoTil: sluttIntervall1,
        };

        const periode2: DatoIntervall = {
            datoFra: startIntervall2,
            datoTil: sluttIntervall2,
        };

        expect(
            finnUtOmDefinnesOverlappendePerioder(Array.of(periode1, periode2))
        ).toBe(true);
    });

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

    test('Finner den tidligste datoen fra en liste av flere permitteringsperioder', () => {
        const startPermitteringsPeriode1 = dayjs('2021-02-14');
        const sluttPermitteringsPeriode1 = dayjs('2021-03-02');
        const startPermitteringsPeriode2 = dayjs('2021-01-10');
        const sluttPermitteringsPeriode2 = dayjs('2021-01-25');
        const startPermitteringsPeriode3 = dayjs('2021-04-14');
        const sluttPermitteringsPeriode3 = dayjs('2021-04-28');
        const startPermitteringsPeriode4 = dayjs('2021-05-14');
        const sluttPermitteringsPeriode4 = dayjs('2021-06-02');

        const permitteringsPeriode1: DatoIntervall = {
            datoFra: startPermitteringsPeriode1,
            datoTil: sluttPermitteringsPeriode1,
        };
        const permitteringsPeriode2: DatoIntervall = {
            datoFra: startPermitteringsPeriode2,
            datoTil: sluttPermitteringsPeriode2,
        };
        const permitteringsPeriode3: DatoIntervall = {
            datoFra: startPermitteringsPeriode3,
            datoTil: sluttPermitteringsPeriode3,
        };
        const permitteringsPeriode4: DatoIntervall = {
            datoFra: startPermitteringsPeriode4,
            datoTil: sluttPermitteringsPeriode4,
        };

        expect(
            finnTidligsteDato(
                Array.of(
                    permitteringsPeriode1,
                    permitteringsPeriode2,
                    permitteringsPeriode3,
                    permitteringsPeriode4
                )
            )
        ).toEqual(dayjs('2021-01-10'));
    });

    test('Finner den siste datoen fra en liste av flere permitteringsperioder', () => {
        const startPermitteringsPeriode1 = dayjs('2021-02-14');
        const sluttPermitteringsPeriode1 = dayjs('2021-03-02');
        const startPermitteringsPeriode2 = dayjs('2021-01-10');
        const sluttPermitteringsPeriode2 = dayjs('2021-01-25');
        const startPermitteringsPeriode3 = dayjs('2021-04-14');
        const sluttPermitteringsPeriode3 = dayjs('2021-04-28');
        const startPermitteringsPeriode4 = dayjs('2021-05-14');
        const sluttPermitteringsPeriode4 = dayjs('2021-06-02');

        const permitteringsPeriode1: DatoIntervall = {
            datoFra: startPermitteringsPeriode1,
            datoTil: sluttPermitteringsPeriode1,
        };
        const permitteringsPeriode2: DatoIntervall = {
            datoFra: startPermitteringsPeriode2,
            datoTil: sluttPermitteringsPeriode2,
        };
        const permitteringsPeriode3: DatoIntervall = {
            datoFra: startPermitteringsPeriode3,
            datoTil: sluttPermitteringsPeriode3,
        };
        const permitteringsPeriode4: DatoIntervall = {
            datoFra: startPermitteringsPeriode4,
            datoTil: sluttPermitteringsPeriode4,
        };

        expect(
            finnSisteDato(
                Array.of(
                    permitteringsPeriode1,
                    permitteringsPeriode2,
                    permitteringsPeriode3,
                    permitteringsPeriode4
                )
            )
        ).toEqual(dayjs('2021-06-02'));
    });

    test('Sum av permitteringer og fravær', () => {
        const startFraværsIntervall1 = dayjs('2020-03-01');
        const sluttFraværsIntervall1 = dayjs('2020-03-15'); // 15 dager
        const fraværsPeriode: DatoIntervall = {
            datoFra: startFraværsIntervall1,
            datoTil: sluttFraværsIntervall1,
        };

        const startPermitteringsPeriode1 = dayjs('2020-02-14');
        const sluttPermitteringsPeriode1 = dayjs('2020-03-02');
        const startPermitteringsPeriode2 = dayjs('2020-01-10');
        const sluttPermitteringsPeriode2 = dayjs('2020-01-25');
        const startPermitteringsPeriode3 = dayjs('2020-04-14');
        const sluttPermitteringsPeriode3 = dayjs('2020-04-28');
        const startPermitteringsPeriode4 = dayjs('2020-05-14');
        const sluttPermitteringsPeriode4 = dayjs('2020-06-02');

        const permitteringsPeriode1: DatoIntervall = {
            datoFra: startPermitteringsPeriode1,
            datoTil: sluttPermitteringsPeriode1,
        };
        const permitteringsPeriode2: DatoIntervall = {
            datoFra: startPermitteringsPeriode2,
            datoTil: sluttPermitteringsPeriode2,
        };
        const permitteringsPeriode3: DatoIntervall = {
            datoFra: startPermitteringsPeriode3,
            datoTil: sluttPermitteringsPeriode3,
        };
        const permitteringsPeriode4: DatoIntervall = {
            datoFra: startPermitteringsPeriode4,
            datoTil: sluttPermitteringsPeriode4,
        };

        const alle: AllePermitteringerOgFraværesPerioder = {
            permitteringer: Array.of(
                permitteringsPeriode1,
                permitteringsPeriode2,
                permitteringsPeriode3,
                permitteringsPeriode4
            ),
            andreFraværsperioder: Array.of(fraværsPeriode),
        };

        const oversikt: OversiktOverBrukteOgGjenværendeDager = sumPermitteringerOgFravær(
            alle,
            dayjs()
        );
        expect(oversikt.dagerAnnetFravær).toBe(2); // Burde være 2? Vises som to i selve komponenten.
        expect(oversikt.dagerGjensående).toBe(646); // Hm ?
        expect(oversikt.dagerPermittert).toBe(67); // 65?
    });

    test('Kutt av datoer for en permitteringsperiode', () => {
        const startIntervall = dayjs('2020-02-14');
        const sluttIntervall = dayjs('2020-05-02');

        const intervall: DatoIntervall = {
            datoFra: startIntervall,
            datoTil: sluttIntervall,
        };
        const startKuttDato = dayjs('2020-03-02');
        const sluttKuttDato = dayjs('2020-04-20');

        const nyttIntervall: DatoIntervall = kuttAvDatoIntervallInnefor18mnd(
            intervall,
            startKuttDato,
            sluttKuttDato
        );
        expect(nyttIntervall.datoFra).toEqual(startKuttDato);
        expect(nyttIntervall.datoTil).toEqual(sluttKuttDato);
    });
});
