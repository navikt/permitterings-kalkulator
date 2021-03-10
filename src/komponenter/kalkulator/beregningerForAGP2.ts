import { DatoMedKategori, OversiktOverBrukteOgGjenværendeDager } from './typer';
import {
    antalldagerGått,
    finnDato18MndFram,
    finnDato18MndTilbake,
} from './utregninger';
import { skrivOmDato } from '../Datovelger/datofunksjoner';

export enum ArbeidsgiverPeriode2Resulatet {
    NÅDD_AGP2,
    LØPENDE_IKKE_NÅDD_AGP2,
    IKKE_LØPENDE_IKKE_NÅDD_AGP2,
}

export interface InformasjonOmGjenståendeDagerOgPeriodeAGP2 {
    sluttDato: Date | undefined;
    gjenståendePermitteringsDager: number;
    brukteDager: number;
    type: ArbeidsgiverPeriode2Resulatet;
}

//funksjoner for utregning av AGP2
export const finnInformasjonAGP2 = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Date,
    erLøpende: boolean,
    dagensDato: Date
): InformasjonOmGjenståendeDagerOgPeriodeAGP2 => {
    const statusPermittering1muligAGP2 = finnOversiktOverPermitteringOgFraværGitt18mnd(
        tidligsteDatoAGP2,
        tidslinje
    );
    const gjenVærendePermittering = finnGjenståendePermitteringsDager(
        statusPermittering1muligAGP2
    );
    if (gjenVærendePermittering <= 0) {
        //case1
        return {
            sluttDato: tidligsteDatoAGP2,
            brukteDager:
                statusPermittering1muligAGP2.dagerPermittert -
                statusPermittering1muligAGP2.dagerAnnetFravær,
            gjenståendePermitteringsDager: 0,
            type: 0,
        };
    }
    if (erLøpende) {
        return finnDatoAGP2LøpendPermittering(
            tidslinje,
            tidligsteDatoAGP2,
            gjenVærendePermittering
        );
    } else {
        const oversikt = finnPeriodeForÅBrukeGjenståendeDager(
            tidslinje,
            tidligsteDatoAGP2,
            dagensDato
        );
        return oversikt;
    }
};

//case 2
export const finnDatoAGP2LøpendPermittering = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Date,
    gjenStåendeDager: number
): InformasjonOmGjenståendeDagerOgPeriodeAGP2 => {
    // initial 1.juni
    let sluttDato: Date | undefined = new Date(tidligsteDatoAGP2);
    // gjenstående permitteringsdager til man når AGP2
    let dagerGjenstår = gjenStåendeDager;
    while (dagerGjenstår > 0) {
        sluttDato.setDate(sluttDato.getDate() + dagerGjenstår);
        const statusPermittering1muligAGP2 = finnOversiktOverPermitteringOgFraværGitt18mnd(
            sluttDato,
            tidslinje
        );
        dagerGjenstår =
            finnGjenståendePermitteringsDager(statusPermittering1muligAGP2) -
            dagerGjenstår;
        if (sluttDato > tidslinje[tidslinje.length - 1].dato) {
            sluttDato = undefined;
            break;
        }
    }
    return {
        sluttDato: sluttDato,
        gjenståendePermitteringsDager: gjenStåendeDager,
        brukteDager: 210 - gjenStåendeDager,
        type: 1,
    };
};

//case3
export const finnPeriodeForÅBrukeGjenståendeDager = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Date,
    dagensDato: Date
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
            type: 0,
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

    return {
        sluttDato: sisteDagIMulig18mndPeriode,
        gjenståendePermitteringsDager: finnGjenståendePermitteringsDager(
            oversiktOverBrukteDagerIPeriode
        ),
        brukteDager:
            210 -
            finnGjenståendePermitteringsDager(oversiktOverBrukteDagerIPeriode),
        type: 2,
    };
};

//slutt hovedfunksjoner

//hjelpefunksjoner
const finnOversiktOverPermitteringOgFraværGitt18mnd = (
    sisteDatoIAktuellPeriode: Date,
    tidslinje: DatoMedKategori[]
) => {
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
    const ubrukteDagerIPeriode = finnGjenståendePermitteringsDager(
        oversiktOverBrukteDagerIPeriode
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

const finnGjenståendePermitteringsDager = (
    oversikt: OversiktOverBrukteOgGjenværendeDager
) => {
    return 7 * 30 - (oversikt.dagerPermittert - oversikt.dagerAnnetFravær);
};
