import {
    AllePermitteringerOgFraværesPerioder,
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
    finnesIIntervall,
    finnPermitteringsIntervallMedsisteFraDato,
    til18mndsperiode,
    tilGyldigDatoIntervall,
} from './dato-utils';
import {
    finnFørsteDatoMedPermitteringUtenFravær,
    getSistePermitteringsdato,
} from './tidslinje-utils';

export enum PermitteringssituasjonStandarkRegelverk {
    MAKS_NÅDD_UTREGNET = 'MAKS_NÅDD',
    IKKE_NÅDD = 'IKKE_NÅDD',
}

export const slettPermitteringsdagerFørDato = (
    tidslinje: DatoMedKategori[],
    dato: Dayjs
) => {
    const avkuttetTidslinje: DatoMedKategori[] = [];
    tidslinje.forEach((datomedKategori) => {
        if (datomedKategori.dato.isBefore(dato)) {
            avkuttetTidslinje.push({
                dato: datomedKategori.dato,
                kategori: DatointervallKategori.IKKE_PERMITTERT,
            });
        } else {
            avkuttetTidslinje.push({
                dato: datomedKategori.dato,
                kategori: datomedKategori.kategori,
            });
        }
    });
    return avkuttetTidslinje;
};

export const finnPermitteringssituasjonNormalRegelverk = (
    tidslinjeUtenPermitteringFor1Juli: DatoMedKategori[],
    innføringsdatoRegelendring: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): PermitteringssituasjonStandarkRegelverk => {
    const datoForMaksPermitteringOppbrukt = finnDatoForMaksPermittering(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelendring,
        maksAntallDagerUtenLønnsplikt
    );
    if (datoForMaksPermitteringOppbrukt) {
        return PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_UTREGNET;
    }
    return PermitteringssituasjonStandarkRegelverk.IKKE_NÅDD;
};

//her er maksAntallDagerUtenLønnsplikt=26*7 for permitteringer startet fom 1. juli. 49*7 uker før 1. juli
export const finnDatoForMaksPermittering = (
    tidslinje: DatoMedKategori[],
    innføringsdatoRegelendring: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): Dayjs | undefined => {
    let potensiellDatoForMaksPeriode: Dayjs = dayjs(innføringsdatoRegelendring);
    let antallDagerPermittert = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        potensiellDatoForMaksPeriode
    ).dagerBrukt;
    const sisteDagITidslinjen = tidslinje[tidslinje.length - 1].dato;
    const sistePermitteringsdato = getSistePermitteringsdato(tidslinje);

    while (
        antallDagerPermittert <= maksAntallDagerUtenLønnsplikt &&
        potensiellDatoForMaksPeriode.isSameOrBefore(
            sistePermitteringsdato || sisteDagITidslinjen
        )
    ) {
        const antallDagerTilNesteGjett =
            maksAntallDagerUtenLønnsplikt - antallDagerPermittert + 1;
        potensiellDatoForMaksPeriode = potensiellDatoForMaksPeriode.add(
            antallDagerTilNesteGjett,
            'days'
        );
        antallDagerPermittert = getPermitteringsoversiktFor18Måneder(
            tidslinje,
            potensiellDatoForMaksPeriode
        ).dagerBrukt;
    }
    if (antallDagerPermittert <= maksAntallDagerUtenLønnsplikt) {
        return undefined;
    }
    return potensiellDatoForMaksPeriode;
};

export const getPermitteringsoversiktFor18Måneder = (
    tidslinje: DatoMedKategori[],
    sisteDatoI18mndsperiode: Dayjs
): Permitteringsoversikt => {
    return getPermitteringsoversikt(
        tidslinje,
        til18mndsperiode(sisteDatoI18mndsperiode)
    );
};

export const getPermitteringsoversikt = (
    tidslinje: DatoMedKategori[],
    periode: DatoIntervall
): Permitteringsoversikt => {
    let permittert = 0;
    let antallDagerFravær = 0;
    let gjenståendeDager = 0;

    tidslinje.forEach((dag) => {
        if (finnesIIntervall(dag.dato, periode)) {
            if (dag.kategori === DatointervallKategori.PERMITTERT_UTEN_FRAVÆR) {
                permittert++;
            }
            if (dag.kategori === DatointervallKategori.IKKE_PERMITTERT) {
                gjenståendeDager++;
            }
            if (dag.kategori === DatointervallKategori.PERMITTERT_MED_FRAVÆR) {
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
    innføringsdatoRegelendring: Dayjs,
    dagensDato: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): (DatoIntervall & { erLøpende: false }) | undefined => {
    const førstePermitteringStart:
        | DatoMedKategori
        | undefined = finnFørsteDatoMedPermitteringUtenFravær(
        tidslinje,
        finnDato18MndTilbake(innføringsdatoRegelendring)
    );
    if (!førstePermitteringStart) return undefined;

    let potensiellSisteDatoIIntervall: Dayjs = dayjs(
        finnDato18MndFram(førstePermitteringStart.dato)
    );
    let overskuddAvPermitteringsdagerITidsintervall = finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager(
        potensiellSisteDatoIIntervall,
        tidslinje,
        dagensDato,
        maksAntallDagerUtenLønnsplikt
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
                | undefined = finnFørsteDatoMedPermitteringUtenFravær(
                tidslinje,
                tidslinje[indeksDatoBegynnelsenAv18mndsPeriode].dato
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
            maksAntallDagerUtenLønnsplikt
        );
    }
    return {
        datoFra: finnDato18MndTilbake(potensiellSisteDatoIIntervall),
        datoTil: potensiellSisteDatoIIntervall,
        erLøpende: false,
    };
};

export const finnOverskuddAvPermitteringsdagerFordeltPåKalenderdager = (
    sisteDagIAktuellPeriode: Dayjs,
    tidslinje: DatoMedKategori[],
    dagensDato: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): number => {
    const ubrukteDagerIPeriode =
        maksAntallDagerUtenLønnsplikt -
        getPermitteringsoversiktFor18Måneder(tidslinje, sisteDagIAktuellPeriode)
            .dagerBrukt;
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
            DatointervallKategori.PERMITTERT_UTEN_FRAVÆR
    ) {
        return indeksITidslinje;
    }
};

export const harLøpendePermitteringMedOppstartFørRegelendring = (
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder,
    datoRegelEndring: Dayjs
) => {
    const sistePermitteringsPeriode = finnPermitteringsIntervallMedsisteFraDato(
        allePermitteringerOgFraværesPerioder.permitteringer
    );
    const gyldigPermitteringsIntervall = sistePermitteringsPeriode
        ? tilGyldigDatoIntervall(sistePermitteringsPeriode)
        : undefined;
    if (!gyldigPermitteringsIntervall) {
        return false;
    }
    if (gyldigPermitteringsIntervall.datoFra?.isBefore(datoRegelEndring)) {
        if (gyldigPermitteringsIntervall.erLøpende) {
            return true;
        }
    }
    return false;
};
