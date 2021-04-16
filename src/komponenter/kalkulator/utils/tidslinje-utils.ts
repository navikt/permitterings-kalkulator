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
    tilGyldigDatoIntervall,
} from './dato-utils';

export const finnInitialgrenserForTidslinjedatoer = (
    dagensDato: Dayjs
): DatoIntervall & { erLøpende: false } => {
    const bakover18mnd = finnDato18MndTilbake(dagensDato);
    const maksGrenseIBakoverITid = bakover18mnd.subtract(56, 'days');
    const maksGrenseFramoverITid = dagensDato.add(112, 'days');

    return {
        datoFra: maksGrenseIBakoverITid,
        datoTil: maksGrenseFramoverITid,
        erLøpende: false,
    };
};

const finnFørsteDefinertePermittering = (
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
): DatoIntervall | undefined => {
    const førsteDefinertePermittering = allePermitteringerOgFraværesPerioder.permitteringer.find(
        (periode) => tilGyldigDatoIntervall(periode)
    );
    return førsteDefinertePermittering
        ? tilGyldigDatoIntervall(førsteDefinertePermittering)
        : undefined;
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
    const sisteDatoIsisteMulige18mndsPeriode = sistePermitteringsstart
        ? finnDato18MndFram(sistePermitteringsstart)
        : undefined;

    return getSenesteDato([
        senesteDatoPåTidslinje,
        sisteDatoIsisteMulige18mndsPeriode,
    ])!;
};

export const konstruerTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs,
    sisteDatoVistPåTidslinjen: Dayjs
): DatoMedKategori[] => {
    const listeMedTidslinjeObjekter: DatoMedKategori[] = [];

    const antallObjektITidslinje = antallDagerGått(
        finnInitialgrenserForTidslinjedatoer(dagensDato).datoFra,
        sisteDatoVistPåTidslinjen
    );
    const startDato = finnInitialgrenserForTidslinjedatoer(dagensDato).datoFra;
    listeMedTidslinjeObjekter.push(
        finneKategori(startDato, allePermitteringerOgFravær)
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
    skalVæreEtter: Dayjs
): DatoMedKategori | undefined => {
    return tidslinje.find(
        (datoMedKategori) =>
            datoMedKategori.kategori ===
                DatointervallKategori.PERMITTERT_UTEN_FRAVÆR &&
            datoMedKategori.dato.isSameOrAfter(skalVæreEtter)
    );
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
