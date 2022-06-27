import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    DatointervallKategori,
    DatoMedKategori,
    Permitteringsoversikt,
} from '../typer';
import { Dayjs } from 'dayjs';
import {
    finnDato18MndTilbake,
    finnesIIntervall,
    finnPermitteringsIntervallMedsisteFraDato,
    til18mndsperiode,
    tilGyldigDatoIntervall,
} from './dato-utils';
import { getSistePermitteringsdato } from './tidslinje-utils';

export enum PermitteringssituasjonStandarkRegelverk {
    MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE = 'MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE',
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
    dagensDato: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): PermitteringssituasjonStandarkRegelverk => {
    const datoForMaksPermitteringOppbrukt = finnDatoForMaksPermitteringNormaltRegelverk(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelendring,
        maksAntallDagerUtenLønnsplikt,
        dagensDato
    );
    if (!datoForMaksPermitteringOppbrukt) {
        return PermitteringssituasjonStandarkRegelverk.MAKS_IKKE_NÅDD;
    }

    if (
        datoForMaksPermitteringOppbrukt.isSame(
            innføringsdatoRegelendring,
            'day'
        )
    ) {
        return PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE;
    }
    return PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE;
};

//18 måneder etter innføringsdatoRegelendring kan potensiellDatoForMaksPeriode vare 18 mnd tilbake fra dagensDato da regelinnforing 1. april 2022 blir irrelevant
export const finnDatoForMaksPermitteringNormaltRegelverk = (
    tidslinje: DatoMedKategori[],
    innføringsdatoRegelendring: Dayjs,
    maksAntallDagerUtenLønnsplikt: number,
    dagensDato: Dayjs
): Dayjs | undefined => {
    const tilbake18mndFraDagensDato = finnDato18MndTilbake(dagensDato);
    let potensiellDatoForMaksPeriode: Dayjs = tilbake18mndFraDagensDato;
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
    if (potensiellDatoForMaksPeriode.isBefore(innføringsdatoRegelendring)) {
        return innføringsdatoRegelendring;
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
