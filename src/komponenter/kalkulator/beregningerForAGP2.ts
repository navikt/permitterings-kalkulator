import { DatoMedKategori, OversiktOverBrukteOgGjenværendeDager } from './typer';
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
    tidligsteDatoAGP2: Date, // alltid 1. juni nå
    erLøpende: boolean,
    dagensDato: Date,
    antallDagerFørAGP2Inntreffer: number
): InformasjonOmGjenståendeDagerOgPeriodeAGP2 => {
    const statusPermittering1muligAGP2 = finnOversiktOverPermitteringOgFraværGitt18mnd(
        tidligsteDatoAGP2, // 1. juni
        tidslinje
    );
    const antallBruktePermitteringsdagerPer1Juni = finnBruktePermitteringsDager(
        tidslinje,
        tidligsteDatoAGP2
    );
    const antallGjenværendeDagerFørAGP2Per1Juni =
        antallDagerFørAGP2Inntreffer -
        finnBruktePermitteringsDager(tidslinje, tidligsteDatoAGP2);
    if (antallGjenværendeDagerFørAGP2Per1Juni <= 0) {
        //case1
        return {
            sluttDato: tidligsteDatoAGP2,
            brukteDager:
                statusPermittering1muligAGP2.dagerPermittert -
                statusPermittering1muligAGP2.dagerAnnetFravær,
            gjenståendePermitteringsDager: 0,
            type: ArbeidsgiverPeriode2Resulatet.NÅDD_AGP2,
        };
    }
    if (erLøpende) {
        // TODO OBS: Denne datoen kan være etter tidslinjen! må sjekkes
        const datoAGP2 = finnDatoAGP2LøpendPermittering(
            tidslinje,
            tidligsteDatoAGP2,
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
        const oversikt = finnPeriodeForÅBrukeGjenståendeDager(
            tidslinje,
            tidligsteDatoAGP2,
            dagensDato,
            antallDagerFørAGP2Inntreffer
        );
        return oversikt;
    }
};

//case 2
export const finnDatoAGP2LøpendPermittering = (
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
export const finnPeriodeForÅBrukeGjenståendeDager = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Date,
    dagensDato: Date,
    antallDagerFørAGP2Inntreffer: number
): InformasjonOmGjenståendeDagerOgPeriodeAGP2 => {
    const førstePermittering = tidslinje.find(
        (datoMedKategori) =>
            datoMedKategori.kategori === 0 &&
            datoMedKategori.dato >= finnDato18MndTilbake(tidligsteDatoAGP2)
    );

    //ikke tilstrekkelig data
    if (førstePermittering === undefined) {
        return {
            sluttDato: undefined,
            brukteDager: 0,
            gjenståendePermitteringsDager: 210,
            type: ArbeidsgiverPeriode2Resulatet.NÅDD_AGP2,
        };
    }

    const sisteDagIMulig18mndPeriode = finnDato18MndFram(
        førstePermittering.dato
    );
    let oversiktOverBrukteDagerIPeriode = finnOversiktOverPermitteringOgFraværGitt18mnd(
        sisteDagIMulig18mndPeriode,
        tidslinje
    );
    let overskuddAvPermitteringsdagerItidsintervall = finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager(
        sisteDagIMulig18mndPeriode,
        tidslinje,
        oversiktOverBrukteDagerIPeriode,
        dagensDato
    );
    const maksFramITidForBeregning = tidslinje[tidslinje.length - 1].dato;
    while (
        overskuddAvPermitteringsdagerItidsintervall >= 0 &&
        sisteDagIMulig18mndPeriode < maksFramITidForBeregning
    ) {
        console.log(
            'i while loop med dato: ' +
                skrivOmDato(sisteDagIMulig18mndPeriode) +
                ' overskudd: ' +
                overskuddAvPermitteringsdagerItidsintervall
        );
        sisteDagIMulig18mndPeriode.setDate(
            sisteDagIMulig18mndPeriode.getDate() +
                overskuddAvPermitteringsdagerItidsintervall
        );
        console.log(
            'datoen er endret til: ' + skrivOmDato(sisteDagIMulig18mndPeriode)
        );
        oversiktOverBrukteDagerIPeriode = finnOversiktOverPermitteringOgFraværGitt18mnd(
            sisteDagIMulig18mndPeriode,
            tidslinje
        );
        overskuddAvPermitteringsdagerItidsintervall = finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager(
            sisteDagIMulig18mndPeriode,
            tidslinje,
            oversiktOverBrukteDagerIPeriode,
            dagensDato
        );
    }

    console.log(
        skrivOmDato(finnDato18MndTilbake(sisteDagIMulig18mndPeriode)) +
            ' ' +
            skrivOmDato(sisteDagIMulig18mndPeriode)
    );

    const antallBruktePermitteringsdager = finnBruktePermitteringsDager(
        tidslinje,
        sisteDagIMulig18mndPeriode
    );

    return {
        sluttDato: sisteDagIMulig18mndPeriode,
        gjenståendePermitteringsDager:
            antallDagerFørAGP2Inntreffer - antallBruktePermitteringsdager,
        brukteDager: antallBruktePermitteringsdager,
        type: ArbeidsgiverPeriode2Resulatet.IKKE_LØPENDE_IKKE_NÅDD_AGP2,
    };
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
    oversiktOverBrukteDagerIPeriode: OversiktOverBrukteOgGjenværendeDager,
    dagensDato: Date
) => {
    const ubrukteDagerIPeriode = finnBruktePermitteringsDager(
        tidslinje,
        sisteDagIAktuellPeriode
    );
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
