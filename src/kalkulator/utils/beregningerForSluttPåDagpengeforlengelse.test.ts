import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import dayjs from 'dayjs';

import { konstruerTidslinje } from './tidslinje-utils';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnPermitteringssituasjonVedSluttPåForlengelse,
    getPermitteringsoversiktFor18Måneder,
    PermitteringssituasjonVedSluttPaForlengelse,
} from './beregningerForSluttPåDagpengeforlengelse';

const datoSluttPåDagpengeforlengelse = dayjs('2022-04-01');
const dagensDato = dayjs().startOf('date');

const getTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder
): DatoMedKategori[] => {
    return konstruerTidslinje(allePermitteringerOgFravær, dagensDato);
};

describe('Tester for beregning av permitteringssituasjon ved dato det dagpengefoelngelsen avsluttes', () => {
    describe('Tester for finnPermitteringssituasjon1November', () => {
        test('Skal returnere MAKS_NÅDD_1_NOVEMBER i riktig tilfelle', () => {
            const maksAntallPermitteringsdager = 49 * 7;
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: datoSluttPåDagpengeforlengelse.subtract(
                            maksAntallPermitteringsdager,
                            'days'
                        ),
                        datoTil: datoSluttPåDagpengeforlengelse,
                    },
                ],
                andreFraværsperioder: [],
            });
            const situasjon = finnPermitteringssituasjonVedSluttPåForlengelse(
                tidslinje,
                datoSluttPåDagpengeforlengelse,
                maksAntallPermitteringsdager
            );
            expect(situasjon).toEqual(
                PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE
            );
        });

        test('Skal returnere at maks antall dager er nådd etter 10. november ved løpende permittering iverksatt før 1. juli', () => {
            const maksAntallPermitteringsdager = 49 * 7;
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: datoSluttPåDagpengeforlengelse.subtract(
                            maksAntallPermitteringsdager - 1,
                            'days'
                        ),
                        erLøpende: true,
                    },
                ],
                andreFraværsperioder: [],
            });
            const situasjon = finnPermitteringssituasjonVedSluttPåForlengelse(
                tidslinje,
                datoSluttPåDagpengeforlengelse,
                maksAntallPermitteringsdager
            );
            const dagerBruktI18mndsperiode = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                datoSluttPåDagpengeforlengelse
            ).dagerBrukt;
            expect(dagerBruktI18mndsperiode).toEqual(49 * 7);
            expect(situasjon).toEqual(
                PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE
            );
        });
    });
});
