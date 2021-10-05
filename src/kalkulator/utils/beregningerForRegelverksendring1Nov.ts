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
    finnesIIntervall,
    finnPotensiellLøpendePermittering,
    formaterDato,
    til18mndsperiode,
    tilGyldigDatoIntervall,
} from './dato-utils';
import {
    erPermittertVedDato,
    finnFørsteDatoMedPermitteringUtenFravær,
    getSistePermitteringsdato,
} from './tidslinje-utils';
import { Permitteringssregelverk } from '../SeResultat/Utregningstekst/Utregningstekst';
import {
    finnPermitteringssituasjonNormalRegelverk,
    PermitteringssituasjonStandarkRegelverk,
} from './beregningForMaksPermitteringsdagerNormaltRegelverk';
import { finnIndeksForDato } from '../Tidslinje/tidslinjefunksjoner';

export enum Permitteringssituasjon1November {
    MAKS_NÅDD_1_NOVEMBER_LØPENDE = 'MAKS_NÅDD_1_NOVEMBER_LØPENDE',
    MAKS_NÅDD_ETTER_1_NOVEMBER_LØPENDE = 'MAKS_NÅDD_ETTER_1_NOVEMBER_LØPENDE',
    MAKS_NÅDD_IKKE_LØPENDE = 'MAKS_NÅDD_IKKE_LØPENDE',
}

export const finnPermitteringssituasjon1November = (
    tidslinje: DatoMedKategori[],
    datoRegelEndring1Nov: Dayjs,
    datoRegelEndring1Juli: Dayjs,
    maksAntallDagerUtenLønnsplikt: number,
    erLøpendePermittering: boolean
): Permitteringssituasjon1November => {
    const datoNåddMaksPermitteringsdager = finnDatoForMaksPermittering(
        tidslinje,
        datoRegelEndring1Juli,
        maksAntallDagerUtenLønnsplikt
    );

    if (
        finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli(
            tidslinje,
            datoRegelEndring1Nov,
            datoRegelEndring1Juli
        ) &&
        !erLøpendePermittering
    ) {
        return Permitteringssituasjon1November.MAKS_NÅDD_IKKE_LØPENDE;
    }

    //datoNåddMaksPermitteringsdager vil være definert siden denne casen forutsetter at det finnes en løpende permittering iverksatt før 1. juli

    return datoNåddMaksPermitteringsdager?.isSame(datoRegelEndring1Nov, 'date')
        ? Permitteringssituasjon1November.MAKS_NÅDD_1_NOVEMBER_LØPENDE
        : Permitteringssituasjon1November.MAKS_NÅDD_ETTER_1_NOVEMBER_LØPENDE;
};

//her er maksAntallDagerUtenLønnsplikt=26*7 for permitteringer startet fom 1. juli. 49*7 uker før 1. juli
export const finnDatoForMaksPermittering = (
    tidslinje: DatoMedKategori[],
    innføringsdatoRegelendring: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): Dayjs | undefined => {
    const oversiktVedInnføringsdato = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        innføringsdatoRegelendring
    );

    if (oversiktVedInnføringsdato.dagerBrukt > maksAntallDagerUtenLønnsplikt) {
        return innføringsdatoRegelendring;
    }

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
        overskuddAvPermitteringsdagerITidsintervall <
            maksAntallDagerUtenLønnsplikt
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
export const finnDenAktuelle18mndsperiodenSomSkalBeskrives = (
    regelverk: Permitteringssregelverk,
    tidslinje: DatoMedKategori[],
    dagensDato: Dayjs,
    datoRegelendring1Nov: Dayjs,
    datoRegelEndring1Juli: Dayjs,
    maksAntallDagerUtenLønnsplikt: number,
    finnesLøpendePermittering: boolean
): DatoIntervall | undefined => {
    const situasjon =
        regelverk === Permitteringssregelverk.KORONA_ORDNING
            ? finnPermitteringssituasjon1November(
                  tidslinje,
                  datoRegelendring1Nov,
                  datoRegelEndring1Juli,
                  maksAntallDagerUtenLønnsplikt,
                  finnesLøpendePermittering
              )
            : finnPermitteringssituasjonNormalRegelverk(
                  tidslinje,
                  datoRegelendring1Nov,
                  maksAntallDagerUtenLønnsplikt
              );

    switch (situasjon) {
        case Permitteringssituasjon1November.MAKS_NÅDD_1_NOVEMBER_LØPENDE:
            return til18mndsperiode(datoRegelendring1Nov);
        case Permitteringssituasjon1November.MAKS_NÅDD_ETTER_1_NOVEMBER_LØPENDE:
            const periode18mndsPeriodeNås = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                datoRegelendring1Nov,
                dagensDato,
                maksAntallDagerUtenLønnsplikt
            )!;
            return periode18mndsPeriodeNås;
        case PermitteringssituasjonStandarkRegelverk.IKKE_NÅDD:
            return finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                datoRegelendring1Nov,
                dagensDato,
                maksAntallDagerUtenLønnsplikt
            );
        case PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_UTREGNET:
            const maksDatoNådd = finnDatoForMaksPermittering(
                tidslinje,
                datoRegelendring1Nov,
                maksAntallDagerUtenLønnsplikt
            );
            if (maksDatoNådd) {
                return til18mndsperiode(maksDatoNådd?.subtract(1, 'day'));
            }
            return undefined;
    }
};

//sjekk om man får feil ved overlappende perioder dersom siste start overlapper med en tidligere permittering som ikker er løpende
export const harLøpendePermitteringMedOppstartFørRegelendring = (
    permitteringer: Partial<DatoIntervall>[],
    datoRegelEndring: Dayjs
) => {
    const sistePermitteringsPeriode = finnPotensiellLøpendePermittering(
        permitteringer
    );
    const gyldigPermitteringsIntervall =
        sistePermitteringsPeriode &&
        sistePermitteringsPeriode?.datoFra?.isBefore(datoRegelEndring)
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

export const finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli = (
    tidslinje: DatoMedKategori[],
    datoRegelendring1nov: Dayjs,
    datoRegelendring1Juli: Dayjs
) => {
    const indeks1Nov = finnIndeksForDato(datoRegelendring1nov, tidslinje);
    if (
        tidslinje[indeks1Nov].kategori !== DatointervallKategori.IKKE_PERMITTERT
    ) {
        const datoPermitteringsStart = finnStartDatoForPermitteringUtIfraSluttdato(
            datoRegelendring1nov,
            tidslinje
        );
        const permitteringStartetFør1Juli = datoPermitteringsStart.isBefore(
            datoRegelendring1Juli
        );
        if (permitteringStartetFør1Juli) {
            const potensiellDatoForMaksPermittering = finnDatoForMaksPermittering(
                tidslinje,
                datoRegelendring1nov,
                49 * 7
            );
            if (potensiellDatoForMaksPermittering) {
                const permitteringsStartAvPermittering = finnStartDatoForPermitteringUtIfraSluttdato(
                    potensiellDatoForMaksPermittering,
                    tidslinje
                );
                if (
                    permitteringsStartAvPermittering.isBefore(
                        datoRegelendring1Juli
                    )
                ) {
                    return potensiellDatoForMaksPermittering;
                }
            }
        }
    }
};

const finnStartDatoForPermitteringUtIfraSluttdato = (
    sluttdato: Dayjs,
    tidslinje: DatoMedKategori[]
) => {
    const indeksSluttDato = finnIndeksForDato(sluttdato, tidslinje);
    let indeks = indeksSluttDato;
    while (
        tidslinje[indeks].kategori !== DatointervallKategori.IKKE_PERMITTERT
    ) {
        if (tidslinje[indeks].dato.isBefore(finnDato18MndTilbake(sluttdato))) {
            return finnDato18MndTilbake(sluttdato);
        }
        indeks--;
    }
    return tidslinje[indeks + 1].dato;
};
