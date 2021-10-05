import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import dayjs from 'dayjs';

import { finnDato18MndTilbake } from './dato-utils';
import {
    finnInitialgrenserForTidslinjedatoer,
    konstruerTidslinje,
    regnUtHvaSisteDatoPåTidslinjenSkalVære,
} from './tidslinje-utils';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnPermitteringssituasjon1November,
    getPermitteringsoversiktFor18Måneder,
    Permitteringssituasjon1November,
} from './beregningerForRegelverksendring1Nov';

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

describe('Tester for beregning av permitteringssituasjon ved regelverksendring 1. november 2021', () => {
    describe('Tester for finnPermitteringssituasjon1November', () => {
        test('Skal returnere MAKS_NÅDD_1_NOVEMBER i riktig tilfelle', () => {
            const maksAntallPermitteringsdager = 49 * 7;
            const innføringsdatoRegelendring1November = dayjs('2021-11-01');
            const innføringsdatoRegelendring1Juli = dayjs('2021-07-01');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: innføringsdatoRegelendring1November.subtract(
                            maksAntallPermitteringsdager,
                            'days'
                        ),
                        datoTil: innføringsdatoRegelendring1November,
                    },
                ],
                andreFraværsperioder: [],
            });
            const situasjon = finnPermitteringssituasjon1November(
                tidslinje,
                innføringsdatoRegelendring1November,
                innføringsdatoRegelendring1Juli,
                maksAntallPermitteringsdager,
                true
            );
            expect(situasjon).toEqual(
                Permitteringssituasjon1November.MAKS_NÅDD_1_NOVEMBER_LØPENDE
            );
        });

        test('Skal returnere at maks antall dager er nådd etter 10. november ved løpende permittering iverksatt før 1. juli', () => {
            const maksAntallPermitteringsdager = 49 * 7;
            const innføringsdatoRegelendring1November = dayjs('2021-11-01');
            const innføringsdatoRegelendring1Juli = dayjs('2021-07-01');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: innføringsdatoRegelendring1November.subtract(
                            maksAntallPermitteringsdager - 1,
                            'days'
                        ),
                        erLøpende: true,
                    },
                ],
                andreFraværsperioder: [],
            });
            const situasjon = finnPermitteringssituasjon1November(
                tidslinje,
                innføringsdatoRegelendring1November,
                innføringsdatoRegelendring1Juli,
                maksAntallPermitteringsdager,
                true
            );
            expect(situasjon).toEqual(
                Permitteringssituasjon1November.MAKS_NÅDD_ETTER_1_NOVEMBER_LØPENDE
            );
        });
    });

    describe('Tester for finn18mndsperiodeForMaksimeringAvPermitteringsdager', () => {
        test('relevant 18-mnds periode begynner ved andre permitteringsperiode', () => {
            const maksAntallPermitteringsdager = 49 * 7;
            const innføringsdatoRegelendring = dayjs('2021-11-01');
            const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
                permitteringer: [
                    {
                        datoFra: dayjs('2019-11-20'),
                        datoTil: dayjs('2020-01-30'),
                    },
                    {
                        datoFra: dayjs('2020-07-21'),
                        datoTil: dayjs('2020-09-01'),
                    },
                ],
                andreFraværsperioder: [],
            };
            const dagensDato = dayjs('2021-03-11');
            const tidslinje = konstruerTidslinje(
                allePermitteringerOgFravær,
                dagensDato,
                finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil!
            );
            const aktuellPeriode = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                innføringsdatoRegelendring,
                dagensDato,
                maksAntallPermitteringsdager
            );
            expect(aktuellPeriode?.datoFra).toEqual(dayjs('2020-07-21'));
        });
    });

    describe('Tester for getPermitteringsoversikt', () => {
        test('Antall dager brukt skal være antall permitteringsdager, hvis ingen fravær', () => {
            const innføringsdatoRegelendring = dayjs('2021-11-01');
            const permitteringsstart = dayjs('2021-03-01');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: permitteringsstart,
                        datoTil: permitteringsstart.add(50, 'days'),
                    },
                ],
                andreFraværsperioder: [],
            });
            const { dagerBrukt } = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                innføringsdatoRegelendring
            );
            expect(dagerBrukt).toEqual(51);
        });

        test('skal trekke fra fraværsdager under permittering', () => {
            const innføringsdatoRegelendring = dayjs('2021-11-01');
            const permitteringsstart = dayjs('2021-03-01');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: permitteringsstart,
                        datoTil: permitteringsstart.add(50, 'days'),
                    },
                ],
                andreFraværsperioder: [
                    {
                        datoFra: permitteringsstart.add(5, 'days'),
                        datoTil: permitteringsstart.add(25, 'days'),
                    },
                ],
            });
            const oversikt = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                innføringsdatoRegelendring
            );
            expect(oversikt).toEqual({
                dagerBrukt: 30,
                dagerAnnetFravær: 21,
                dagerPermittert: 51,
            });
        });
        test('skal bare telle med fraværsdager som overlapper med permittering', () => {
            const innføringsdatoRegelendring = dayjs('2021-11-01');
            const permitteringsstart = dayjs('2020-07-01');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: permitteringsstart,
                        datoTil: permitteringsstart.add(50, 'days'),
                    },
                ],
                andreFraværsperioder: [
                    {
                        datoFra: permitteringsstart.add(20, 'days'),
                        datoTil: permitteringsstart.add(70, 'days'),
                    },
                ],
            });
            const oversikt = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                innføringsdatoRegelendring
            );

            expect(oversikt).toEqual({
                dagerBrukt: 20,
                dagerAnnetFravær: 31,
                dagerPermittert: 51,
            });
        });

        //vet ikke om er relevant
        test('skal bare telle permitteringsdager i 18mndsperioden før innføringsdato', () => {
            const innføringsdatoRegelendring = dayjs('2021-11-01');
            const start18mndsperiode = finnDato18MndTilbake(
                innføringsdatoRegelendring
            );
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: start18mndsperiode.subtract(20, 'days'),
                        datoTil: start18mndsperiode.add(20, 'days'),
                    },
                ],
                andreFraværsperioder: [],
            });
            const { dagerBrukt } = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                innføringsdatoRegelendring
            );
            expect(dagerBrukt).toEqual(21);
        });
    });
});
