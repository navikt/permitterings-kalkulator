import dayjs, { Dayjs } from 'dayjs';

import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import {
    konstruerTidslinje,
    regnUtHvaSisteDatoPåTidslinjenSkalVære,
} from './tidslinje-utils';
import { finnDatoForMaksPermittering } from './beregningerForSluttPåDagpengeforlengelse';
import { getPermitteringsoversiktFor18Måneder } from './beregningForMaksPermitteringsdagerNormaltRegelverk';

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

describe('Tester for finnDatoForMaksPermittering for permitteringer iverksatt før 1. juli ', () => {
    test('Maks antall dager permittering skal komme på regelverksendring 1 november hvis permittert i 49 uker og 1 dag ved 1 november og permitteringen er iverksatt før 1. juli', () => {
        const maksAntallPermitteringsdager = 49 * 7;
        const innføringsdatoRegelendring = dayjs('2021-11-01');
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: innføringsdatoRegelendring.subtract(
                        maksAntallPermitteringsdager,
                        'days'
                    ),
                    erLøpende: true,
                },
            ],
            andreFraværsperioder: [],
        });
        const datoOverskriderMaksgrense = finnDatoForMaksPermittering(
            tidslinje,
            innføringsdatoRegelendring,
            maksAntallPermitteringsdager
        );
        expect(datoOverskriderMaksgrense).toEqual(innføringsdatoRegelendring);
    });
});

test('Maks antall dager permittering skal komme på regelverksending 1. november hvis permittert er vesentlig mer enn 49 uker per 1. november og permitteringen er iverksatt før 1. juli', () => {
    const maksAntallPermitteringsdager = 49 * 7;
    const innføringsdatoRegelendring = dayjs('2021-11-01');
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: innføringsdatoRegelendring.subtract(49 + 15, 'weeks'),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    });
    const datoOverskriderMaksgrense = finnDatoForMaksPermittering(
        tidslinje,
        innføringsdatoRegelendring,
        maksAntallPermitteringsdager
    );
    expect(datoOverskriderMaksgrense).toEqual(innføringsdatoRegelendring);
});

/*

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
*/

test('Skal ikke gi dato for maks permittering nådd når det er permittert mindre en maks antall dager', () => {
    const maksAntallPermitteringsdager = 49 * 7;
    const innføringsdatoRegelendring = dayjs('2021-11-01');
    const permitteringsslutt = innføringsdatoRegelendring.subtract(40, 'days');
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: permitteringsslutt.subtract(
                    maksAntallPermitteringsdager - 1,
                    'days'
                ),
                datoTil: permitteringsslutt,
            },
        ],
        andreFraværsperioder: [],
    });
    const datoForMaksPermitteringNådd = finnDatoForMaksPermittering(
        tidslinje,
        innføringsdatoRegelendring,
        maksAntallPermitteringsdager
    );
    const dagerBrukt = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        permitteringsslutt.add(100, 'days')
    ).dagerBrukt;
    expect(dagerBrukt).toEqual(maksAntallPermitteringsdager);
    expect(datoForMaksPermitteringNådd).toEqual(undefined);
});

test('Skal finne dato for maks antall dager ved løpende permittering med oppstart før 1. juli (regelendring 1. juli)', () => {
    const maksAntallPermitteringsuker = 49;
    const innføringsdatoRegelendring = dayjs('2021-07-01');
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: innføringsdatoRegelendring.subtract(5, 'weeks'),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    });
    const datoMaksAntallDagerNådd = finnDatoForMaksPermittering(
        tidslinje,
        innføringsdatoRegelendring,
        maksAntallPermitteringsuker * 7
    );
    expect(datoMaksAntallDagerNådd).toEqual(
        innføringsdatoRegelendring.add(49 - 5, 'weeks')
    );
});

//denne returnerer 1 dag feil i et tilfelle (muligens klokka var før 12.00)
test('Skal håndtere løpende permittering etter regelsendring 1. juli', () => {
    const maksAntallPermitteringsdager = 26 * 7;
    const innføringsdatoRegelendring = dayjs('2021-07-01');
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: dayjs('2021-08-01'),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    });
    const datoForMaksAntallDagerNådd = finnDatoForMaksPermittering(
        tidslinje,
        innføringsdatoRegelendring,
        maksAntallPermitteringsdager
    );
    expect(datoForMaksAntallDagerNådd).toEqual(
        dayjs('2021-08-01').add(maksAntallPermitteringsdager, 'days')
    );
});

test('Skal ignorere permittering i begynnelsen av 18 mndsperiode som sklir ut ved telling av løpende permittering', () => {
    const innføringsdatoRegelendring = dayjs('2021-07-01');
    const maksAntallPermitteringsdager = 26 * 7;
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
    const datoMaksAntallDagerNådd = finnDatoForMaksPermittering(
        tidslinje,
        innføringsdatoRegelendring,
        maksAntallPermitteringsdager
    );
    expect(datoMaksAntallDagerNådd).toEqual(
        dayjs('2021-02-16').add(maksAntallPermitteringsdager, 'days')
    );
});

test('Skal håndtere lang permitteringsperiode etter innføringsdato for regelendring', () => {
    const innføringsdatoRegelendring = dayjs('2021-07-01');
    const maksAntallPermitteringsdager = 26 * 7;
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: innføringsdatoRegelendring.add(1, 'month'),
                datoTil: innføringsdatoRegelendring.add(11, 'months'),
            },
        ],
        andreFraværsperioder: [],
    });
    const datoMaksAntallDagerNådd = finnDatoForMaksPermittering(
        tidslinje,
        innføringsdatoRegelendring,
        maksAntallPermitteringsdager
    );
    expect(datoMaksAntallDagerNådd).toEqual(
        innføringsdatoRegelendring
            .add(1, 'month')
            .add(maksAntallPermitteringsdager, 'days')
    );
});

test('Maks antall permitteringsdager er nådd ved innføringsdato av regelendring, selv om det er et fravær på den datoen', () => {
    const innføringsdatoRegelendring = dayjs('2021-11-01');
    const maksAntallPermitteringsdager = 49 * 7;
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: innføringsdatoRegelendring.subtract(
                    maksAntallPermitteringsdager + 20,
                    'days'
                ),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [
            {
                datoFra: innføringsdatoRegelendring.subtract(2, 'days'),
                datoTil: innføringsdatoRegelendring.add(2, 'days'),
            },
        ],
    });
    const datoMaksAntallDagerNådd = finnDatoForMaksPermittering(
        tidslinje,
        innføringsdatoRegelendring,
        maksAntallPermitteringsdager
    );
    expect(datoMaksAntallDagerNådd).toEqual(innføringsdatoRegelendring);
});

/*

describe('Tester skrevet i samarbeid med fagjurist', () => {
    const innføringsdatoRegelendring = dayjs('2021-11-01');
    const maksAntallPermitteringsdager = 49 * 7;
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

*/
