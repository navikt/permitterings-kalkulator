import {
    finnInitialgrenserForTidslinjedatoer,
    konstruerTidslinje,
} from './tidslinje-utils';
import dayjs from 'dayjs';
import {
    antallDagerGått,
    finnSisteTilDato,
    finnTidligsteFraDato,
    datoIntervallOverlapperMedPerioder,
    get5FørsteHverdager,
    getAntallOverlappendeDager,
    getOverlappendePeriode,
    getSenesteDato,
    getTidligsteDato,
    perioderOverlapper,
    tilGyldigDatoIntervall,
} from './dato-utils';
import { DatoIntervall } from '../typer';
import { configureDayJS } from '../../../dayjs-config';

configureDayJS();

describe('Tester for dato-utils.ts', () => {
    test('antall dager mellom to datoer teller riktig for et tilfeldig utvalg av 1000 datoer i tidslinja', () => {
        const tidslinje = konstruerTidslinje(
            { permitteringer: [], andreFraværsperioder: [] },
            dayjs().startOf('date'),
            finnInitialgrenserForTidslinjedatoer(dayjs().startOf('date'))
                .datoTil
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
            finnTidligsteFraDato(
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
            finnSisteTilDato(
                Array.of(
                    permitteringsPeriode1,
                    permitteringsPeriode2,
                    permitteringsPeriode3,
                    permitteringsPeriode4
                )
            )
        ).toEqual(dayjs('2021-06-02'));
    });

    test('getAntallOverlappendeDager skal telle riktig når ett intervall er løpende', () => {
        const løpendeIntervall: DatoIntervall = {
            datoFra: dayjs('2021-03-1'),
            erLøpende: true,
        };
        const annetIntervall: DatoIntervall = {
            datoFra: dayjs('2021-02-14'),
            datoTil: dayjs('2021-03-14'),
        };

        expect(
            getAntallOverlappendeDager(løpendeIntervall, annetIntervall)
        ).toEqual(14);
    });

    test('getTidligsteDato skal finne tidligste dato', () => {
        expect(
            getTidligsteDato([
                undefined,
                dayjs('2021-03-1'),
                dayjs('2020-03-1'),
                dayjs('2023-03-2'),
                undefined,
                dayjs('2021-03-1'),
            ])
        ).toEqual(dayjs('2020-03-1'));
    });

    test('getSenesteDato skal finne seneste dato', () => {
        expect(
            getSenesteDato([
                undefined,
                dayjs('2021-03-1'),
                dayjs('2020-03-1'),
                dayjs('2023-03-2'),
                undefined,
                dayjs('2021-03-1'),
            ])
        ).toEqual(dayjs('2023-03-2'));
    });

    test('get5FørsteHverdager skal returnere de 5 neste hverdagene', () => {
        expect(get5FørsteHverdager(dayjs('2021-04-8'))).toEqual([
            dayjs('2021-04-8'),
            dayjs('2021-04-9'),
            dayjs('2021-04-12'),
            dayjs('2021-04-13'),
            dayjs('2021-04-14'),
        ]);
    });

    test('tilGyldigDatoIntervall skal håndtere undefined input', () => {
        expect(tilGyldigDatoIntervall({})).toEqual(undefined);
    });

    describe('Tester for getOverlappendePeriode', () => {
        test('Skal returnere overlappende periode for faste perioder', () => {
            const overlappendePeriode = getOverlappendePeriode(
                {
                    datoFra: dayjs('2021-03-1'),
                    datoTil: dayjs('2021-03-20'),
                },
                {
                    datoFra: dayjs('2021-02-13'),
                    datoTil: dayjs('2021-03-10'),
                }
            );
            expect(overlappendePeriode).toEqual({
                datoFra: dayjs('2021-03-01'),
                datoTil: dayjs('2021-03-10'),
            });
        });

        test('Skal returnere overlappende periode for løpende perioder', () => {
            const overlappendePeriode = getOverlappendePeriode(
                {
                    datoFra: dayjs('2021-03-1'),
                    erLøpende: true,
                },
                {
                    datoFra: dayjs('2021-02-13'),
                    erLøpende: true,
                }
            );
            expect(overlappendePeriode).toEqual({
                datoFra: dayjs('2021-03-01'),
                erLøpende: true,
            });
        });

        test('Skal returnere overlappende periode hvis én periode er løpende og den andre er fast', () => {
            const overlappendePeriode = getOverlappendePeriode(
                {
                    datoFra: dayjs('2021-03-1'),
                    erLøpende: true,
                },
                {
                    datoFra: dayjs('2021-02-13'),
                    datoTil: dayjs('2021-03-10'),
                }
            );
            expect(overlappendePeriode).toEqual({
                datoFra: dayjs('2021-03-01'),
                datoTil: dayjs('2021-03-10'),
            });
        });

        test('Skal returnere undefined hvis periodene ikke overlapper', () => {
            const overlappendePeriode = getOverlappendePeriode(
                {
                    datoFra: dayjs('2021-03-1'),
                    erLøpende: true,
                },
                {
                    datoFra: dayjs('2021-01-13'),
                    datoTil: dayjs('2021-02-10'),
                }
            );
            expect(overlappendePeriode).toEqual(undefined);
        });
    });

    describe('Tester for perioderOverlapper', () => {
        test('Skal returnere true hvis periodene overlapper', () => {
            const overlapper = perioderOverlapper([
                {
                    datoFra: dayjs('2021-02-10'),
                    erLøpende: true,
                },
                {
                    datoFra: dayjs('2021-01-13'),
                    datoTil: dayjs('2021-02-10'),
                },
            ]);
            expect(overlapper).toBeTruthy();
        });
        test('Skal returnere false hvis periodene ikke overlapper', () => {
            const overlapper = perioderOverlapper([
                {
                    datoFra: dayjs('2021-02-11'),
                    erLøpende: true,
                },
                {
                    datoFra: dayjs('2021-01-13'),
                    datoTil: dayjs('2021-02-10'),
                },
            ]);
            expect(overlapper).toBeFalsy();
        });
    });

    describe('Tester for fraværInngårIPermitteringsperioder', () => {
        test('fraværInngårIPermitteringsperioder skal gi false hvis fraværet er helt utenfor permitteringsperiodene', () => {
            expect(
                datoIntervallOverlapperMedPerioder(
                    [
                        {
                            datoFra: dayjs('2021-03-1'),
                            datoTil: dayjs('2021-05-1'),
                        },
                        {
                            datoFra: dayjs('2020-03-1'),
                            datoTil: dayjs('2020-05-1'),
                        },
                    ],
                    {
                        datoFra: dayjs('2021-06-1'),
                        datoTil: dayjs('2021-07-1'),
                    }
                )
            ).toBeFalsy();
        });

        test('fraværInngårIPermitteringsperioder skal gi true hvis fraværet overlapper helt eller delvis med permitteringsperiodene', () => {
            expect(
                datoIntervallOverlapperMedPerioder(
                    [
                        {
                            datoFra: dayjs('2021-03-1'),
                            datoTil: dayjs('2021-05-1'),
                        },
                        {
                            datoFra: dayjs('2020-03-1'),
                            datoTil: dayjs('2020-05-1'),
                        },
                    ],
                    {
                        datoFra: dayjs('2021-05-1'),
                        datoTil: dayjs('2021-05-2'),
                    }
                )
            ).toBeTruthy();
        });

        test('fraværInngårIPermitteringsperioder skal gi false hvis fraværet ikke er ordentlig definert', () => {
            expect(
                datoIntervallOverlapperMedPerioder(
                    [
                        {
                            datoFra: dayjs('2021-03-1'),
                            datoTil: dayjs('2021-05-1'),
                        },
                        {
                            datoFra: dayjs('2020-03-1'),
                            datoTil: dayjs('2020-05-1'),
                        },
                    ],
                    {
                        datoFra: dayjs('2021-03-1'),
                    }
                )
            ).toBeFalsy();
        });
    });
});
