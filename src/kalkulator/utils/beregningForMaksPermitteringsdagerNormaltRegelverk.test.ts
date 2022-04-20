import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    DatoMedKategori,
} from '../typer';
import dayjs from 'dayjs';
import {
    finnFørsteDatoMedPermitteringUtenFravær,
    konstruerTidslinje,
    konstruerTidslinjeSomSletterPermitteringFørDato,
} from './tidslinje-utils';
import { Permitteringssregelverk } from '../SeResultat/SeResultat';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    getPermitteringsoversiktFor18Måneder,
} from './beregningerForSluttPåDagpengeforlengelse';
import {
    antallDagerGått,
    finnDato18MndFram,
    finnDato18MndTilbake,
} from './dato-utils';
import {
    finnDatoForMaksPermitteringNormaltRegelverk,
    getPermitteringsoversikt,
} from './beregningForMaksPermitteringsdagerNormaltRegelverk';

const dagensDato = dayjs().startOf('date').add(1, 'day');
const datoSluttPåDagpengeforlengelse = dayjs('2022-04-01');
const datoPermitteringSlettesFør = dayjs('2021-07-01');

const getTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder
): DatoMedKategori[] => {
    return konstruerTidslinje(allePermitteringerOgFravær, dagensDato);
};

describe('Tester for beregning av permitteringssituasjon ved avsluttede permitteringer iverksatt før 1. juli, og ny igangsatt permittering etter 1. juli', () => {
    test('alle permitteringsdager før 1. juli blir slettet', () => {
        const permitteringsPeriodeFør1Juli: DatoIntervall = {
            datoFra: dayjs('2021-04-01'),
            datoTil: dayjs('2021-05-01'),
        };
        const permitteringsPeriodeFra1Juli: DatoIntervall = {
            datoFra: dayjs('2021-07-01'),
            datoTil: dayjs('2021-08-01'),
        };
        const tidslinje = konstruerTidslinje(
            {
                permitteringer: [
                    permitteringsPeriodeFra1Juli,
                    permitteringsPeriodeFør1Juli,
                ],
                andreFraværsperioder: [],
            },
            dagensDato
        );
        const tidsLinjeMedSlettetPermittering = konstruerTidslinjeSomSletterPermitteringFørDato(
            tidslinje,
            datoPermitteringSlettesFør,
            Permitteringssregelverk.NORMALT_REGELVERK
        );
        const førstePermitteringsdag = finnFørsteDatoMedPermitteringUtenFravær(
            tidsLinjeMedSlettetPermittering
        );
        expect(førstePermitteringsdag?.dato).toStrictEqual(
            datoPermitteringSlettesFør
        );
    });

    test('alle permitteringsdager før 1. juli blir slettet, også ved ny løpende permittering', () => {
        const permitteringsPeriodeFør1Juli: DatoIntervall = {
            datoFra: dayjs('2021-04-01'),
            datoTil: dayjs('2021-05-01'),
        };
        const permitteringsPeriodeFra1Juli: DatoIntervall = {
            datoFra: dayjs('2021-07-01'),
            erLøpende: true,
        };
        const tidslinje = konstruerTidslinje(
            {
                permitteringer: [
                    permitteringsPeriodeFra1Juli,
                    permitteringsPeriodeFør1Juli,
                ],
                andreFraværsperioder: [],
            },
            dagensDato
        );
        const tidsLinjeMedSlettetPermittering = konstruerTidslinjeSomSletterPermitteringFørDato(
            tidslinje,
            datoPermitteringSlettesFør,
            Permitteringssregelverk.NORMALT_REGELVERK
        );
        const førstePermitteringsdag = finnFørsteDatoMedPermitteringUtenFravær(
            tidsLinjeMedSlettetPermittering
        );
        expect(førstePermitteringsdag?.dato).toStrictEqual(
            datoPermitteringSlettesFør
        );
    });

    describe('Tester for finn18mndsperiodeForMaksimeringAvPermitteringsdager', () => {
        test('relevant 18-mnds periode begynner ved andre permitteringsperiode', () => {
            const maksAntallPermitteringsdager = 26 * 7;
            const datoTreUkerEtterDagensDato = dagensDato.add(
                3 * 7 - 1,
                'days'
            );
            const startDatoFørstePermittering = finnDato18MndTilbake(
                datoTreUkerEtterDagensDato
            );
            const sluttDatoFørstePermittering = startDatoFørstePermittering.add(
                maksAntallPermitteringsdager - (4 * 7 - 1)
            );
            //første permitteringsperiode vil vare maksAntallDager - 4 uker, slik at det vil være mulig å permittere i 4 uker til i løpet av inneværende 18mndsperiode
            //dette vil ikke være mulig i praksis, siden det kun er 3 uker mellom dagens dato og slutten på begynnende 18mnds periode. Siden mak ikke kan permittere fire uker i løpet av tre uker, hopper algoritmen til neste potensielle 18mndsperiode
            const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
                permitteringer: [
                    {
                        datoFra: startDatoFørstePermittering,
                        datoTil: sluttDatoFørstePermittering,
                    },
                    {
                        datoFra: dagensDato,
                        datoTil: dagensDato.add(20, 'days'),
                    },
                ],
                andreFraværsperioder: [],
            };
            const tidslinje = konstruerTidslinje(
                allePermitteringerOgFravær,
                dagensDato
            );
            const aktuellPeriode = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                datoSluttPåDagpengeforlengelse,
                dagensDato,
                maksAntallPermitteringsdager
            );
            //expect(aktuellPeriode?.datoFra).toEqual(dagensDato);
        });
    });

    describe('Tester for getPermitteringsoversikt', () => {
        test('Antall dager brukt skal være antall permitteringsdager, hvis ingen fravær', () => {
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
                datoSluttPåDagpengeforlengelse
            );
            expect(dagerBrukt).toEqual(51);
        });

        test('skal trekke fra fraværsdager under permittering', () => {
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
                datoSluttPåDagpengeforlengelse
            );
            expect(oversikt).toEqual({
                dagerBrukt: 30,
                dagerAnnetFravær: 21,
                dagerPermittert: 51,
            });
        });

        test('skal bare telle med fraværsdager som overlapper med permittering', () => {
            const permitteringsstart = dagensDato;
            const permitteringsslutt = permitteringsstart.add(20, 'days');
            // en uke faller utenfor permitteringsperioden
            const fraværsperiodeStart = permitteringsstart.subtract(6, 'days');
            // en uke faller innenfor permitteringsperioden
            const fraværsperiodeSlutt = permitteringsstart.add(6, 'days');
            const tidslinje = getTidslinje({
                permitteringer: [
                    {
                        datoFra: permitteringsstart,
                        datoTil: permitteringsslutt,
                    },
                ],
                andreFraværsperioder: [
                    {
                        datoFra: fraværsperiodeStart,
                        datoTil: fraværsperiodeSlutt,
                    },
                ],
            });
            const oversikt = getPermitteringsoversikt(tidslinje, {
                datoFra: fraværsperiodeStart,
                datoTil: permitteringsslutt,
            });
            expect(oversikt).toEqual({
                dagerBrukt:
                    antallDagerGått(permitteringsstart, permitteringsslutt) - 7,
                dagerAnnetFravær: 7,
                dagerPermittert: antallDagerGått(
                    permitteringsstart,
                    permitteringsslutt
                ),
            });
        });
    });
});

test('Skal ignorere permittering i begynnelsen av 18 mndsperiode som sklir fordi maks ikke kan nås i 18-månedersperioden', () => {
    const maksAntallPermitteringsdager = 26 * 7;
    const datoFørstePermitteringsDato = dagensDato.subtract(200, 'days');

    const slutt18mndsPeriodeMedStartFørstePermitteringsPeriode = finnDato18MndFram(
        datoFørstePermitteringsDato
    );
    //bruker ceil i tilfelle maks antall permitteringsdager - 1 er et oddetall. Dette gjelder ikke for 26 uker som er nåværende regelverk
    const lengdePåFørstePermittering = Math.floor(
        (maksAntallPermitteringsdager - 1) / 2
    );
    const gjenværendePermitteringsDageri18mndsIntervall =
        maksAntallPermitteringsdager - lengdePåFørstePermittering;
    expect(
        lengdePåFørstePermittering +
            gjenværendePermitteringsDageri18mndsIntervall
    ).toEqual(maksAntallPermitteringsdager);
    //ved å sette startDatoLøpendePermittering på denne måten vil det være (gjenværendePermitteringsDageri18mndsIntervall - 1) permitteringsdager
    //fra startDatoLøpendePermittering til slutt18mndsPeriodeMedStartFørstePermitteringsPeriode
    //totalt vil det dermed være (maksAntallPermitteringsDager-1) permitteringer i 18-månedersintervallet
    //fra datoFørstePermitteringsDato til slutt18mndsPeriodeMedStartFørstePermitteringsPeriode
    //siden maks antall dager ikke nås i dette intervallet,
    //skal algoritmen hoppe videre til andre permitteringsperiode med startdato startDatoLøpendePermittering når maks skal nås
    //i dette tilfellet blir dette datoen startDatoLøpendePermittering + maksAntallPermitteringsdager-1
    const startDatoLøpendePermittering = slutt18mndsPeriodeMedStartFørstePermitteringsPeriode.subtract(
        gjenværendePermitteringsDageri18mndsIntervall - 2,
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

    const datoDerMaksMinusEnDagNås = slutt18mndsPeriodeMedStartFørstePermitteringsPeriode;
    const antallPermitteringsDagerI18mndsIntervallSomInkludere1Permittering = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        datoDerMaksMinusEnDagNås
    ).dagerBrukt;
    //test sjekk at det er nøyaktig (maksAntallDager-1) permitteringsdager i 18-månedersintervallet med startdato lik datoFørstePermitteringsDato
    expect(
        antallPermitteringsDagerI18mndsIntervallSomInkludere1Permittering
    ).toEqual(maksAntallPermitteringsdager - 1);

    const datoMaksAntallDagerNådd = finnDatoForMaksPermitteringNormaltRegelverk(
        tidslinje,
        datoSluttPåDagpengeforlengelse,
        maksAntallPermitteringsdager
    );
    expect(
        getPermitteringsoversikt(tidslinje, {
            datoFra: startDatoLøpendePermittering,
            datoTil: datoMaksAntallDagerNådd!!,
        }).dagerBrukt
    ).toEqual(maksAntallPermitteringsdager);
    expect(datoMaksAntallDagerNådd).toEqual(
        startDatoLøpendePermittering.add(
            maksAntallPermitteringsdager - 1,
            'days'
        )
    );
});
