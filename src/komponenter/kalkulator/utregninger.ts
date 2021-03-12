import {
    AllePermitteringerOgFraværesPerioder,
    AllePermitteringerOgFraværesPerioderDayjs,
    DatoIntervall,
    DatoIntervallDayjs,
    DatoMedKategoriDayjs,
    OversiktOverBrukteOgGjenværendeDager,
    tilAllePermitteringerOgFraværesPerioderDayjs,
} from './typer';
import dayjs, { Dayjs } from 'dayjs';

export const ARBEIDSGIVERPERIODE2DATO = new Date('2021-03-01');

export const antalldagerGått = (fra?: Date, til?: Date) => {
    if (fra && til) {
        const msGatt = til.getTime() - fra.getTime();
        const dagerGått = msGatt / (1000 * 60 * 60 * 24);
        return Math.round(dagerGått + 1);
    }
    return 0;
};

export const antallDagerGåttDayjs = (fra?: Dayjs, til?: Dayjs) => {
    if (fra && til) {
        return til.diff(fra, 'days') + 1;
    } else {
        return 0;
    }
};

export const antallUkerRundetOpp = (antallDager: number) => {
    return Math.ceil(antallDager / 7);
};

export const sumPermitteringerOgFravær = (
    allePErmitteringerOgFraværsperioder: AllePermitteringerOgFraværesPerioderDayjs,
    dagensDato: Dayjs
): OversiktOverBrukteOgGjenværendeDager => {
    const statusAlleDager18mndLsite = konstruerStatiskTidslinje(
        allePErmitteringerOgFraværsperioder,
        dagensDato
    );
    let permittert = 0;
    let antallDagerFravær = 0;
    let gjenståendeDager = 0;
    statusAlleDager18mndLsite.forEach((dag) => {
        if (dag.kategori === 0) {
            permittert++;
        }
        if (dag.kategori === 1) {
            gjenståendeDager++;
        }
        if (dag.kategori === 2) {
            antallDagerFravær++;
        }
    });

    const oversikt: OversiktOverBrukteOgGjenværendeDager = {
        dagerPermittert: permittert,
        dagerGjensående: gjenståendeDager,
        dagerAnnetFravær: antallDagerFravær,
    };
    return oversikt;
};

//denne regner feil
export const regnUtDatoAGP2 = (dagerBrukt: number, dagensDato: Date) => {
    const dagerIgjen = 210 - dagerBrukt;
    const beregnetAGP2 = new Date(dagensDato);
    beregnetAGP2.setDate(beregnetAGP2.getDate() + dagerIgjen);
    if (dagerIgjen > 0) {
        return beregnetAGP2;
    }
    return ARBEIDSGIVERPERIODE2DATO;
};

export const getAntallOverlappendeDager = (
    intervall1: DatoIntervallDayjs,
    intervall2: DatoIntervallDayjs
) => {
    if (
        !datoIntervallErDefinert(intervall1) ||
        !datoIntervallErDefinert(intervall2)
    ) {
    }
    let antallOverlappendeDager = 0;
    for (
        let dag = intervall2.datoFra;
        dag?.isSameOrBefore(intervall2.datoTil!);
        dag = dag.add(1, 'day')
    ) {
        if (
            dag?.isBetween(intervall1.datoFra!, intervall1.datoTil!, null, '[]')
        ) {
            antallOverlappendeDager++;
        }
    }
    return antallOverlappendeDager;
};

export const summerFraværsdagerIPermitteringsperiodeDayjs = (
    permitteringsperiode: DatoIntervallDayjs,
    fraværsperioder: DatoIntervallDayjs[]
) => {
    let antallFraværsdagerIPeriode = 0;
    fraværsperioder.forEach(
        (periode) =>
            (antallFraværsdagerIPeriode += getAntallOverlappendeDager(
                permitteringsperiode,
                periode
            ))
    );
    return antallFraværsdagerIPeriode;
};

export const finnUtOmDefinnesOverlappendePerioderDayjs = (
    perioder: DatoIntervallDayjs[]
): boolean => {
    let finnesOverLapp = false;
    perioder.forEach((periode) => {
        if (datoIntervallErDefinert(periode)) {
            perioder.forEach((periode2) => {
                if (datoIntervallErDefinert(periode2) && periode !== periode2) {
                    if (getAntallOverlappendeDager(periode, periode2) > 0) {
                        finnesOverLapp = true;
                    }
                }
            });
        }
    });
    return finnesOverLapp;
};

export const kuttAvDatoIntervallFørGittDato = (
    gittDato: Dayjs,
    tidsIntervall: DatoIntervallDayjs
): DatoIntervallDayjs => {
    const { datoFra, datoTil } = tidsIntervall;
    if (!datoFra || !datoTil) return tidsIntervall;
    if (gittDato.isBefore(datoFra)) return tidsIntervall;
    if (gittDato.isAfter(datoTil))
        return { datoFra: undefined, datoTil: undefined };
    return { datoFra: gittDato, datoTil };
};

export const kuttAvDatoIntervallEtterGittDato = (
    gittDato: Dayjs,
    tidsIntervall: DatoIntervallDayjs
): DatoIntervallDayjs => {
    const { datoFra, datoTil } = tidsIntervall;
    if (datoTil?.isAfter(gittDato)) {
        if (datoFra?.isSameOrAfter(gittDato)) {
            return { datoFra: undefined, datoTil: undefined };
        } else {
            return { datoFra, datoTil: gittDato };
        }
    }
    return tidsIntervall;
};

export const kuttAvDatoIntervallInnefor18mnd = (
    datoIntevall: DatoIntervallDayjs,
    startdato: Dayjs,
    sluttDato: Dayjs
): DatoIntervallDayjs => {
    const datoIntervallEtterStartperiode = kuttAvDatoIntervallFørGittDato(
        startdato,
        datoIntevall
    );
    return kuttAvDatoIntervallEtterGittDato(
        sluttDato,
        datoIntervallEtterStartperiode
    );
};

export const finnDato18MndTilbake = (datoDayjs: Dayjs): Dayjs => {
    const dato = datoDayjs.toDate();
    let nyDato = new Date(dato);
    nyDato.setFullYear(dato.getFullYear() - 2);
    nyDato.setMonth(dato.getMonth() + 6);
    nyDato.setDate(dato.getDate() + 1);
    if (nyDato.getDate() < dato.getDate()) {
        const førsteDatoINyMåned = new Date(nyDato);
        førsteDatoINyMåned.setDate(1);
        nyDato = førsteDatoINyMåned;
    }
    return dayjs(nyDato);
};

export const finnGrenserFor18MNDPeriode = (
    dagensDato: Dayjs
): DatoIntervallDayjs => {
    const bakover18mnd = finnDato18MndTilbake(dagensDato);
    const maksGrenseIBakoverITid = bakover18mnd.subtract(56, 'days');
    const maksGrenseFramoverITid = dagensDato.add(112, 'days');

    return {
        datoFra: maksGrenseIBakoverITid,
        datoTil: maksGrenseFramoverITid,
    };
};

export const getDefaultPermitteringsperiode = (
    dagensDato: Dayjs
): DatoIntervallDayjs => ({
    datoFra: finnDato18MndTilbake(dagensDato),
    datoTil: undefined,
});

export const finnDato18MndFram = (datoDayjs: Dayjs) => {
    const dato = datoDayjs.toDate();
    let nyDato = new Date(dato);
    nyDato.setFullYear(dato.getFullYear() + 1);
    nyDato.setMonth(dato.getMonth() + 6);
    nyDato.setDate(dato.getDate() - 1);
    if (nyDato.getDate() + 1 < dato.getDate()) {
        const førsteDatoINyMåned = new Date(nyDato);
        førsteDatoINyMåned.setDate(1);
        nyDato = finn1DagTilbake(førsteDatoINyMåned)!!;
    }
    return dayjs(nyDato);
};

export const finnTidligsteDato = (
    datointervall: DatoIntervallDayjs[]
): Dayjs => {
    let tidligsteDato = datointervall[0].datoFra!;
    datointervall.forEach((datoIntervall) => {
        if (datoIntervall.datoFra) {
            if (!tidligsteDato) {
                tidligsteDato = datoIntervall.datoFra;
            }
            if (tidligsteDato.isAfter(datoIntervall.datoFra)) {
                tidligsteDato = datoIntervall.datoFra;
            }
        }
    });
    return tidligsteDato;
};

export const finnSisteDato = (
    datointervall: DatoIntervallDayjs[]
): Dayjs | undefined => {
    let sisteDato = datointervall[0].datoTil;
    datointervall.forEach((intervall) => {
        if (intervall.datoTil) {
            if (!sisteDato) {
                sisteDato = intervall.datoTil;
            }
            if (sisteDato.isBefore(intervall.datoTil)) {
                sisteDato = intervall.datoTil;
            }
        }
    });
    return sisteDato;
};

export const datoIntervallErDefinert = (
    datoIntervall: DatoIntervall | DatoIntervallDayjs
) => {
    return (
        datoIntervall.datoFra !== undefined &&
        datoIntervall.datoTil !== undefined
    );
};

export const konstruerStatiskTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioderDayjs,
    dagensDato: Dayjs
): DatoMedKategoriDayjs[] => {
    const listeMedTidslinjeObjekter: DatoMedKategoriDayjs[] = [];
    const antallObjektITidslinje = antallDagerGåttDayjs(
        finnGrenserFor18MNDPeriode(dagensDato).datoFra,
        finnGrenserFor18MNDPeriode(dagensDato).datoTil
    );
    const startDato = finnGrenserFor18MNDPeriode(dagensDato).datoFra;
    listeMedTidslinjeObjekter.push(
        finneKategori(startDato!, allePermitteringerOgFravær)
    );
    for (let dag = 1; dag < antallObjektITidslinje; dag++) {
        const nesteDag = listeMedTidslinjeObjekter[dag - 1].dato.add(1, 'day');
        listeMedTidslinjeObjekter.push(
            finneKategori(nesteDag, allePermitteringerOgFravær)
        );
    }
    return listeMedTidslinjeObjekter;
};

const finnesIIntervaller = (dato: Dayjs, perioder: DatoIntervallDayjs[]) => {
    let finnes = false;
    perioder.forEach((periode) => {
        if (
            datoIntervallErDefinert(periode) &&
            dato.isBetween(periode.datoFra!, periode.datoTil!, null, '[]')
        ) {
            finnes = true;
        }
    });
    return finnes;
};

const finneKategori = (
    dato: Dayjs,
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioderDayjs
): DatoMedKategoriDayjs => {
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
            kategori: 2,
            dato: dayjs(dato),
        };
    }
    if (erPermittert) {
        return {
            kategori: 0,
            dato: dayjs(dato),
        };
    }
    return {
        kategori: 1,
        dato: dayjs(dato),
    };
};

export const finn1DagTilbake = (dato?: Date) => {
    if (dato) {
        const enDagTilbake = new Date(dato);
        enDagTilbake.setDate(enDagTilbake.getDate() - 1);
        return enDagTilbake;
    }
    return undefined;
};
