import dayjs from 'dayjs';

import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import { konstruerTidslinje } from './tidslinje-utils';
import {
    finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli,
    getPermitteringsoversikt,
} from './beregningerForSluttPåDagpengeforlengelse';
import { finnDatoForMaksPermitteringNormaltRegelverk } from './beregningForMaksPermitteringsdagerNormaltRegelverk';
import { maksAntallDagerPermittertKoronaordning } from '../../konstanterKnyttetTilRegelverk';

const dagensDato = dayjs().startOf('date');
const datoSluttPåDagepengeforlengelse = dayjs('2022-04-01');

const getTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder
): DatoMedKategori[] => {
    return konstruerTidslinje(allePermitteringerOgFravær, dagensDato);
};

describe('Tester for finnDatoForMaksPermittering for permitteringer iverksatt før 1. juli ', () => {
    test('Maks antall dager permittering skal komme på slutt på forlengelse av dagpengeordning innfør i forbindelse med korona hvis permittert i 49 uker og 1 dag ved 1 november og permitteringen er iverksatt før 1. juli', () => {
        const maksAntallPermitteringsdager = maksAntallDagerPermittertKoronaordning;
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: datoSluttPåDagepengeforlengelse.subtract(
                        maksAntallPermitteringsdager,
                        'days'
                    ),
                    erLøpende: true,
                },
            ],
            andreFraværsperioder: [],
        });
        const datoOverskriderMaksgrense = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
            tidslinje,
            datoSluttPåDagepengeforlengelse,
            maksAntallPermitteringsdager,
            dagensDato
        );
        expect(datoOverskriderMaksgrense).toEqual(
            datoSluttPåDagepengeforlengelse
        );
    });

    test('Maks antall dager permittering være datoen da slutt på forlengelse av dagpengeordning innfør i forbindelse med korona, dersom permittert i nøyaktig 49 uker. ', () => {
        const maksAntallPermitteringsdager = maksAntallDagerPermittertKoronaordning;
        const tidslinje = getTidslinje({
            permitteringer: [
                {
                    datoFra: datoSluttPåDagepengeforlengelse.subtract(
                        maksAntallPermitteringsdager,
                        'days'
                    ),
                    erLøpende: true,
                },
            ],
            andreFraværsperioder: [],
        });
        const datoOverskriderMaksgrense = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
            tidslinje,
            datoSluttPåDagepengeforlengelse,
            maksAntallPermitteringsdager,
            dagensDato
        );
        expect(datoOverskriderMaksgrense).toEqual(
            datoSluttPåDagepengeforlengelse
        );
    });
});

test('Maks antall dager permittering skal komme på regelverksending (datoen dagpengeforlengelsen som var innført under koronapandemien er slutt)', () => {
    const maksAntallPermitteringsdager = maksAntallDagerPermittertKoronaordning;
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: datoSluttPåDagepengeforlengelse.subtract(
                    maksAntallPermitteringsdager / 7 + 15,
                    'weeks'
                ),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    });
    const datoOverskriderMaksgrense = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
        tidslinje,
        datoSluttPåDagepengeforlengelse,
        maksAntallPermitteringsdager,
        dagensDato
    );
    expect(datoOverskriderMaksgrense).toEqual(datoSluttPåDagepengeforlengelse);
});

test('Skal finne dato for maks antall dager ved løpende permittering med oppstart før 1. juli (regelendring 1. juli)', () => {
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: datoSluttPåDagepengeforlengelse.subtract(
                    5 * 7,
                    'days'
                ),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    });
    const datoMaksAntallDagerNådd = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
        tidslinje,
        datoSluttPåDagepengeforlengelse,
        maksAntallDagerPermittertKoronaordning,
        dagensDato
    );
    const permitteringPåHeleTidslinja = getPermitteringsoversikt(tidslinje, {
        datoFra: tidslinje[0].dato,
        datoTil: tidslinje[tidslinje.length - 1].dato,
    }).dagerBrukt;
    const inntastetPermittering = getPermitteringsoversikt(tidslinje, {
        datoFra: datoSluttPåDagepengeforlengelse.subtract(5 * 7, 'days'),
        datoTil: tidslinje[tidslinje.length - 1].dato,
    }).dagerBrukt;
    expect(permitteringPåHeleTidslinja).toEqual(inntastetPermittering);
    expect(datoMaksAntallDagerNådd).toEqual(
        datoSluttPåDagepengeforlengelse.add((49 - 5) * 7 - 1, 'days')
    );
});

test('Skal håndtere løpende permittering etter slutt på dagpengeforlengelse, normalt regelverk', () => {
    const maksAntallPermitteringsdager = 26 * 7;
    const forstePermitteringsdato = dayjs('2022-05-01');
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: forstePermitteringsdato,
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    });
    const datoForMaksAntallDagerNådd = finnDatoForMaksPermitteringNormaltRegelverk(
        tidslinje,
        datoSluttPåDagepengeforlengelse,
        maksAntallPermitteringsdager
    );
    const dagerPermittertIPeriode = getPermitteringsoversikt(tidslinje, {
        datoFra: forstePermitteringsdato,
        datoTil: datoForMaksAntallDagerNådd!!,
    }).dagerBrukt;
    expect(dagerPermittertIPeriode).toEqual(maksAntallPermitteringsdager);
    expect(datoForMaksAntallDagerNådd).toEqual(
        dayjs(forstePermitteringsdato).add(
            maksAntallPermitteringsdager - 1,
            'days'
        )
    );
});

test('Skal håndtere lang permitteringsperiode etter innføringsdato for regelendring', () => {
    const maksAntallPermitteringsdager = 26 * 7;
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: datoSluttPåDagepengeforlengelse.add(1, 'month'),
                datoTil: datoSluttPåDagepengeforlengelse.add(11, 'months'),
            },
        ],
        andreFraværsperioder: [],
    });
    const datoMaksAntallDagerNådd = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
        tidslinje,
        datoSluttPåDagepengeforlengelse,
        maksAntallPermitteringsdager,
        dagensDato
    );
    expect(datoMaksAntallDagerNådd).toEqual(
        datoSluttPåDagepengeforlengelse
            .add(1, 'month')
            .add(maksAntallPermitteringsdager - 1, 'days')
    );
});

test('Maks antall permitteringsdager er nådd ved innføringsdato av regelendring, selv om det er et fravær på den datoen', () => {
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: datoSluttPåDagepengeforlengelse.subtract(
                    maksAntallDagerPermittertKoronaordning + 20,
                    'days'
                ),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [
            {
                datoFra: datoSluttPåDagepengeforlengelse.subtract(2, 'days'),
                datoTil: datoSluttPåDagepengeforlengelse.add(2, 'days'),
            },
        ],
    });
    const datoMaksAntallDagerNådd = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
        tidslinje,
        datoSluttPåDagepengeforlengelse,
        maksAntallDagerPermittertKoronaordning,
        dagensDato
    );
    expect(datoMaksAntallDagerNådd).toEqual(datoSluttPåDagepengeforlengelse);
});
