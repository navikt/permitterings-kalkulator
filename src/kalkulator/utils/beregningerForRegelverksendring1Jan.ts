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
    finnFørsteDatoMedPermitteringUtenFravær,
    getSistePermitteringsdato,
} from './tidslinje-utils';
import {
    finnPermitteringssituasjonNormalRegelverk,
    PermitteringssituasjonStandarkRegelverk,
} from './beregningForMaksPermitteringsdagerNormaltRegelverk';
import { finnIndeksForDato } from '../Tidslinje/tidslinjefunksjoner';
import { Permitteringssregelverk } from '../SeResultat/SeResultat';

export enum PermitteringssituasjonVedSluttPaForlengelse {
    MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE = 'MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE',
    MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE = 'MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE',
    //Spesialtilfelle dersom lønnsplikten for permittering begynte før 1. juli, mens permittering uten lønn begynte etter 1. juli. Samtidig er 26 uker nådd etter 1. juli.
    MAKS_NÅDD_NORMALT_REGELVERK_SPESIALCASE = 'MAKS_NÅDD_NORMALT_REGELVERK_SPESIALCASE',
}

export const finnPermitteringssituasjonVedSluttPåForlengelse = (
    tidslinje: DatoMedKategori[],
    datoSluttPaDagepengeForlengelse: Dayjs,
    datoRegelEndring1Juli: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): PermitteringssituasjonVedSluttPaForlengelse => {
    const datoNåddMaksPermitteringsdager = finnDatoForMaksPermittering(
        tidslinje,
        datoRegelEndring1Juli,
        maksAntallDagerUtenLønnsplikt
    );
    if (
        datoNåddMaksPermitteringsdager &&
        datoNåddMaksPermitteringsdager.isSame(
            datoSluttPaDagepengeForlengelse,
            'day'
        )
    ) {
        return PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE;
    }
    if (
        datoNåddMaksPermitteringsdager &&
        datoNåddMaksPermitteringsdager.isSameOrAfter(
            datoSluttPaDagepengeForlengelse
        )
    ) {
        return PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE;
    }
    return PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_NORMALT_REGELVERK_SPESIALCASE;
};

//her er maksAntallDagerUtenLønnsplikt=26*7 for permitteringer startet fom 1. juli. 49*7 uker før 1. juli
export const finnDatoForMaksPermittering = (
    tidslinje: DatoMedKategori[],
    datoSluttPaDagepengeForlengelse: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): Dayjs | undefined => {
    const oversiktVedSluttPaDagepengeForlengelse = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        datoSluttPaDagepengeForlengelse
    );

    if (
        oversiktVedSluttPaDagepengeForlengelse.dagerBrukt >
        maksAntallDagerUtenLønnsplikt
    ) {
        return datoSluttPaDagepengeForlengelse;
    }
    let potensiellDatoForMaksPeriode: Dayjs = dayjs(
        datoSluttPaDagepengeForlengelse
    );
    let antallDagerPermittert = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        potensiellDatoForMaksPeriode
    ).dagerBrukt;
    const sisteDagITidslinjen = tidslinje[tidslinje.length - 1].dato;
    const sistePermitteringsdato = getSistePermitteringsdato(tidslinje);
    //while-løkke for å finne når maks permittering nås
    //ser ikke ut som det tas hensyn til at gjenstående permitteringsdager er mer kunne brukes
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

export const returnerIndeksAvDatoHvisIkkePermitteringsdato = (
    dato: Dayjs,
    tidslinje: DatoMedKategori[]
) => {
    const indeksITidslinje = tidslinje.findIndex((datoMedKategori) =>
        datoMedKategori.dato.isSame(dato, 'date')
    );
    if (
        indeksITidslinje > 0 &&
        tidslinje[indeksITidslinje].kategori !==
            DatointervallKategori.IKKE_PERMITTERT
    ) {
        return indeksITidslinje;
    }
    return false;
};

export const finnDenAktuelle18mndsperiodenSomSkalBeskrives = (
    regelverk: Permitteringssregelverk,
    tidslinje: DatoMedKategori[],
    dagensDato: Dayjs,
    datoRegelendring1Nov: Dayjs,
    datoRegelEndring1Juli: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): DatoIntervall | undefined => {
    const situasjon =
        regelverk === Permitteringssregelverk.KORONA_ORDNING
            ? finnPermitteringssituasjonVedSluttPåForlengelse(
                  tidslinje,
                  datoRegelendring1Nov,
                  datoRegelEndring1Juli,
                  maksAntallDagerUtenLønnsplikt
              )
            : finnPermitteringssituasjonNormalRegelverk(
                  tidslinje,
                  datoRegelendring1Nov,
                  maksAntallDagerUtenLønnsplikt
              );

    switch (situasjon) {
        case PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE:
            return til18mndsperiode(datoRegelendring1Nov);
        case PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE:
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
export const harLøpendePermitteringFørDatoSluttPaDagepengeForlengelse = (
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

export const nåddMaksAntallDagerKoronaordningIkkeLøpendePermittering = (
    tidslinje: DatoMedKategori[],
    datoSluttPaDagepengeForlengelse: Dayjs,
    datoRegelendring1Juli: Dayjs
) => {
    const indeksDatoSluttPaDagepengeForlengelse = finnIndeksForDato(
        datoSluttPaDagepengeForlengelse,
        tidslinje
    );
    const permittertVedDatoSluttPaDagepengeForlengelse =
        tidslinje[indeksDatoSluttPaDagepengeForlengelse].kategori !==
        DatointervallKategori.IKKE_PERMITTERT;
    if (permittertVedDatoSluttPaDagepengeForlengelse) {
        const datoPermitteringsStart = finnStartDatoForPermitteringUtIfraSluttdato(
            datoSluttPaDagepengeForlengelse,
            tidslinje
        );
        const permitteringStartetFør1Juli = datoPermitteringsStart.isBefore(
            datoRegelendring1Juli
        );
        if (permitteringStartetFør1Juli) {
            const potensiellDatoForMaksPermittering = finnDatoForMaksPermittering(
                tidslinje,
                datoSluttPaDagepengeForlengelse,
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

export const finnStartDatoForPermitteringUtIfraSluttdato = (
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
