import {
    DatoIntervall,
    DatointervallKategori,
    DatoMedKategori,
    Permitteringsoversikt,
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
    AGP2_IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT = 'AGP2_IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT',
    AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_VED_INNFØRINGSDATO = 'AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_VED_INNFØRINGSDATO',
}

export const finnPermitteringssituasjon = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): Permitteringssituasjon => {
    const datoForAGP2 = finnDatoForAGP2(
        tidslinje,
        innføringsdatoAGP2,
        antallDagerFørAGP2Inntreffer
    );
    if (datoForAGP2) {
        return datoForAGP2.isSame(innføringsdatoAGP2, 'date')
            ? Permitteringssituasjon.AGP2_NÅDD_VED_INNFØRINGSDATO
            : Permitteringssituasjon.AGP2_NÅDD_ETTER_INNFØRINGSDATO;
    } else {
        const antallBruktePermitteringsdagerVedInnføringsdato = getPermitteringsoversikt(
            tidslinje,
            innføringsdatoAGP2
        ).dagerBrukt;
        return antallBruktePermitteringsdagerVedInnføringsdato < // TODO Denne skal egentlig være "<="
            antallDagerFørAGP2Inntreffer
            ? Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT
            : Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_VED_INNFØRINGSDATO;
    }
};

export const finnDatoForAGP2 = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): Dayjs | undefined => {
    const oversiktVedInnføringsdato = getPermitteringsoversikt(
        tidslinje,
        innføringsdatoAGP2
    );

    if (oversiktVedInnføringsdato.dagerBrukt > antallDagerFørAGP2Inntreffer) {
        if (erPermittertVedDato(tidslinje, innføringsdatoAGP2)) {
            return innføringsdatoAGP2;
        } else {
            return undefined;
        }
    }

    let potensiellDatoForAGP2: Dayjs = dayjs(innføringsdatoAGP2);
    let antallDagerPermittert = getPermitteringsoversikt(
        tidslinje,
        potensiellDatoForAGP2
    ).dagerBrukt;
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
        antallDagerPermittert = getPermitteringsoversikt(
            tidslinje,
            potensiellDatoForAGP2
        ).dagerBrukt;
    }
    if (antallDagerPermittert < antallDagerFørAGP2Inntreffer) {
        return undefined;
    }
    return potensiellDatoForAGP2.add(1, 'day');
};

export const getPermitteringsoversikt = (
    tidslinje: DatoMedKategori[],
    sisteDatoIAktuellPeriode: dayjs.Dayjs
): Permitteringsoversikt => {
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
        dagerAnnetFravær: antallDagerFravær,
        dagerBrukt: permittert - antallDagerFravær,
    };
};

export const finn18mndsperiodeForMaksimeringAvPermitteringsdager = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    dagensDato: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): DatoIntervall | undefined => {
    const førstePermitteringStart:
        | DatoMedKategori
        | undefined = finnPermitteringsDatoEtterGittDato(
        finnDato18MndTilbake(innføringsdatoAGP2),
        tidslinje
    );
    if (!førstePermitteringStart) return undefined;

    let potensiellSisteDatoIIntervall: Dayjs = dayjs(
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
    return {
        datoFra: finnDato18MndTilbake(potensiellSisteDatoIIntervall),
        datoTil: potensiellSisteDatoIIntervall,
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
        getPermitteringsoversikt(tidslinje, sisteDagIAktuellPeriode).dagerBrukt;
    const dagerMellomDagensDatoOgSisteDagIAktuellPeriode = antallDagerGått(
        dagensDato,
        sisteDagIAktuellPeriode
    );
    return (
        ubrukteDagerIPeriode - dagerMellomDagensDatoOgSisteDagIAktuellPeriode
    );
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
