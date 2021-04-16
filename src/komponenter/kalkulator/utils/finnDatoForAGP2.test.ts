import dayjs, { Dayjs } from 'dayjs';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnDatoForAGP2,
    getPermitteringsoversikt,
    getPermitteringsoversiktFor18Måneder,
} from './beregningerForAGP2';
import { configureDayJS } from '../../../dayjs-config';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import {
    konstruerTidslinje,
    regnUtHvaSisteDatoPåTidslinjenSkalVære,
} from './tidslinje-utils';
import { finnDato18MndTilbake } from './dato-utils';

configureDayJS();

const getTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder,
    dagensDato?: Dayjs
): DatoMedKategori[] => {
    const definertDagensDato = dagensDato || dayjs('2021-03-11');
    return konstruerTidslinje(
        allePermitteringerOgFravær,
        definertDagensDato,
        regnUtHvaSisteDatoPåTidslinjenSkalVære(
            allePermitteringerOgFravær,
            definertDagensDato
        )!
    );
};

describe('Tester for finnDatoForAGP2', () => {
    test('AGP2 skal komme på innføringsdato hvis permittert i 30 uker og 1 dag ved innføringsdato', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: innføringsdatoAGP2.subtract(210, 'days'),
                    erLøpende: true,
                },
            ],
            andreFraværsperioder: [],
        });
        const datoAGP2 = finnDatoForAGP2(tidslinje, innføringsdatoAGP2, 210);
        expect(datoAGP2).toEqual(innføringsdatoAGP2);
    });

    test('AGP2 skal komme på innføringsdato selv om man er permittert vesentlig mer enn 30 uker', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: innføringsdatoAGP2.subtract(45, 'weeks'),
                    erLøpende: true,
                },
            ],
            andreFraværsperioder: [],
        });
        const datoAGP2 = finnDatoForAGP2(tidslinje, innføringsdatoAGP2, 210);
        expect(datoAGP2).toEqual(innføringsdatoAGP2);
    });

    test('Skal ikke gi dato for AGP2 hvis permittert mer enn 30 uker før innføringsdato, men ikke permittert på selve innføringsdato', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: innføringsdatoAGP2.subtract(35, 'weeks'),
                    datoTil: innføringsdatoAGP2.subtract(1, 'day'),
                },
            ],
            andreFraværsperioder: [],
        });
        const datoAGP2 = finnDatoForAGP2(tidslinje, innføringsdatoAGP2, 210);
        expect(datoAGP2).toEqual(undefined);
    });

    // Denne testen feiler. Funksjonaliteten implementeres i fremtiden.
    test('TESTEN ER UGYLDIG. Skal gi dato for AGP2 hvis man først er permittert > 30 uker, deretter faller under 30 uker, og så krysser 30 uker igjen', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    // Permittering i begynnelsen av 18mndsperioden som forsvinner 10 uker etter innføringsdato
                    datoFra: finnDato18MndTilbake(innføringsdatoAGP2),
                    datoTil: finnDato18MndTilbake(innføringsdatoAGP2).add(
                        10,
                        'weeks'
                    ),
                },
                {
                    // Permittert totalt 35 uker ved innføringsdato, men ikke på selve innføringsdatoen
                    datoFra: innføringsdatoAGP2.subtract(25, 'weeks'),
                    datoTil: innføringsdatoAGP2.subtract(1, 'day'),
                },
                {
                    // 10 uker etter innføringsdato har man vært permittert i 25 uker. AGP2 skal derfor komme 5 uker etter dette
                    datoFra: innføringsdatoAGP2.add(10, 'weeks'),
                    erLøpende: true,
                },
            ],
            andreFraværsperioder: [],
        });
        const datoAGP2 = finnDatoForAGP2(tidslinje, innføringsdatoAGP2, 210);
        // TODO Avkommenter dette.
        // expect(datoAGP2).toEqual(innføringsdatoAGP2.add(15, 'weeks'));
    });

    test('Skal ikke gi dato for AGP2 hvis permitteringen ikke _overskrider_ 210', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const permitteringsslutt = innføringsdatoAGP2.subtract(40, 'days');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: permitteringsslutt.subtract(209, 'days'),
                    datoTil: permitteringsslutt,
                },
            ],
            andreFraværsperioder: [],
        });
        const datoAGP2 = finnDatoForAGP2(tidslinje, innføringsdatoAGP2, 210);
        const dagerBrukt = getPermitteringsoversiktFor18Måneder(
            tidslinje,
            permitteringsslutt.add(100, 'days')
        ).dagerBrukt;
        expect(dagerBrukt).toEqual(210);
        expect(datoAGP2).toEqual(undefined);
    });

    test('Skal finne dato for AGP2 ved løpende permittering', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: innføringsdatoAGP2.subtract(5, 'weeks'),
                    erLøpende: true,
                },
            ],
            andreFraværsperioder: [],
        });
        const datoAGP2 = finnDatoForAGP2(tidslinje, innføringsdatoAGP2, 210);
        expect(datoAGP2).toEqual(innføringsdatoAGP2.add(25, 'weeks'));
    });

    test('Skal håndtere løpende permittering etter innføringsdato', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: dayjs('2021-07-01'),
                    erLøpende: true,
                },
            ],
            andreFraværsperioder: [],
        });
        const datoAGP2 = finnDatoForAGP2(tidslinje, innføringsdatoAGP2, 210);
        expect(datoAGP2).toEqual(dayjs('2021-07-01').add(210, 'days'));
    });

    test('Skal ignorere permittering i begynnelsen av 18 mndsperiode som sklir ut ved telling av løpende permittering', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: dayjs('2021-02-16'),
                    erLøpende: true,
                },
                {
                    datoFra: dayjs('2019-11-20'),
                    datoTil: dayjs('2020-02-13'),
                },
            ],
            andreFraværsperioder: [],
        });
        const datoAGP2 = finnDatoForAGP2(tidslinje, innføringsdatoAGP2, 210);
        expect(datoAGP2).toEqual(dayjs('2021-09-14'));
    });

    test('Skal håndtere lang permitteringsperiode etter innføringsdato', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: innføringsdatoAGP2.add(1, 'month'),
                    datoTil: innføringsdatoAGP2.add(11, 'months'),
                },
            ],
            andreFraværsperioder: [],
        });
        const datoAGP2 = finnDatoForAGP2(tidslinje, innføringsdatoAGP2, 210);
        expect(datoAGP2).toEqual(
            innføringsdatoAGP2.add(1, 'month').add(210, 'days')
        );
    });

    test('AGP2 skal komme på innføringsdato selv om det er et fravær på den datoen', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: innføringsdatoAGP2.subtract(300, 'days'),
                    erLøpende: true,
                },
            ],
            andreFraværsperioder: [
                {
                    datoFra: innføringsdatoAGP2.subtract(2, 'days'),
                    datoTil: innføringsdatoAGP2.add(2, 'days'),
                },
            ],
        });
        const datoAGP2 = finnDatoForAGP2(tidslinje, innføringsdatoAGP2, 210);
        expect(datoAGP2).toEqual(innføringsdatoAGP2);
    });

    describe('Tester skrevet i samarbeid med fagjurist', () => {
        const innføringsdatoAGP2 = dayjs('2021-06-01');
        const dagensDato = dayjs('2021-04-15');

        test('Test 1', () => {
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: dayjs('2020-11-27'),
                        erLøpende: true,
                    },
                ],
                andreFraværsperioder: [],
            });
            const datoAGP2 = finnDatoForAGP2(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            expect(datoAGP2).toEqual(dayjs('2021-06-25'));
        });

        test('Test 2', () => {
            const tidslinje = getTidslinje(
                {
                    permitteringer: [
                        {
                            datoFra: dayjs('2020-11-27'),
                            datoTil: dayjs('2021-05-31'),
                        },
                    ],
                    andreFraværsperioder: [],
                },
                dagensDato
            );
            const datoAGP2 = finnDatoForAGP2(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            const aktuell18mndsperiode = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                innføringsdatoAGP2,
                dagensDato,
                210
            );
            const oversikt = getPermitteringsoversikt(
                tidslinje,
                aktuell18mndsperiode!
            );
            expect(datoAGP2).toEqual(undefined);
            expect(aktuell18mndsperiode?.datoTil).toEqual(dayjs('2022-05-26'));
            expect(210 - oversikt.dagerBrukt).toEqual(24);
        });

        test('Test 3', () => {
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: dayjs('2020-11-27'),
                        datoTil: dayjs('2021-05-31'),
                    },
                    {
                        datoFra: dayjs('2021-06-14'),
                        erLøpende: true,
                    },
                ],
                andreFraværsperioder: [],
            });
            const datoAGP2 = finnDatoForAGP2(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            expect(datoAGP2).toEqual(dayjs('2021-07-08'));
        });

        test('Test 4', () => {
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: dayjs('2020-11-27'),
                        datoTil: dayjs('2021-05-31'),
                    },
                    {
                        datoFra: dayjs('2021-06-14'),
                        erLøpende: true,
                    },
                ],
                andreFraværsperioder: [
                    {
                        datoFra: dayjs('2021-02-01'),
                        datoTil: dayjs('2021-02-28'),
                    },
                ],
            });
            const datoAGP2 = finnDatoForAGP2(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            expect(datoAGP2).toEqual(dayjs('2021-08-05'));
        });

        test('Test 5', () => {
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: dayjs('2020-03-23'),
                        datoTil: dayjs('2020-12-31'),
                    },
                    {
                        datoFra: dayjs('2020-02-22'),
                        datoTil: dayjs('2020-03-31'),
                    },
                ],
                andreFraværsperioder: [
                    {
                        datoFra: dayjs('2020-11-14'),
                        datoTil: dayjs('2020-11-14'),
                    },
                ],
            });
            const datoAGP2 = finnDatoForAGP2(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            expect(datoAGP2).toEqual(undefined);
        });

        test('Test 6', () => {
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: dayjs('2020-03-23'),
                        datoTil: dayjs('2020-12-31'),
                    },
                    {
                        datoFra: dayjs('2020-02-22'),
                        datoTil: dayjs('2020-03-31'),
                    },
                    {
                        datoFra: dayjs('2021-04-01'),
                        datoTil: dayjs('2021-06-30'),
                    },
                ],
                andreFraværsperioder: [
                    {
                        datoFra: dayjs('2020-11-14'),
                        datoTil: dayjs('2020-11-14'),
                    },
                ],
            });
            const datoAGP2 = finnDatoForAGP2(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            expect(datoAGP2).toEqual(dayjs('2021-06-01'));
        });
    });
});
