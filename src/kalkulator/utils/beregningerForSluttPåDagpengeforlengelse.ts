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
    finnSisteDatoMedPermitteringUtenFravær,
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
    maksAntallDagerUtenLønnsplikt: number
): PermitteringssituasjonVedSluttPaForlengelse => {
    const dagerBruktVedSluttPåDagpengeforlengelse = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        datoSluttPaDagepengeForlengelse
    ).dagerBrukt;
    if (
        dagerBruktVedSluttPåDagpengeforlengelse > maksAntallDagerUtenLønnsplikt
    ) {
        return PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE;
    }

    return PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE;
};

//denne finner datoen der maks er nådd. Ikke dagen etter (dagen etter er da lønnsplikten inntrer)
export const finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli = (
    tidslinje: DatoMedKategori[],
    datoSluttPaDagepengeForlengelse: Dayjs,
    maksAntallDagerUtenLønnsplikt: number,
    dagensDato: Dayjs
): Dayjs | undefined => {
    const oversiktVedSluttPaDagepengeForlengelse = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        datoSluttPaDagepengeForlengelse
    );
    if (
        oversiktVedSluttPaDagepengeForlengelse.dagerBrukt >=
        maksAntallDagerUtenLønnsplikt
    ) {
        return datoSluttPaDagepengeForlengelse;
    }
    let potensiellDatoForMaksPeriode: Dayjs = dayjs(dagensDato);
    let antallDagerPermittert = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        potensiellDatoForMaksPeriode
    ).dagerBrukt;
    const sistePermitteringsdato = finnSisteDatoMedPermitteringUtenFravær(
        tidslinje
    );
    while (
        antallDagerPermittert < maksAntallDagerUtenLønnsplikt &&
        potensiellDatoForMaksPeriode.isBefore(sistePermitteringsdato)
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
    return potensiellDatoForMaksPeriode.subtract(1, 'day');
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
    datoRegelendring1Nov: Dayjs
): DatoIntervall | undefined => {
    const maksAntallDagerUtenLønnsplikt =
        regelverk === Permitteringssregelverk.KORONA_ORDNING ? 49 * 7 : 26 * 7;

    const situasjon =
        regelverk === Permitteringssregelverk.KORONA_ORDNING
            ? finnPermitteringssituasjonVedSluttPåForlengelse(
                  tidslinje,
                  datoRegelendring1Nov,
                  49 * 7
              )
            : finnPermitteringssituasjonNormalRegelverk(
                  tidslinje,
                  datoRegelendring1Nov,
                  26 * 7
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
        case PermitteringssituasjonStandarkRegelverk.MAKS_IKKE_NÅDD:
            return finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                datoRegelendring1Nov,
                dagensDato,
                maksAntallDagerUtenLønnsplikt
            );
        case PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE:
            const maksDatoNådd = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
                tidslinje,
                datoRegelendring1Nov,
                maksAntallDagerUtenLønnsplikt,
                dagensDato
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
    datoRegelendring1Juli: Dayjs,
    dagensDato: Dayjs
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
            const potensiellDatoForMaksPermittering = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
                tidslinje,
                datoSluttPaDagepengeForlengelse,
                49 * 7,
                dagensDato
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

export const finnUtOmKoronaregelverkPtensieltSkalBrukes = (
    tidslinje: DatoMedKategori[],
    dagensDato: Dayjs,
    regelEndring1Juli: Dayjs
) => {
    const sistePermittering = finnSisteDatoMedPermitteringUtenFravær(tidslinje);
    const permitteringsStart = finnStartDatoForPermitteringUtIfraSluttdato(
        sistePermittering,
        tidslinje
    );
    return (
        sistePermittering.isSameOrAfter(dagensDato, 'day') &&
        permitteringsStart.isBefore(regelEndring1Juli)
    );
};

export const finnStartDatoForPermitteringUtIfraSluttdato = (
    sluttdato: Dayjs,
    tidslinje: DatoMedKategori[]
) => {
    const indeksSluttDato = finnIndeksForDato(sluttdato, tidslinje);
    let indeks = indeksSluttDato;
    while (
        tidslinje[indeks].kategori !== DatointervallKategori.IKKE_PERMITTERT &&
        indeks > 0
    ) {
        indeks--;
    }
    return tidslinje[indeks + 1].dato;
};
