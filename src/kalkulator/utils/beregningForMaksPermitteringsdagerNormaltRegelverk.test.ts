import { DatoIntervall } from '../typer';
import dayjs, { Dayjs } from 'dayjs';
import {
    finnFørsteDatoMedPermitteringUtenFravær,
    finnInitialgrenserForTidslinjedatoer,
    konstruerTidslinje,
} from './tidslinje-utils';

describe('Tester for beregning av permitteringssituasjon ved avsluttede permitteringer iverksatt før 1. juli, og ny igangsatt permittering etter 1. juli', () => {
    test('alle permitteringsdager før 1. juli blir slettet', () => {
        const datoRegelEndring = dayjs('2021-07-01');
        const permitteringsPeriodeFør1Juli: DatoIntervall = {
            datoFra: dayjs('2021-04-01'),
            datoTil: dayjs('2021-05-01'),
        };
        const permitteringsPeriodeFra1Juli: DatoIntervall = {
            datoFra: dayjs('2021-07-01'),
            datoTil: dayjs('2021-08-01'),
        };
        const dagensDato = dayjs('2021-07-29');
        const tidslinje = konstruerTidslinje(
            {
                permitteringer: [
                    permitteringsPeriodeFra1Juli,
                    permitteringsPeriodeFør1Juli,
                ],
                andreFraværsperioder: [],
            },
            dagensDato,
            finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil
        );
        const førstePermitteringsdag = finnFørsteDatoMedPermitteringUtenFravær(
            tidslinje,
            datoRegelEndring.subtract(1, 'days')
        );
        expect(førstePermitteringsdag?.dato).toStrictEqual(datoRegelEndring);
    });

    test('alle permitteringsdager før 1. juli blir slettet, også ved ny løpende permittering', () => {
        const datoRegelEndring = dayjs('2021-07-01');
        const permitteringsPeriodeFør1Juli: DatoIntervall = {
            datoFra: dayjs('2021-04-01'),
            datoTil: dayjs('2021-05-01'),
        };
        const permitteringsPeriodeFra1Juli: DatoIntervall = {
            datoFra: dayjs('2021-07-01'),
            erLøpende: true,
        };
        const dagensDato = dayjs('2021-07-29');
        const tidslinje = konstruerTidslinje(
            {
                permitteringer: [
                    permitteringsPeriodeFra1Juli,
                    permitteringsPeriodeFør1Juli,
                ],
                andreFraværsperioder: [],
            },
            dagensDato,
            finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil
        );
        const førstePermitteringsdag = finnFørsteDatoMedPermitteringUtenFravær(
            tidslinje,
            datoRegelEndring.subtract(1, 'days')
        );
        expect(førstePermitteringsdag?.dato).toStrictEqual(datoRegelEndring);
    });
});
