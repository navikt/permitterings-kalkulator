import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    DatoMedKategori,
    OversiktOverBrukteOgGjenværendeDager,
} from './typer';
import { Dayjs } from 'dayjs';
import { formaterDato } from '../Datovelger/datofunksjoner';

export const antallDagerGått = (fra?: Dayjs, til?: Dayjs) => {
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
    allePErmitteringerOgFraværsperioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs
): OversiktOverBrukteOgGjenværendeDager => {
    const statusAlleDager18mndLsite = konstruerStatiskTidslinje(
        allePErmitteringerOgFraværsperioder,
        dagensDato
    );
    let permittert = 0;
    let antallDagerFravær = 0;
    let gjenståendeDager = 0;
    statusAlleDager18mndLsite.forEach((dag, index) => {
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

export const getAntallOverlappendeDager = (
    intervall1: DatoIntervall,
    intervall2: DatoIntervall
) => {
    if (
        !datoIntervallErDefinert(intervall1) ||
        !datoIntervallErDefinert(intervall2)
    ) {
        return 0;
    }
    let antallOverlappendeDager = 0;
    for (
        let dag = intervall2.datoFra;
        dag?.isSameOrBefore(intervall2.datoTil!);
        dag = dag.add(1, 'day')
    ) {
        if (
            dag?.isBetween(
                intervall1.datoFra!,
                intervall1.datoTil!,
                'day',
                '[]'
            )
        ) {
            antallOverlappendeDager++;
        }
    }
    return antallOverlappendeDager;
};

export const summerFraværsdagerIPermitteringsperiode = (
    permitteringsperiode: DatoIntervall,
    fraværsperioder: DatoIntervall[]
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

export const finnUtOmDefinnesOverlappendePerioder = (
    perioder: DatoIntervall[]
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
    tidsIntervall: DatoIntervall
): DatoIntervall => {
    const { datoFra, datoTil } = tidsIntervall;
    if (!datoFra || !datoTil) return tidsIntervall;
    if (gittDato.isBefore(datoFra)) return tidsIntervall;
    if (gittDato.isAfter(datoTil))
        return { datoFra: undefined, datoTil: undefined };
    return { datoFra: gittDato, datoTil };
};

export const kuttAvDatoIntervallEtterGittDato = (
    gittDato: Dayjs,
    tidsIntervall: DatoIntervall
): DatoIntervall => {
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
    datoIntevall: DatoIntervall,
    startdato: Dayjs,
    sluttDato: Dayjs
): DatoIntervall => {
    const datoIntervallEtterStartperiode = kuttAvDatoIntervallFørGittDato(
        startdato,
        datoIntevall
    );
    return kuttAvDatoIntervallEtterGittDato(
        sluttDato,
        datoIntervallEtterStartperiode
    );
};

export const finnDato18MndTilbake = (dato: Dayjs): Dayjs =>
    dato.subtract(18, 'months').add(1, 'day');

export const finnDato18MndFram = (dato: Dayjs): Dayjs =>
    dato.subtract(1, 'day').add(18, 'months');

export const finnGrenserFor18MNDPeriode = (
    dagensDato: Dayjs
): DatoIntervall => {
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
): DatoIntervall => ({
    datoFra: finnDato18MndTilbake(dagensDato),
    datoTil: undefined,
});

export const finnTidligsteDato = (datointervall: DatoIntervall[]): Dayjs => {
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
    datointervall: DatoIntervall[]
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

export const datoIntervallErDefinert = (datoIntervall: DatoIntervall) => {
    return (
        datoIntervall.datoFra !== undefined &&
        datoIntervall.datoTil !== undefined
    );
};

export const konstruerStatiskTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs
): DatoMedKategori[] => {
    const listeMedTidslinjeObjekter: DatoMedKategori[] = [];
    const antallObjektITidslinje = antallDagerGått(
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

const finnesIIntervaller = (dato: Dayjs, perioder: DatoIntervall[]) => {
    let finnes = false;
    perioder.forEach((periode) => {
        if (
            datoIntervallErDefinert(periode) &&
            dato.isBetween(periode.datoFra!, periode.datoTil!, 'day', '[]')
        ) {
            finnes = true;
        }
    });
    return finnes;
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
            kategori: 2,
            dato: dato,
        };
    }
    if (erPermittert) {
        return {
            kategori: 0,
            dato: dato,
        };
    }
    return {
        kategori: 1,
        dato: dato,
    };
};
