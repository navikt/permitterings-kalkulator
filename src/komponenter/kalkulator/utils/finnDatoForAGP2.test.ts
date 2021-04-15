import dayjs from 'dayjs';
import {
    finnDatoForAGP2,
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
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder
): DatoMedKategori[] => {
    const dagensDato = dayjs('2021-03-11');
    return konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        regnUtHvaSisteDatoPåTidslinjenSkalVære(
            allePermitteringerOgFravær,
            dagensDato
        )!
    );
};

describe('Tester for finnDatoForAGP2', () => {
    test('AGP2 skal komme på innføringsdato hvis permittert i 30 uker og 1 dag', () => {
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
    test('Skal gi dato for AGP2 hvis man først er permittert > 30 uker, deretter faller under 30 uker, og så krysser 30 uker igjen', () => {
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
        expect(datoAGP2).toEqual(innføringsdatoAGP2.add(15, 'weeks'));
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

    })
});
