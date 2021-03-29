import {
    DatointervallKategori,
    DatoMedKategori,
    OversiktOverBrukteOgGjenværendeDager,
} from '../typer';
import dayjs, { Dayjs } from 'dayjs';
import {
    antallDagerGått,
    finnDato18MndFram,
    finnDato18MndTilbake,
} from './dato-utils';
import {
    erPermittertVedDato,
    finnPermitteringsDatoEtterGittDato,
} from './tidslinje-utils';

export enum Permitteringssituasjon {
    AGP2_NÅDD_VED_INNFØRINGSDATO = 'AGP2_NÅDD_VED_INNFØRINGSDATO',
    AGP2_NÅDD_ETTER_INNFØRINGSDATO = 'AGP2_NÅDD_ETTER_INNFØRINGSDATO',
    AGP2_IKKE_NÅDD = 'AGP2_IKKE_NÅDD',
}

export interface InformasjonOmAGP2Status {
    sluttDato: Dayjs | undefined;
    gjenståendePermitteringsDager: number;
    brukteDagerVedInnføringsdato: number;
    type: Permitteringssituasjon;
    fraværsdagerVedInnføringsdato: number;
    permitteringsdagerVedInnføringsdato: number;
    permittertVedInnføringsdato?: boolean;
}

export const finnInformasjonAGP2 = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    erLøpende: boolean,
    dagensDato: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): InformasjonOmAGP2Status => {
    const situasjon = finnPermitteringssituasjon(
        tidslinje,
        innføringsdatoAGP2,
        antallDagerFørAGP2Inntreffer
    );
    const oversiktOverPermitteringVedInnføringsdato = finnOversiktOverPermitteringOgFraværGitt18mnd(
        innføringsdatoAGP2,
        tidslinje
    );

    const dataVedInnføringsdato = {
        fraværsdagerVedInnføringsdato:
            oversiktOverPermitteringVedInnføringsdato.dagerAnnetFravær,
        permitteringsdagerVedInnføringsdato:
            oversiktOverPermitteringVedInnføringsdato.dagerPermittert,
        brukteDagerVedInnføringsdato:
            oversiktOverPermitteringVedInnføringsdato.dagerBrukt,
    };

    let dataSpesifikkForSituasjon;
    switch (situasjon) {
        case Permitteringssituasjon.AGP2_NÅDD_VED_INNFØRINGSDATO:
            dataSpesifikkForSituasjon = getInformasjonOmAGP2HvisAGP2ErNådd(
                tidslinje,
                innføringsdatoAGP2
            );
            break;
        case Permitteringssituasjon.AGP2_NÅDD_ETTER_INNFØRINGSDATO:
            dataSpesifikkForSituasjon = getInformasjonOmAGP2HvisDenNåsEtterInnføringsdato(
                tidslinje,
                innføringsdatoAGP2,
                antallDagerFørAGP2Inntreffer
            );
            break;
        case Permitteringssituasjon.AGP2_IKKE_NÅDD:
            dataSpesifikkForSituasjon = getInformasjonOmAGP2HvisAGP2IkkeNås(
                tidslinje,
                innføringsdatoAGP2,
                antallDagerFørAGP2Inntreffer,
                dagensDato
            );
            break;
    }

    return {
        type: situasjon,
        ...dataVedInnføringsdato,
        ...dataSpesifikkForSituasjon,
    };
};

export const finnPermitteringssituasjon = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): Permitteringssituasjon => {
    const antallBruktePermitteringsdagerVedInnføringsdato = finnBruktePermitteringsDager(
        tidslinje,
        innføringsdatoAGP2
    );

    if (
        antallBruktePermitteringsdagerVedInnføringsdato >=
        antallDagerFørAGP2Inntreffer
    ) {
        return Permitteringssituasjon.AGP2_NÅDD_VED_INNFØRINGSDATO;
    }

    const datoAGP2EtterInnføringsdato = finnDatoAGP2EtterInnføringsdato(
        tidslinje,
        innføringsdatoAGP2,
        antallDagerFørAGP2Inntreffer
    );

    if (datoAGP2EtterInnføringsdato) {
        return Permitteringssituasjon.AGP2_NÅDD_ETTER_INNFØRINGSDATO;
    } else {
        return Permitteringssituasjon.AGP2_IKKE_NÅDD;
    }
};

const getInformasjonOmAGP2HvisAGP2ErNådd = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs
): {
    sluttDato: Dayjs;
    gjenståendePermitteringsDager: number;
    permittertVedInnføringsdato: boolean;
} => {
    const erPermittertVedInnføringsdato = erPermittertVedDato(
        tidslinje,
        innføringsdatoAGP2
    );
    return {
        sluttDato: innføringsdatoAGP2,
        gjenståendePermitteringsDager: 0,
        permittertVedInnføringsdato: erPermittertVedInnføringsdato,
    };
};

const getInformasjonOmAGP2HvisDenNåsEtterInnføringsdato = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): {
    sluttDato: Dayjs;
    gjenståendePermitteringsDager: number;
} => {
    const datoAGP2 = finnDatoAGP2EtterInnføringsdato(
        tidslinje,
        innføringsdatoAGP2,
        antallDagerFørAGP2Inntreffer
    );
    return {
        sluttDato: datoAGP2!,
        gjenståendePermitteringsDager: 0,
    };
};

const getInformasjonOmAGP2HvisAGP2IkkeNås = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number,
    dagensDato: Dayjs
): {
    sluttDato: Dayjs | undefined;
    gjenståendePermitteringsDager: number;
} => {
    const sisteDatoIPerioden = finnDatoForTidligste18mndsPeriode(
        tidslinje,
        innføringsdatoAGP2,
        dagensDato,
        antallDagerFørAGP2Inntreffer
    );
    const antallBruktePermitteringsdagerIPerioden = sisteDatoIPerioden
        ? finnBruktePermitteringsDager(tidslinje, sisteDatoIPerioden)
        : 0;
    return {
        sluttDato: sisteDatoIPerioden,
        gjenståendePermitteringsDager:
            antallDagerFørAGP2Inntreffer -
            antallBruktePermitteringsdagerIPerioden,
    };
};

const finnDatoAGP2EtterInnføringsdato = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): Dayjs | undefined => {
    let potensiellDatoForAGP2: Dayjs = dayjs(innføringsdatoAGP2);
    let antallDagerPermittert = finnBruktePermitteringsDager(
        tidslinje,
        potensiellDatoForAGP2
    );
    const sisteDagITidslinjen = tidslinje[tidslinje.length - 1].dato;

    while (
        antallDagerPermittert < antallDagerFørAGP2Inntreffer &&
        potensiellDatoForAGP2.isSameOrBefore(sisteDagITidslinjen)
    ) {
        const antallDagerTilNesteGjett =
            antallDagerFørAGP2Inntreffer - antallDagerPermittert;
        potensiellDatoForAGP2 = potensiellDatoForAGP2.add(
            antallDagerTilNesteGjett,
            'days'
        );
        antallDagerPermittert = finnBruktePermitteringsDager(
            tidslinje,
            potensiellDatoForAGP2
        );
    }
    if (antallDagerPermittert < antallDagerFørAGP2Inntreffer) {
        return undefined;
    }
    return potensiellDatoForAGP2.add(1, 'day');
};

export const finnDatoForTidligste18mndsPeriode = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    dagensDato: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): Dayjs | undefined => {
    const førstePermitteringStart:
        | DatoMedKategori
        | undefined = finnPermitteringsDatoEtterGittDato(
        finnDato18MndTilbake(innføringsdatoAGP2),
        tidslinje
    );
    if (!førstePermitteringStart) return undefined;

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
            const nestePermitteringsstart:
                | DatoMedKategori
                | undefined = finnPermitteringsDatoEtterGittDato(
                tidslinje[indeksDatoBegynnelsenAv18mndsPeriode].dato,
                tidslinje
            );
            // return ved ingen relevante permitteringsintervall igjen
            if (!nestePermitteringsstart) return undefined;
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

export const finnOversiktOverPermitteringOgFraværGitt18mnd = (
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
            if (dag.kategori === DatointervallKategori.PERMITTERT) {
                permittert++;
            }
            if (dag.kategori === DatointervallKategori.ARBEIDER) {
                gjenståendeDager++;
            }
            if (
                dag.kategori ===
                DatointervallKategori.FRAVÆR_PÅ_PERMITTERINGSDAG
            ) {
                permittert++;
                antallDagerFravær++;
            }
        }
    });
    return {
        dagerPermittert: permittert,
        dagerGjenstående: gjenståendeDager, // TODO Denne er ikke riktig, må fjernes.
        dagerAnnetFravær: antallDagerFravær,
        dagerBrukt: permittert - antallDagerFravær,
    };
};

export const finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager = (
    sisteDagIAktuellPeriode: Dayjs,
    tidslinje: DatoMedKategori[],
    dagensDato: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): number => {
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

export const finnBruktePermitteringsDager = (
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
            DatointervallKategori.PERMITTERT
    ) {
        return indeksITidslinje;
    }
};
