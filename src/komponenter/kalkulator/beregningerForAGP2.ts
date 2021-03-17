import {
    datointervallKategori,
    DatoMedKategori,
    OversiktOverBrukteOgGjenværendeDager,
} from './typer';
import {
    antallDagerGått,
    finnDato18MndFram,
    finnDato18MndTilbake,
} from './utregninger';
import dayjs, { Dayjs } from 'dayjs';
import { formaterDato } from '../Datovelger/datofunksjoner';

//merknader vi trenger sammenligningsfunksjoner for å sjekek at to datoer er like
//vi trenger å håndtere at datoene faller utenfor gitt intervall

export enum ArbeidsgiverPeriode2Resulatet {
    NÅDD_AGP2 = 'NÅDD_AGP2',
    LØPENDE_IKKE_NÅDD_AGP2 = 'LØPENDE_IKKE_NÅDD_AGP2',
    IKKE_LØPENDE_IKKE_NÅDD_AGP2 = 'IKKE_LØPENDE_IKKE_NÅDD_AGP2',
}

export interface InformasjonOmAGP2Status {
    // 18mndperiode: datointervall
    sluttDato: Dayjs | undefined;
    gjenståendePermitteringsDager: number;
    brukteDager: number; // 210-brukteDager
    type: ArbeidsgiverPeriode2Resulatet;
    fraværsdager: number;
}

//funksjoner for utregning av AGP2
export const finnInformasjonAGP2 = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Dayjs, // alltid 1. juni nå
    erLøpende: boolean,
    dagensDato: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): InformasjonOmAGP2Status => {
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
            fraværsdager: statusPermittering1muligAGP2.dagerAnnetFravær,
        };
    }
    if (erLøpende) {
        const datoAGP2 = finnDatoAGP2LøpendePermittering(
            tidslinje,
            tidligsteDatoAGP2,
            antallDagerFørAGP2Inntreffer
        );
        return {
            sluttDato: datoAGP2,
            gjenståendePermitteringsDager:
                antallDagerFørAGP2Inntreffer -
                antallBruktePermitteringsdagerPer1Juni,
            brukteDager: antallBruktePermitteringsdagerPer1Juni,
            type: ArbeidsgiverPeriode2Resulatet.LØPENDE_IKKE_NÅDD_AGP2,
            fraværsdager: statusPermittering1muligAGP2.dagerAnnetFravær,
        };
    } else {
        const sisteDatoIPerioden = finnDatoForTidligste18mndsPeriode(
            tidslinje,
            tidligsteDatoAGP2,
            dagensDato,
            antallDagerFørAGP2Inntreffer
        );
        const antallBruktePermitteringsdagerIPerioden = finnBruktePermitteringsDager(
            tidslinje,
            sisteDatoIPerioden
        );
        return {
            sluttDato: sisteDatoIPerioden,
            gjenståendePermitteringsDager:
                antallDagerFørAGP2Inntreffer -
                antallBruktePermitteringsdagerIPerioden,
            brukteDager: antallBruktePermitteringsdagerIPerioden,
            fraværsdager: statusPermittering1muligAGP2.dagerAnnetFravær,
            type: ArbeidsgiverPeriode2Resulatet.IKKE_LØPENDE_IKKE_NÅDD_AGP2,
        };
    }
};

//case 2
export const finnDatoAGP2LøpendePermittering = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): Dayjs => {
    let potensiellDatoForAGP2: Dayjs = dayjs(tidligsteDatoAGP2);
    let antallDagerPermittert = finnBruktePermitteringsDager(
        tidslinje,
        potensiellDatoForAGP2
    );
    // når man krysser av på løpende permittering tror jeg staten "løpende" settes før nye datoer. Resulterer i at denne funksjonen kalles med 0 permitteringsdager
    /*if (antallDagerPermittert === 0) {
        console.log(' null dager permittert')
        return tidligsteDatoAGP2;
    }

     */
    let antallDagerForskyving = 0;
    while (antallDagerPermittert < antallDagerFørAGP2Inntreffer) {
        const antallDagerTilNesteGjett =
            antallDagerFørAGP2Inntreffer - antallDagerPermittert;
        potensiellDatoForAGP2 = potensiellDatoForAGP2.add(
            antallDagerTilNesteGjett,
            'days'
        );
        antallDagerForskyving += antallDagerTilNesteGjett;

        const dagerPermittertUtenLøpendePermittering = finnBruktePermitteringsDager(
            tidslinje,
            potensiellDatoForAGP2
        );
        antallDagerPermittert =
            dagerPermittertUtenLøpendePermittering + antallDagerForskyving;
    }
    return potensiellDatoForAGP2.add(1, 'day');
};

export const finnDatoForTidligste18mndsPeriode = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Dayjs,
    dagensDato: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): Dayjs => {
    const førstePermitteringStart:
        | DatoMedKategori
        | undefined = finnPermitteringsDatoEtterGittDato(
        finnDato18MndTilbake(tidligsteDatoAGP2),
        tidslinje
    );
    if (!førstePermitteringStart) return tidligsteDatoAGP2;

    let potensiellSisteDatoIIntervall = dayjs(
        finnDato18MndFram(førstePermitteringStart.dato)
    );
    let overskuddAvPermitteringsdagerITidsintervall = finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager(
        potensiellSisteDatoIIntervall,
        tidslinje,
        dagensDato,
        antallDagerFørAGP2Inntreffer
    );

    while (
        overskuddAvPermitteringsdagerITidsintervall > 0 &&
        overskuddAvPermitteringsdagerITidsintervall < 210
    ) {
        potensiellSisteDatoIIntervall = potensiellSisteDatoIIntervall.add(
            overskuddAvPermitteringsdagerITidsintervall,
            'days'
        );

        //sjekker om startdatoen i det nye intervallet er en permitteringsdato
        const indeksDatoBegynnelsenAv18mndsPeriode = returnerIndeksAvDatoHvisIkkePermitteringsdato(
            finnDato18MndTilbake(potensiellSisteDatoIIntervall),
            tidslinje
        );

        if (indeksDatoBegynnelsenAv18mndsPeriode) {
            console.log(
                'Forsøker å finne nytt permitteringintervall når gammelt utgår'
            );
            const nestePermitteringsstart:
                | DatoMedKategori
                | undefined = finnPermitteringsDatoEtterGittDato(
                tidslinje[indeksDatoBegynnelsenAv18mndsPeriode].dato,
                tidslinje
            );
            // return ved ingen relevante permitteringsintervall igjen
            if (!nestePermitteringsstart) return tidligsteDatoAGP2;
            potensiellSisteDatoIIntervall = dayjs(
                finnDato18MndFram(nestePermitteringsstart.dato)
            );
        }

        overskuddAvPermitteringsdagerITidsintervall = finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager(
            potensiellSisteDatoIIntervall,
            tidslinje,
            dagensDato,
            antallDagerFørAGP2Inntreffer
        );
    }
    return potensiellSisteDatoIIntervall;
};

//slutt hovedfunksjoner

//hjelpefunksjoner
const finnOversiktOverPermitteringOgFraværGitt18mnd = (
    sisteDatoIAktuellPeriode: Dayjs,
    tidslinje: DatoMedKategori[]
): OversiktOverBrukteOgGjenværendeDager => {
    let permittert = 0;
    let antallDagerFravær = 0;
    let gjenståendeDager = 0;
    tidslinje.forEach((dag) => {
        if (
            dag.dato >= finnDato18MndTilbake(sisteDatoIAktuellPeriode) &&
            dag.dato.isSameOrBefore(sisteDatoIAktuellPeriode)
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
    return {
        dagerPermittert: permittert,
        dagerGjensående: gjenståendeDager,
        dagerAnnetFravær: antallDagerFravær,
    };
};

export const finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager = (
    sisteDagIAktuellPeriode: Dayjs,
    tidslinje: DatoMedKategori[],
    dagensDato: Dayjs,
    antallDagerFørAGP2Inntreffer: number
) => {
    const ubrukteDagerIPeriode =
        antallDagerFørAGP2Inntreffer -
        finnBruktePermitteringsDager(tidslinje, sisteDagIAktuellPeriode);
    const dagerMellomDagensDatoOgSisteDagIAktuellPeriode = antallDagerGått(
        dagensDato,
        sisteDagIAktuellPeriode
    );
    return (
        ubrukteDagerIPeriode - dagerMellomDagensDatoOgSisteDagIAktuellPeriode
    );
};

const finnBruktePermitteringsDager = (
    tidslinje: DatoMedKategori[],
    dato: Dayjs
): number => {
    const {
        dagerPermittert,
        dagerAnnetFravær,
    } = finnOversiktOverPermitteringOgFraværGitt18mnd(dato, tidslinje);
    return dagerPermittert - dagerAnnetFravær;
};

const returnerIndeksAvDatoHvisIkkePermitteringsdato = (
    dato: Dayjs,
    tidslinje: DatoMedKategori[]
) => {
    const indeksITidslinje = tidslinje.findIndex((datoMedKategori) =>
        datoMedKategori.dato.isSame(dato, 'date')
    );
    if (
        indeksITidslinje > 0 &&
        tidslinje[indeksITidslinje].kategori !==
            datointervallKategori.PERMITTERT
    ) {
        return indeksITidslinje;
    }
};

const finnPermitteringsDatoEtterGittDato = (
    skalVæreEtter: Dayjs,
    tidslinje: DatoMedKategori[]
) => {
    return tidslinje.find(
        (datoMedKategori) =>
            datoMedKategori.kategori === datointervallKategori.PERMITTERT &&
            datoMedKategori.dato.isSameOrAfter(skalVæreEtter)
    );
};
