import dayjs, { Dayjs } from 'dayjs';

import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import { konstruerTidslinje } from './tidslinje-utils';
import {
    finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli,
    getPermitteringsoversikt,
} from './beregningerForSluttPåDagpengeforlengelse';
import {
    finnDatoForMaksPermitteringNormaltRegelverk,
    getPermitteringsoversiktFor18Måneder,
} from './beregningForMaksPermitteringsdagerNormaltRegelverk';
import { finnDato18MndFram, formaterDato } from './dato-utils';

const dagensDato = dayjs().startOf('date');
const getTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder
): DatoMedKategori[] => {
    return konstruerTidslinje(allePermitteringerOgFravær, dagensDato);
};

const datoSluttPåDagepengeforlengelse = dayjs('2022-04-01');

describe('Tester for finnDatoForMaksPermittering for permitteringer iverksatt før 1. juli ', () => {
    test('Maks antall dager permittering skal komme på slutt på forlengelse av dagpengeordning innfør i forbindelse med korona hvis permittert i 49 uker og 1 dag ved 1 november og permitteringen er iverksatt før 1. juli', () => {
        const maksAntallPermitteringsdager = 49 * 7;
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
        const maksAntallPermitteringsdager = 49 * 7;
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
    const maksAntallPermitteringsdager = 49 * 7;
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: datoSluttPåDagepengeforlengelse.subtract(
                    49 + 15,
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
    const maksAntallPermitteringsuker = 49;

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
        maksAntallPermitteringsuker * 7,
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

test('Skal gi samme dato for maks permittering nådd når en permittering er løpende og når en permittering er aktiv etter dagens dato', () => {
    const maksAntallPermitteringsuker = 49;
    const tidslinje1 = getTidslinje({
        permitteringer: [
            {
                datoFra: datoSluttPåDagepengeforlengelse.subtract(5, 'weeks'),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    });
    const tidslinje2 = getTidslinje({
        permitteringer: [
            {
                datoFra: datoSluttPåDagepengeforlengelse.subtract(5, 'weeks'),
                datoTil: dagensDato.add(10, 'days'),
            },
        ],
        andreFraværsperioder: [],
    });
    const datoMaksAntallDagerNådd1 = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
        tidslinje1,
        datoSluttPåDagepengeforlengelse,
        maksAntallPermitteringsuker * 7,
        dagensDato
    );
    const datoMaksAntallDagerNådd2 = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
        tidslinje2,
        datoSluttPåDagepengeforlengelse,
        maksAntallPermitteringsuker * 7,
        dagensDato
    );
    expect(datoMaksAntallDagerNådd1).toEqual(datoMaksAntallDagerNådd2);
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

test('Skal ignorere permittering i begynnelsen av 18 mndsperiode som sklir ut ved telling av løpende permittering', () => {
    const maksAntallPermitteringsdager = 49 * 7;
    const datoFørstePermitteringsDato = dagensDato.subtract(200, 'days');
    const lengdePåFørstePermittering = (maksAntallPermitteringsdager - 1) / 2;
    const slutt18mndsPeriodeMedStartFørstePermitteringsPeriode = finnDato18MndFram(
        datoFørstePermitteringsDato
    );
    const startDatoLøpendePermittering = slutt18mndsPeriodeMedStartFørstePermitteringsPeriode.subtract(
        lengdePåFørstePermittering - 1,
        'days'
    );

    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: datoFørstePermitteringsDato,
                datoTil: datoFørstePermitteringsDato.add(
                    lengdePåFørstePermittering - 1,
                    'days'
                ),
            },
            {
                datoFra: startDatoLøpendePermittering,
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    });
    //datoene er lagt opp slik at den første permittering glir ut i halen av 18-mndsperioden, da permitteringsperiodene kun når maks antall -1 i dette 18-mndsintervallet-
    const datoDerMaksMinusEnDagNås = slutt18mndsPeriodeMedStartFørstePermitteringsPeriode;
    const antallPermitteringsDagerI18mndsIntervallSomInkludere1Permittering = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        datoDerMaksMinusEnDagNås
    ).dagerBrukt;
    console.log(
        'dager i det intervallet jeg tenkte på: ',
        antallPermitteringsDagerI18mndsIntervallSomInkludere1Permittering
    );
    expect(
        antallPermitteringsDagerI18mndsIntervallSomInkludere1Permittering
    ).toEqual(maksAntallPermitteringsdager - 1);
    const datoMaksAntallDagerNådd = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
        tidslinje,
        datoSluttPåDagepengeforlengelse,
        maksAntallPermitteringsdager,
        dagensDato
    );
    console.log(
        'dato maks nådd i algoritmen' + formaterDato(datoMaksAntallDagerNådd!!),
        getPermitteringsoversiktFor18Måneder(
            tidslinje,
            datoMaksAntallDagerNådd!!
        ).dagerBrukt
    );
    console.log(
        'dato maks i jukseregning',
        formaterDato(
            startDatoLøpendePermittering.add(
                maksAntallPermitteringsdager - 1,
                'days'
            )
        ),
        getPermitteringsoversiktFor18Måneder(
            tidslinje,
            startDatoLøpendePermittering.add(
                maksAntallPermitteringsdager - 1,
                'days'
            )
        ).dagerBrukt
    );
    expect(datoMaksAntallDagerNådd).toEqual(
        startDatoLøpendePermittering.add(
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
    const maksAntallPermitteringsdager = 49 * 7;
    const tidslinje = getTidslinje({
        permitteringer: [
            {
                datoFra: datoSluttPåDagepengeforlengelse.subtract(
                    maksAntallPermitteringsdager + 20,
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
        maksAntallPermitteringsdager,
        dagensDato
    );
    expect(datoMaksAntallDagerNådd).toEqual(datoSluttPåDagepengeforlengelse);
});
