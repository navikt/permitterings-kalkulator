import {
    datointervallKategori,
    DatoMedKategori,
    OversiktOverBrukteOgGjenværendeDager,
} from './typer';
import {
    antalldagerGått,
    finnDato18MndFram,
    finnDato18MndTilbake,
} from './utregninger';
import { skrivOmDato } from '../Datovelger/datofunksjoner';
import dayjs, { Dayjs } from 'dayjs';

export enum ArbeidsgiverPeriode2Resulatet {
    NÅDD_AGP2 = 'NÅDD_AGP2',
    LØPENDE_IKKE_NÅDD_AGP2 = 'LØPENDE_IKKE_NÅDD_AGP2',
    IKKE_LØPENDE_IKKE_NÅDD_AGP2 = 'IKKE_LØPENDE_IKKE_NÅDD_AGP2',
}

export interface InformasjonOmGjenståendeDagerOgPeriodeAGP2 {
    // 18mndperiode: datointervall
    sluttDato: Date | undefined;
    gjenståendePermitteringsDager: number;
    brukteDager: number; // 210-brukteDager
    type: ArbeidsgiverPeriode2Resulatet;
}

//funksjoner for utregning av AGP2
export const finnInformasjonAGP2 = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Dayjs, // alltid 1. juni nå
    erLøpende: boolean,
    dagensDato: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): InformasjonOmGjenståendeDagerOgPeriodeAGP2 => {
    const statusPermittering1muligAGP2 = finnOversiktOverPermitteringOgFraværGitt18mnd(
        tidligsteDatoAGP2.toDate(), // 1. juni
        tidslinje
    );
    console.log(statusPermittering1muligAGP2);
    const antallBruktePermitteringsdagerPer1Juni = finnBruktePermitteringsDager(
        tidslinje,
        tidligsteDatoAGP2.toDate()
    );
    const antallGjenværendeDagerFørAGP2Per1Juni =
        antallDagerFørAGP2Inntreffer -
        finnBruktePermitteringsDager(tidslinje, tidligsteDatoAGP2.toDate());
    if (antallGjenværendeDagerFørAGP2Per1Juni <= 0) {
        //case1
        return {
            sluttDato: tidligsteDatoAGP2.toDate(),
            brukteDager:
                statusPermittering1muligAGP2.dagerPermittert -
                statusPermittering1muligAGP2.dagerAnnetFravær,
            gjenståendePermitteringsDager: 0,
            type: ArbeidsgiverPeriode2Resulatet.NÅDD_AGP2,
        };
    }
    if (erLøpende) {
        // TODO OBS: Denne datoen kan være etter tidslinjen! må sjekkes
        const datoAGP2 = finnDatoAGP2LøpendePermittering(
            tidslinje,
            tidligsteDatoAGP2.toDate(),
            antallDagerFørAGP2Inntreffer
        );
        return {
            sluttDato: datoAGP2.subtract(1, 'day').toDate(),
            gjenståendePermitteringsDager:
                antallDagerFørAGP2Inntreffer -
                antallBruktePermitteringsdagerPer1Juni,
            brukteDager: antallBruktePermitteringsdagerPer1Juni,
            type: ArbeidsgiverPeriode2Resulatet.LØPENDE_IKKE_NÅDD_AGP2,
        };
    } else {
        const sisteDatoIPerioden = finnDatoForTidligste18mndsPeriode(
            tidslinje,
            dayjs(tidligsteDatoAGP2),
            dayjs(dagensDato),
            antallDagerFørAGP2Inntreffer
        );
        const antallBruktePermitteringsdagerIPerioden = finnBruktePermitteringsDager(
            tidslinje,
            sisteDatoIPerioden.toDate()
        );
        return {
            sluttDato: sisteDatoIPerioden.toDate(),
            gjenståendePermitteringsDager:
                antallDagerFørAGP2Inntreffer -
                antallBruktePermitteringsdagerIPerioden,
            brukteDager: antallBruktePermitteringsdagerIPerioden,
            type: ArbeidsgiverPeriode2Resulatet.IKKE_LØPENDE_IKKE_NÅDD_AGP2,
        };
    }
};

//case 2
export const finnDatoAGP2LøpendePermittering = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Date,
    antallDagerFørAGP2Inntreffer: number
): Dayjs => {
    let potensiellDatoForAGP2: Dayjs = dayjs(tidligsteDatoAGP2);
    let antallDagerPermittert = finnBruktePermitteringsDager(
        tidslinje,
        potensiellDatoForAGP2.toDate()
    );

    while (antallDagerPermittert < antallDagerFørAGP2Inntreffer) {
        console.log('hei', antallDagerPermittert);
        const antallDagerTilNesteGjett =
            antallDagerFørAGP2Inntreffer - antallDagerPermittert;
        potensiellDatoForAGP2 = potensiellDatoForAGP2.add(
            antallDagerTilNesteGjett,
            'days'
        );

        antallDagerPermittert =
            finnBruktePermitteringsDager(
                tidslinje,
                potensiellDatoForAGP2.toDate()
            ) + antallDagerTilNesteGjett;
    }
    return potensiellDatoForAGP2.add(1, 'day');
};

//case3
/*
returnerer den tidligste permitteringsdatoen som er slik at AGP2 kan forekomme i 18mnds-perioden som starter med denne datoen
TODO burde finne/teste en case hvor denne datoen _ikke_ er første permitteringsdato
 */
export const finnDatoForTidligste18mndsPeriode = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Dayjs,
    dagensDato: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): Dayjs => {
    const førstePermitteringStart: DatoMedKategori | undefined = tidslinje.find(
        (datoMedKategori) =>
            datoMedKategori.kategori === datointervallKategori.PERMITTERT &&
            datoMedKategori.dato >=
                finnDato18MndTilbake(tidligsteDatoAGP2.toDate())
    );
    if (!førstePermitteringStart) return tidligsteDatoAGP2;

    let potensiellSisteDatoIIntervall = dayjs(
        finnDato18MndFram(førstePermitteringStart.dato)
    );
    let overskuddAvPermitteringsdagerITidsintervall = finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager(
        potensiellSisteDatoIIntervall.toDate(),
        tidslinje,
        dagensDato.toDate(),
        antallDagerFørAGP2Inntreffer
    );

    while (overskuddAvPermitteringsdagerITidsintervall >= 0) {
        potensiellSisteDatoIIntervall = potensiellSisteDatoIIntervall.add(
            overskuddAvPermitteringsdagerITidsintervall,
            'days'
        );

        overskuddAvPermitteringsdagerITidsintervall = finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager(
            potensiellSisteDatoIIntervall.toDate(),
            tidslinje,
            dagensDato.toDate(),
            antallDagerFørAGP2Inntreffer
        );
    }
    return potensiellSisteDatoIIntervall;
};

//slutt hovedfunksjoner

//hjelpefunksjoner
const finnOversiktOverPermitteringOgFraværGitt18mnd = (
    sisteDatoIAktuellPeriode: Date,
    tidslinje: DatoMedKategori[]
): OversiktOverBrukteOgGjenværendeDager => {
    let permittert = 0;
    let antallDagerFravær = 0;
    let gjenståendeDager = 0;
    tidslinje.forEach((dag) => {
        if (
            dag.dato >= finnDato18MndTilbake(sisteDatoIAktuellPeriode) &&
            dag.dato <= sisteDatoIAktuellPeriode
        ) {
            if (dag.kategori === 0) {
                permittert++;
            }
            if (dag.kategori === 1) {
                gjenståendeDager++;
            }
            if (dag.kategori === 2) {
                antallDagerFravær++;
            }
        }
    });
    const oversikt: OversiktOverBrukteOgGjenværendeDager = {
        dagerPermittert: permittert,
        dagerGjensående: gjenståendeDager,
        dagerAnnetFravær: antallDagerFravær,
    };
    return oversikt;
};

export const finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager = (
    sisteDagIAktuellPeriode: Date,
    tidslinje: DatoMedKategori[],
    dagensDato: Date, // todo hva om man legger inn permitteringer i fremtiden?
    antallDagerFørAGP2Inntreffer: number
) => {
    const ubrukteDagerIPeriode =
        antallDagerFørAGP2Inntreffer -
        finnBruktePermitteringsDager(tidslinje, sisteDagIAktuellPeriode);
    const dagerMellomDagensDatoOgSisteDagIAktuellPeriode = antalldagerGått(
        dagensDato,
        sisteDagIAktuellPeriode
    );
    console.log(
        'ubrukte dager: ' + ubrukteDagerIPeriode,
        'dager mellom dagens dato og sluttdato: ' +
            dagerMellomDagensDatoOgSisteDagIAktuellPeriode
    );
    return (
        ubrukteDagerIPeriode - dagerMellomDagensDatoOgSisteDagIAktuellPeriode
    );
};

const finnBruktePermitteringsDager = (
    tidslinje: DatoMedKategori[],
    dato: Date
): number => {
    const {
        dagerPermittert,
        dagerAnnetFravær,
    } = finnOversiktOverPermitteringOgFraværGitt18mnd(dato, tidslinje);
    return dagerPermittert - dagerAnnetFravær;
};
