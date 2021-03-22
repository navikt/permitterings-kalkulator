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

export enum Permitteringssituasjon {
    NÅDD_AGP2 = 'NÅDD_AGP2',
    LØPENDE_IKKE_NÅDD_AGP2 = 'LØPENDE_IKKE_NÅDD_AGP2',
    IKKE_LØPENDE_IKKE_NÅDD_AGP2 = 'IKKE_LØPENDE_IKKE_NÅDD_AGP2',
    NÅR_AGP2_I_FRAMTIDEN_IKKE_LØPENDE = 'IKKE_LØPENDE_IKKE_NÅDD_AGP2',
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

export const finnPermitteringssituasjon = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number,
    erLøpende: boolean
): Permitteringssituasjon => {
    const antallBruktePermitteringsdagerVedInnføringsdato = finnBruktePermitteringsDager(
        tidslinje,
        innføringsdatoAGP2
    );
    if (
        antallBruktePermitteringsdagerVedInnføringsdato >=
        antallDagerFørAGP2Inntreffer
    ) {
        return Permitteringssituasjon.NÅDD_AGP2;
    } else if (erLøpende) {
        return Permitteringssituasjon.LØPENDE_IKKE_NÅDD_AGP2;
    } else {
        return Permitteringssituasjon.IKKE_LØPENDE_IKKE_NÅDD_AGP2;
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

const getInformasjonOmAGP2HvisAGP2IkkeErNåddOgPermitteringErLøpende = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): {
    sluttDato: Dayjs;
    gjenståendePermitteringsDager: number;
} => {
    const oversiktOverPermitteringVedInnføringsdato = finnOversiktOverPermitteringOgFraværGitt18mnd(
        innføringsdatoAGP2,
        tidslinje
    );
    const datoAGP2 = finnDatoAGP2LøpendePermittering(
        tidslinje,
        innføringsdatoAGP2,
        antallDagerFørAGP2Inntreffer
    );
    return {
        sluttDato: datoAGP2,
        gjenståendePermitteringsDager:
            antallDagerFørAGP2Inntreffer -
            oversiktOverPermitteringVedInnføringsdato.dagerBrukt,
    };
};

const getInformasjonOmAGP2HvisAGP2IkkeErNåddOgPermitteringIkkeErLøpende = (
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

export const getInformasjonOmAGP2HvisAGP2NåsIFramtidenUtenLøpendePermittering = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    dagensDato: Dayjs,
    antallDagerFørAGP2Inntreffer: number
) => {
    let potensiellDatoForAGP2: Dayjs = dayjs(innføringsdatoAGP2);
    let permitteringerI18mndsIntervall = finnBruktePermitteringsDager(
        tidslinje,
        potensiellDatoForAGP2
    );
    while (permitteringerI18mndsIntervall < antallDagerFørAGP2Inntreffer) {
        const antallDagerTilNesteGjett =
            antallDagerFørAGP2Inntreffer - permitteringerI18mndsIntervall;
        potensiellDatoForAGP2 = potensiellDatoForAGP2.add(
            antallDagerTilNesteGjett,
            'days'
        );
        permitteringerI18mndsIntervall = finnBruktePermitteringsDager(
            tidslinje,
            potensiellDatoForAGP2
        );
    }
    return potensiellDatoForAGP2;
};

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
        antallDagerFørAGP2Inntreffer,
        erLøpende
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
        case Permitteringssituasjon.NÅDD_AGP2:
            dataSpesifikkForSituasjon = getInformasjonOmAGP2HvisAGP2ErNådd(
                tidslinje,
                innføringsdatoAGP2
            );
            break;
        case Permitteringssituasjon.LØPENDE_IKKE_NÅDD_AGP2:
            dataSpesifikkForSituasjon = getInformasjonOmAGP2HvisAGP2IkkeErNåddOgPermitteringErLøpende(
                tidslinje,
                innføringsdatoAGP2,
                antallDagerFørAGP2Inntreffer
            );
            break;
        case Permitteringssituasjon.IKKE_LØPENDE_IKKE_NÅDD_AGP2:
            dataSpesifikkForSituasjon = getInformasjonOmAGP2HvisAGP2IkkeErNåddOgPermitteringIkkeErLøpende(
                tidslinje,
                innføringsdatoAGP2,
                antallDagerFørAGP2Inntreffer,
                dagensDato
            );
            const nårAGP2IPlanlagtePermitteringer =
                dataSpesifikkForSituasjon.gjenståendePermitteringsDager <= 0;
            if (nårAGP2IPlanlagtePermitteringer) {
                console.log(
                    'agp2 i framtiden: ',
                    dataSpesifikkForSituasjon.gjenståendePermitteringsDager
                );
                const datoAGPInntrefferIFramtiden = getInformasjonOmAGP2HvisAGP2NåsIFramtidenUtenLøpendePermittering(
                    tidslinje,
                    innføringsdatoAGP2,
                    dagensDato,
                    antallDagerFørAGP2Inntreffer
                );
                dataSpesifikkForSituasjon = {
                    sluttDato: datoAGPInntrefferIFramtiden,
                    gjenståendePermitteringsDager: 0,
                };
            }

            break;
    }

    return {
        type: situasjon,
        ...dataVedInnføringsdato,
        ...dataSpesifikkForSituasjon,
    };
};

export const finnDatoAGP2LøpendePermittering = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): Dayjs => {
    let potensiellDatoForAGP2: Dayjs = dayjs(innføringsdatoAGP2);
    let antallDagerPermittert = finnBruktePermitteringsDager(
        tidslinje,
        potensiellDatoForAGP2
    );

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
            if (dag.kategori === datointervallKategori.PERMITTERT) {
                permittert++;
            }
            if (dag.kategori === datointervallKategori.ARBEIDER) {
                gjenståendeDager++;
            }
            if (
                dag.kategori ===
                datointervallKategori.FRAVÆR_PÅ_PERMITTERINGSDAG
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

const erPermittertVedDato = (tidslinje: DatoMedKategori[], dato: Dayjs) => {
    const status = tidslinje.find((datoMedKategori) =>
        datoMedKategori.dato.isSame(dato, 'day')
    );
    return status?.kategori === datointervallKategori.PERMITTERT;
};
