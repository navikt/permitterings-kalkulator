import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import dayjs from 'dayjs';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnPermitteringssituasjon,
    getPermitteringsoversiktFor18Måneder,
    Permitteringssituasjon,
} from './beregningerForAGP2';
import { configureDayJS } from '../../../dayjs-config';
import { finnDato18MndTilbake } from './dato-utils';
import {
    finnInitialgrenserForTidslinjedatoer,
    konstruerTidslinje,
    regnUtHvaSisteDatoPåTidslinjenSkalVære,
} from './tidslinje-utils';

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

describe('Tester for beregningerForAGP2', () => {
    describe('Tester for finnPermitteringssituasjon', () => {
        test('Skal returnere AGP2_NÅDD_VED_INNFØRINGSDATO i riktig tilfelle', () => {
            const innføringsdatoAGP2 = dayjs('2021-06-01');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: innføringsdatoAGP2.subtract(210, 'days'),
                        datoTil: innføringsdatoAGP2,
                    },
                ],
                andreFraværsperioder: [],
            });
            const situasjon = finnPermitteringssituasjon(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            expect(situasjon).toEqual(
                Permitteringssituasjon.AGP2_NÅDD_VED_INNFØRINGSDATO
            );
        });

        test('Skal returnere AGP2_NÅDD_ETTER_INNFØRINGSDATO i riktig tilfelle, med løpende permittering', () => {
            const innføringsdatoAGP2 = dayjs('2021-06-01');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: innføringsdatoAGP2.subtract(209, 'days'),
                        erLøpende: true,
                    },
                ],
                andreFraværsperioder: [],
            });
            const situasjon = finnPermitteringssituasjon(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            expect(situasjon).toEqual(
                Permitteringssituasjon.AGP2_NÅDD_ETTER_INNFØRINGSDATO
            );
        });

        test('Skal returnere AGP2_NÅDD_ETTER_INNFØRINGSDATO i riktig tilfelle, med fast permitteringsintervall', () => {
            const innføringsdatoAGP2 = dayjs('2021-06-01');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: innføringsdatoAGP2.subtract(209, 'days'),
                        datoTil: innføringsdatoAGP2.add(1, 'day'),
                    },
                ],
                andreFraværsperioder: [],
            });
            const situasjon = finnPermitteringssituasjon(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            expect(situasjon).toEqual(
                Permitteringssituasjon.AGP2_NÅDD_ETTER_INNFØRINGSDATO
            );
        });

        test('Skal returnere AGP2_IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT i riktig tilfelle', () => {
            const innføringsdatoAGP2 = dayjs('2021-06-01');
            const permitteringsstart = innføringsdatoAGP2.subtract(23, 'days');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: permitteringsstart,
                        datoTil: permitteringsstart.add(209, 'days'),
                    },
                ],
                andreFraværsperioder: [],
            });
            const situasjon = finnPermitteringssituasjon(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            expect(situasjon).toEqual(
                Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT
            );
        });

        test('Skal returnere AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_VED_INNFØRINGSDATO i riktig tilfelle', () => {
            const innføringsdatoAGP2 = dayjs('2021-06-01');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: innføringsdatoAGP2.subtract(211, 'days'),
                        datoTil: innføringsdatoAGP2.subtract(1, 'day'),
                    },
                ],
                andreFraværsperioder: [],
            });
            const situasjon = finnPermitteringssituasjon(
                tidslinje,
                innføringsdatoAGP2,
                210
            );
            expect(situasjon).toEqual(
                Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_VED_INNFØRINGSDATO
            );
        });
    });

    describe('Tester for finn18mndsperiodeForMaksimeringAvPermitteringsdager', () => {
        test('relevant 18-mnds periode begynner ved andre permitteringsperiode', () => {
            const innføringsdatoAGP2 = dayjs('2021-06-01');
            const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
                permitteringer: [
                    {
                        datoFra: dayjs('2019-11-20'),
                        datoTil: dayjs('2020-01-30'),
                    },
                    {
                        datoFra: dayjs('2020-04-21'),
                        datoTil: dayjs('2020-06-01'),
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
                innføringsdatoAGP2,
                dagensDato,
                210
            );
            expect(aktuellPeriode?.datoFra).toEqual(dayjs('2020-04-21'));
        });
    });

    describe('Tester for getPermitteringsoversikt', () => {
        test('Antall dager brukt skal være antall permitteringsdager, hvis ingen fravær', () => {
            const innføringsdatoAGP2 = dayjs('2021-06-01');
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
                innføringsdatoAGP2
            );
            expect(dagerBrukt).toEqual(51);
        });

        test('skal trekke fra fraværsdager under permittering', () => {
            const innføringsdatoAGP2 = dayjs('2021-06-01');
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
                innføringsdatoAGP2
            );
            expect(oversikt).toEqual({
                dagerBrukt: 30,
                dagerAnnetFravær: 21,
                dagerPermittert: 51,
            });
        });
        test('skal bare telle med fraværsdager som overlapper med permittering', () => {
            const innføringsdatoAGP2 = dayjs('2021-06-01');
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
                innføringsdatoAGP2
            );

            expect(oversikt).toEqual({
                dagerBrukt: 20,
                dagerAnnetFravær: 31,
                dagerPermittert: 51,
            });
        });

        test('skal bare telle permitteringsdager i 18mndsperioden før innføringsdato', () => {
            const innføringsdatoAGP2 = dayjs('2021-06-01');
            const start18mndsperiode = finnDato18MndTilbake(innføringsdatoAGP2);
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
                innføringsdatoAGP2
            );
            expect(dagerBrukt).toEqual(21);
        });
    });
});
