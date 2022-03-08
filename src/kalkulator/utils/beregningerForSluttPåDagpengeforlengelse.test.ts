import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import dayjs from 'dayjs';

import { konstruerTidslinje } from './tidslinje-utils';
import {
    finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli,
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

describe('Tester for beregning av permitteringssituasjon ved dato der dagpengefoelngelsen avsluttes og permitteringen løper på koronaregelverk', () => {
    describe('Tester for finnPermitteringssituasjon1November', () => {
        test('Skal returnere MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE', () => {
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

        test('Skal returnere at maks antall dager er nådd etter sluttdato av forlengelse løpende permittering iverksatt før 1. juli', () => {
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

        test('Skal gi samme dato for maks permittering nådd når en permittering er løpende som når en permittering er aktiv etter dagens dato', () => {
            const maksAntallPermitteringsuker = 49;
            const tidslinje1 = getTidslinje({
                permitteringer: [
                    {
                        datoFra: datoSluttPåDagpengeforlengelse.subtract(
                            5,
                            'weeks'
                        ),
                        erLøpende: true,
                    },
                ],
                andreFraværsperioder: [],
            });
            const tidslinje2 = getTidslinje({
                permitteringer: [
                    {
                        datoFra: datoSluttPåDagpengeforlengelse.subtract(
                            5,
                            'weeks'
                        ),
                        datoTil: dagensDato.add(10, 'days'),
                    },
                ],
                andreFraværsperioder: [],
            });
            const datoMaksAntallDagerNådd1 = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
                tidslinje1,
                datoSluttPåDagpengeforlengelse,
                maksAntallPermitteringsuker * 7,
                dagensDato
            );
            const datoMaksAntallDagerNådd2 = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
                tidslinje2,
                datoSluttPåDagpengeforlengelse,
                maksAntallPermitteringsuker * 7,
                dagensDato
            );
            expect(datoMaksAntallDagerNådd1).toEqual(datoMaksAntallDagerNådd2);
        });
    });
});
