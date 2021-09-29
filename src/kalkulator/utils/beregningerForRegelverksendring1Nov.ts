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
    MAKS_NÅDD_1_NOVEMBER = 'MAKS_NÅDD_1_NOVEMBER',
    MAKS_NÅDD_ETTER_1_NOVEMBER = 'MAKS_NÅDD_ETTER_1_NOVEMBER',
}

export const finnPermitteringssituasjon1November = (
    tidslinje: DatoMedKategori[],
    innføringsdatoRegelendring: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): Permitteringssituasjon1November => {
    const datoNåddMaksPermitteringsdager = finnDatoForMaksPermittering(
        tidslinje,
        innføringsdatoRegelendring,
        maksAntallDagerUtenLønnsplikt
    );
    //datoNåddMaksPermitteringsdager vil være definert siden denne casen forutsetter at det finnes en løpende permittering iverksatt før 1. juli

    return datoNåddMaksPermitteringsdager?.isSame(
        innføringsdatoRegelendring,
        'date'
    )
        ? Permitteringssituasjon1November.MAKS_NÅDD_1_NOVEMBER
        : Permitteringssituasjon1November.MAKS_NÅDD_ETTER_1_NOVEMBER;
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
    console.log('denne bli også kallt');

    if (oversiktVedInnføringsdato.dagerBrukt > maksAntallDagerUtenLønnsplikt) {
        console.log('innføringsdato');
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
    console.log(potensiellDatoForMaksPeriode);
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
    innføringsdatoRegelendring: Dayjs,
    maksAntallDagerUtenLønnsplikt: number
): DatoIntervall | undefined => {
    const situasjon =
        regelverk === Permitteringssregelverk.KORONA_ORDNING
            ? finnPermitteringssituasjon1November(
                  tidslinje,
                  innføringsdatoRegelendring,
                  maksAntallDagerUtenLønnsplikt
              )
            : finnPermitteringssituasjonNormalRegelverk(
                  tidslinje,
                  innføringsdatoRegelendring,
                  maksAntallDagerUtenLønnsplikt
              );

    switch (situasjon) {
        case Permitteringssituasjon1November.MAKS_NÅDD_1_NOVEMBER:
            return til18mndsperiode(innføringsdatoRegelendring);
        case Permitteringssituasjon1November.MAKS_NÅDD_ETTER_1_NOVEMBER:
            const periode18mndsPeriodeNås = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                innføringsdatoRegelendring,
                dagensDato,
                maksAntallDagerUtenLønnsplikt
            )!;
            return periode18mndsPeriodeNås;
        case PermitteringssituasjonStandarkRegelverk.IKKE_NÅDD:
            return finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                innføringsdatoRegelendring,
                dagensDato,
                maksAntallDagerUtenLønnsplikt
            );
        case PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_UTREGNET:
            const maksDatoNådd = finnDatoForMaksPermittering(
                tidslinje,
                innføringsdatoRegelendring,
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
    console.log('denne bli kallt');
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
        console.log(permitteringStartetFør1Juli, 'før 1. juli');
        if (permitteringStartetFør1Juli) {
            const potensiellDatoForMaksPermittering = finnDatoForMaksPermittering(
                tidslinje,
                datoRegelendring1nov,
                49 * 7
            );
            console.log(
                formaterDato(potensiellDatoForMaksPermittering!!),
                'here'
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
        indeks--;
    }
    return tidslinje[indeks].dato;
};
