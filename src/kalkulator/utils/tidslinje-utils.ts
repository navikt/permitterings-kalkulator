import { Dayjs } from 'dayjs';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    DatointervallKategori,
    DatoMedKategori,
} from '../typer';
import {
    antallDagerGått,
    finnDato18MndFram,
    finnDato18MndTilbake,
    finnesIIntervaller,
    getSenesteDato,
} from './dato-utils';
import { finnIndeksForDato } from '../Tidslinje/tidslinjefunksjoner';
import { Permitteringssregelverk } from '../SeResultat/SeResultat';

export const finnInitialgrenserForTidslinjedatoer = (
    dagensDato: Dayjs
): DatoIntervall & { erLøpende: false } => {
    const maksGrenseIBakoverITid = finnDato18MndTilbake(dagensDato);
    const maksGrenseFramoverITid = dagensDato.add(112, 'days');

    return {
        datoFra: maksGrenseIBakoverITid,
        datoTil: maksGrenseFramoverITid,
        erLøpende: false,
    };
};

const finneKategori = (
    dato: Dayjs,
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
): DatoMedKategori => {
    const erFraVærsDato = finnesIIntervaller(
        dato,
        allePermitteringerOgFraværesPerioder.andreFraværsperioder
    );
    const erPermittert = finnesIIntervaller(
        dato,
        allePermitteringerOgFraværesPerioder.permitteringer
    );
    if (erFraVærsDato && erPermittert) {
        return {
            kategori: DatointervallKategori.PERMITTERT_MED_FRAVÆR,
            dato: dato,
        };
    }
    if (erPermittert) {
        return {
            kategori: DatointervallKategori.PERMITTERT_UTEN_FRAVÆR,
            dato: dato,
        };
    }
    return {
        kategori: DatointervallKategori.IKKE_PERMITTERT,
        dato: dato,
    };
};

export const regnUtHvaSisteDatoPåTidslinjenSkalVære = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs
): Dayjs => {
    let senesteDatoPåTidslinje = finnInitialgrenserForTidslinjedatoer(
        dagensDato
    ).datoTil;
    const sistePermitteringsstart = getSenesteDato(
        allePermitteringerOgFravær.permitteringer.map(
            (permittering) => permittering.datoFra
        )
    );
    const sisteEndtFraværsperiode = getSenesteDato(
        allePermitteringerOgFravær.andreFraværsperioder.map(
            (fravær) => fravær.datoTil
        )
    );
    const forstePermitteringsDagEtterFravær = sisteEndtFraværsperiode?.add(
        1,
        'day'
    );
    const forstePermitteringsDagEtterFraværDato18mndFram = forstePermitteringsDagEtterFravær
        ? finnDato18MndFram(forstePermitteringsDagEtterFravær)
        : undefined;
    const sisteDatoIsisteMulige18mndsPeriode = sistePermitteringsstart
        ? finnDato18MndFram(sistePermitteringsstart)
        : undefined;

    return getSenesteDato([
        senesteDatoPåTidslinje,
        sisteDatoIsisteMulige18mndsPeriode,
        forstePermitteringsDagEtterFraværDato18mndFram,
    ])?.add(3, 'months')!;
};

export const konstruerTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs
): DatoMedKategori[] => {
    const listeMedTidslinjeObjekter: DatoMedKategori[] = [];
    const antallObjektITidslinje = antallDagerGått(
        finnDato18MndTilbake(dagensDato),
        finnDato18MndFram(dagensDato)
    );
    listeMedTidslinjeObjekter.push(
        finneKategori(
            finnDato18MndTilbake(dagensDato),
            allePermitteringerOgFravær
        )
    );
    for (let dag = 1; dag < antallObjektITidslinje; dag++) {
        const nesteDag = listeMedTidslinjeObjekter[dag - 1].dato.add(1, 'day');
        listeMedTidslinjeObjekter.push(
            finneKategori(nesteDag, allePermitteringerOgFravær)
        );
    }
    return listeMedTidslinjeObjekter;
};
export const finnFørsteDatoMedPermitteringUtenFravær = (
    tidslinje: DatoMedKategori[],
    skalVæreEtter?: Dayjs
): DatoMedKategori | undefined => {
    return tidslinje.find(
        (datoMedKategori) =>
            (skalVæreEtter &&
                datoMedKategori.kategori ===
                    DatointervallKategori.PERMITTERT_UTEN_FRAVÆR &&
                datoMedKategori.dato.isAfter(skalVæreEtter)) ||
            (!skalVæreEtter &&
                datoMedKategori.kategori ===
                    DatointervallKategori.PERMITTERT_UTEN_FRAVÆR)
    );
};

export const finnSisteDatoMedPermitteringUtenFravær = (
    tidslinje: DatoMedKategori[]
): Dayjs => {
    let tempSisteDato = tidslinje[0].dato;
    tidslinje.forEach((datoMedKategori) => {
        if (
            datoMedKategori.kategori !==
                DatointervallKategori.IKKE_PERMITTERT &&
            datoMedKategori.dato.isAfter(tempSisteDato)
        ) {
            tempSisteDato = datoMedKategori.dato;
        }
    });
    return tempSisteDato;
};

export const erPermittertVedDato = (
    tidslinje: DatoMedKategori[],
    dato: Dayjs
): boolean => {
    const status = tidslinje.find((datoMedKategori) =>
        datoMedKategori.dato.isSame(dato, 'day')
    );
    return (
        status?.kategori === DatointervallKategori.PERMITTERT_UTEN_FRAVÆR ||
        status?.kategori === DatointervallKategori.PERMITTERT_MED_FRAVÆR
    );
};

export const getSistePermitteringsdato = (
    tidslinje: DatoMedKategori[]
): Dayjs | undefined => {
    for (let i = tidslinje.length - 1; i >= 0; i--) {
        const kategori = tidslinje[i].kategori;
        if (
            kategori === DatointervallKategori.PERMITTERT_UTEN_FRAVÆR ||
            kategori === DatointervallKategori.PERMITTERT_MED_FRAVÆR
        ) {
            return tidslinje[i].dato;
        }
    }
    return undefined;
};

export const finnFørstePermitteringsdatoFraDato = (
    tidslinje: DatoMedKategori[],
    dato: Dayjs
) => {
    const indeksDato = finnIndeksForDato(dato, tidslinje);
    let iterator = indeksDato;
    while (
        tidslinje[iterator].kategori === DatointervallKategori.IKKE_PERMITTERT
    ) {
        iterator++;
    }
    return tidslinje[iterator].dato;
};

export const konstruerTidslinjeSomSletterPermitteringFørDato = (
    tidslinje: DatoMedKategori[],
    datoSlettesEtter: Dayjs,
    gjeldendeRegelverk: Permitteringssregelverk,
    datoMaksPermitteringNås?: Dayjs
) => {
    const nyTidslinje: DatoMedKategori[] = [];
    tidslinje.forEach((datoMedKategori, index) => {
        if (
            datoMaksPermitteringNås &&
            datoMedKategori.kategori !==
                DatointervallKategori.IKKE_PERMITTERT &&
            datoMedKategori.dato.isAfter(datoMaksPermitteringNås)
        ) {
            const nyDatoMedKategori: DatoMedKategori = {
                dato: datoMedKategori.dato,
                kategori: DatointervallKategori.SLETTET_PERMITTERING_FØR_1_JULI,
            };
            nyTidslinje.push(nyDatoMedKategori);
        } else if (
            gjeldendeRegelverk === Permitteringssregelverk.NORMALT_REGELVERK &&
            datoMedKategori.kategori !==
                DatointervallKategori.IKKE_PERMITTERT &&
            datoMedKategori.dato.isBefore(datoSlettesEtter)
        ) {
            const nyDatoMedKategori: DatoMedKategori = {
                dato: datoMedKategori.dato,
                kategori: DatointervallKategori.SLETTET_PERMITTERING_FØR_1_JULI,
            };
            nyTidslinje.push(nyDatoMedKategori);
        } else {
            nyTidslinje.push({ ...datoMedKategori });
        }
    });
    return nyTidslinje;
};
