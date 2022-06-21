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
    formaterDato,
    til18mndsperiode,
    tilGyldigDatoIntervall,
} from './dato-utils';
import {
    erPermittertVedDato,
    finnFørsteDatoMedPermitteringUtenFravær,
    getSistePermitteringsdato,
} from './tidslinje-utils';

export enum PermitteringssituasjonStandarkRegelverk {
    MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE = 'MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE',
    MAKS_NÅDD_IKKE_PERMITTERT_VED_SLUTTDATO_AV_FORLENGELSE = 'MAKS_NÅDD_IKKE_PERMITTERT_VED_SLUTTDATO_AV_FORLENGELSE',
    MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE = 'MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE',
    MAKS_IKKE_NÅDD = 'MAKS_IKKE_NÅDD',
}

export const lagNyListeHvisPermitteringFør1Juli = (
    tidslinje: DatoMedKategori[],
    dato: Dayjs
) => {
    let harPermitteringFørRegelEndring = false;
    const avkuttetTidslinje: DatoMedKategori[] = [];
    tidslinje.forEach((datomedKategori) => {
        if (datomedKategori.dato.isBefore(dato)) {
            avkuttetTidslinje.push({
                dato: datomedKategori.dato,
                kategori: DatointervallKategori.IKKE_PERMITTERT,
            });
            if (
                datomedKategori.kategori !==
                DatointervallKategori.IKKE_PERMITTERT
            ) {
                harPermitteringFørRegelEndring = true;
            }
        } else {
            avkuttetTidslinje.push({
                dato: datomedKategori.dato,
                kategori: datomedKategori.kategori,
            });
        }
    });
    if (harPermitteringFørRegelEndring) {
        return avkuttetTidslinje;
    }
};

export const finnPermitteringssituasjonNormalRegelverk = (
    tidslinjeUtenPermitteringFor1Juli: DatoMedKategori[],
    innføringsdatoRegelendring: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): PermitteringssituasjonStandarkRegelverk => {
    const dagerPermittertVedInnføringsdato = getPermitteringsoversiktFor18Måneder(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelendring
    ).dagerBrukt;
    const erPermittertPåInnføringsdato = erPermittertVedDato(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelendring
    );
    if (
        dagerPermittertVedInnføringsdato >= maksAntallDagerUtenLønnsplikt &&
        erPermittertPåInnføringsdato
    ) {
        return PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE;
    }
    if (
        dagerPermittertVedInnføringsdato >= maksAntallDagerUtenLønnsplikt &&
        !erPermittertPåInnføringsdato
    ) {
        return PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_IKKE_PERMITTERT_VED_SLUTTDATO_AV_FORLENGELSE;
    }
    const datoForMaksPermitteringOppbrukt = finnDatoForMaksPermitteringNormaltRegelverk(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelendring,
        maksAntallDagerUtenLønnsplikt
    );
    if (datoForMaksPermitteringOppbrukt) {
        return PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE;
    }
    return PermitteringssituasjonStandarkRegelverk.MAKS_IKKE_NÅDD;
};

export const finnDatoForMaksPermitteringNormaltRegelverk = (
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
        antallDagerPermittert < maksAntallDagerUtenLønnsplikt &&
        potensiellDatoForMaksPeriode.isSameOrBefore(
            sistePermitteringsdato || sisteDagITidslinjen
        )
    ) {
        const antallDagerTilNesteGjett =
            maksAntallDagerUtenLønnsplikt - antallDagerPermittert;
        potensiellDatoForMaksPeriode = potensiellDatoForMaksPeriode.add(
            antallDagerTilNesteGjett,
            'days'
        );
        antallDagerPermittert = getPermitteringsoversiktFor18Måneder(
            tidslinje,
            potensiellDatoForMaksPeriode
        ).dagerBrukt;
    }
    if (antallDagerPermittert < maksAntallDagerUtenLønnsplikt) {
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
