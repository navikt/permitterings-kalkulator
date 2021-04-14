import { Dayjs } from 'dayjs';
import { DatoIntervall } from '../typer';

export const formaterDato = (dato: Dayjs): string => dato.format('DD.MM.YYYY');

export const formaterDatoIntervall = (intervall: DatoIntervall) => {
    if (intervall.erLøpende) {
        return 'fra ' + formaterDato(intervall.datoFra);
    } else {
        return (
            formaterDato(intervall.datoFra) +
            '–' +
            formaterDato(intervall.datoTil)
        );
    }
};

export const lengdePåIntervall = (datointervall: DatoIntervall): number => {
    return antallDagerGått(datointervall.datoFra, datointervall.datoTil);
};

export const antallDagerGått = (fra?: Dayjs, til?: Dayjs): number => {
    if (fra && til) {
        return til.diff(fra, 'days') + 1;
    } else {
        return 0;
    }
};

export const antallUkerRundetOpp = (antallDager: number): number => {
    return Math.ceil(antallDager / 7);
};

export const getOverlappendePeriode = (
    intervall1: DatoIntervall,
    intervall2: DatoIntervall
): DatoIntervall | undefined => {
    const senesteFraDato: Dayjs = getSenesteDato([
        intervall1.datoFra,
        intervall2.datoFra,
    ])!;
    const tidligsteTilDato: Dayjs | undefined = getTidligsteDato([
        intervall1.datoTil,
        intervall2.datoTil,
    ]);
    if (tidligsteTilDato) {
        if (tidligsteTilDato.isSameOrAfter(senesteFraDato, 'date')) {
            return {
                datoFra: senesteFraDato,
                datoTil: tidligsteTilDato,
            };
        } else {
            return undefined;
        }
    }
    return {
        datoFra: senesteFraDato,
        erLøpende: true,
    };
};

export const getAntallOverlappendeDager = (
    intervall1: DatoIntervall,
    intervall2: DatoIntervall
): number => {
    const overlappendePeriode = getOverlappendePeriode(intervall1, intervall2);
    if (!overlappendePeriode) {
        return 0;
    }
    if (overlappendePeriode.erLøpende) {
        throw new Error(
            'Kan ikke regne ut overlappende dager mellom løpende intervaller'
        );
    }
    return lengdePåIntervall(overlappendePeriode);
};

export const tilGyldigDatoIntervall = (
    potensieltUdefinertDatointervall: Partial<DatoIntervall>
): DatoIntervall | undefined => {
    if (!datoIntervallErGyldig(potensieltUdefinertDatointervall)) {
        return undefined;
    }
    const { datoFra, datoTil, erLøpende } = potensieltUdefinertDatointervall;
    if (datoFra !== undefined && datoTil !== undefined) {
        return { datoFra, datoTil };
    }
    if (datoFra !== undefined && erLøpende) {
        return { datoFra, erLøpende };
    }
    return undefined;
};

export const til18mndsperiode = (
    sisteDatoIPerioden: Dayjs
): DatoIntervall & { erLøpende: false } => ({
    datoFra: finnDato18MndTilbake(sisteDatoIPerioden),
    datoTil: sisteDatoIPerioden,
    erLøpende: false,
});

export const filtrerBortUdefinerteDatoIntervaller = (
    potensieltUdefinerteIntervaller: Partial<DatoIntervall>[]
): DatoIntervall[] => {
    return potensieltUdefinerteIntervaller
        .map((intervall) => tilGyldigDatoIntervall(intervall))
        .filter((intervall) => intervall !== undefined) as DatoIntervall[];
};

export const datoIntervallErGyldig = (
    datoIntervall: Partial<DatoIntervall>
) => {
    if (datoIntervall.erLøpende) {
        return true;
    }
    if (datoIntervall.datoTil && datoIntervall.datoFra) {
        return datoIntervall.datoFra.isSameOrBefore(datoIntervall.datoTil);
    }
};

export const datoIntervallOverlapperMedPerioder = (
    perioder: Partial<DatoIntervall>[],
    fraværsintervall: Partial<DatoIntervall>
): boolean => {
    let finnesOverLapp = false;
    const definertePerioder = filtrerBortUdefinerteDatoIntervaller(perioder);

    const definertFraværsintervall = tilGyldigDatoIntervall(fraværsintervall);
    if (!definertFraværsintervall) {
        return false;
    }
    definertePerioder.forEach((periode) => {
        if (getAntallOverlappendeDager(periode, definertFraværsintervall) > 0) {
            finnesOverLapp = true;
        }
    });
    return finnesOverLapp;
};

export const perioderOverlapper = (perioder: Partial<DatoIntervall>[]) => {
    const definertePerioder = filtrerBortUdefinerteDatoIntervaller(perioder);

    const periodeSomOverlapperMedAndre = definertePerioder.find(
        (periode, index) => {
            const andrePerioder = [...definertePerioder];
            andrePerioder.splice(index, 1);
            return datoIntervallOverlapperMedPerioder(andrePerioder, periode);
        }
    );
    return !!periodeSomOverlapperMedAndre;
};

export const finnDato18MndTilbake = (dato: Dayjs): Dayjs =>
    dato.subtract(18, 'months').add(1, 'day');

export const finnDato18MndFram = (dato: Dayjs): Dayjs =>
    dato.subtract(1, 'day').add(18, 'months');

export const finnTidligsteFraDato = (
    datointervaller: Partial<DatoIntervall>[]
): Dayjs | undefined => {
    return getTidligsteDato(
        datointervaller.map((intervall) => intervall.datoFra)
    );
};

export const finnSisteTilDato = (
    datointervaller: Partial<DatoIntervall>[]
): Dayjs | undefined => {
    return getSenesteDato(
        datointervaller.map((intervall) => intervall.datoTil)
    );
};

export const getTidligsteDato = (
    datoer: (Dayjs | undefined)[]
): Dayjs | undefined => {
    const sorterteDatoer = sorterDatoerTidligstFørst(datoer);
    return sorterteDatoer.length > 0 ? sorterteDatoer[0] : undefined;
};

export const getSenesteDato = (
    datoer: (Dayjs | undefined)[]
): Dayjs | undefined => {
    const sorterteDatoer = sorterDatoerTidligstFørst(datoer);
    return sorterteDatoer.length > 0
        ? sorterteDatoer[sorterteDatoer.length - 1]
        : undefined;
};

export const getSenesteDatoAvTo = (dato1: Dayjs, dato2: Dayjs): Dayjs => {
    return dato1.isAfter(dato2) ? dato1 : dato2;
};

const sorterDatoerTidligstFørst = (datoer: (Dayjs | undefined)[]): Dayjs[] => {
    const sorterteDatoer = [...datoer]
        .filter((dato) => dato !== undefined)
        .sort((dato1, dato2) => dato1!.diff(dato2!));
    return sorterteDatoer as Dayjs[];
};

export const finnesIIntervaller = (
    dato: Dayjs,
    perioder: Partial<DatoIntervall>[]
) => {
    return !!perioder.find((periode) => finnesIIntervall(dato, periode));
};

export const finnesIIntervall = (
    dato: Dayjs,
    periode: Partial<DatoIntervall>
): boolean => {
    const definertPeriode = tilGyldigDatoIntervall(periode);
    if (!definertPeriode) {
        return false;
    }
    if (definertPeriode.erLøpende) {
        return dato.isSameOrAfter(definertPeriode.datoFra, 'date');
    } else {
        return dato.isBetween(
            definertPeriode.datoFra,
            definertPeriode.datoTil,
            'date',
            '[]'
        );
    }
};

enum Ukedag {
    Mandag = 1,
    Tirsdag = 2,
    Onsdag = 3,
    Torsdag = 4,
    Fredag = 5,
    Lørdag = 6,
    Søndag = 7,
}

export const erHelg = (dato: Dayjs): boolean => {
    const isoWeekday = dato.isoWeekday();
    return isoWeekday === Ukedag.Lørdag || isoWeekday === Ukedag.Søndag;
};

export const getFørsteHverdag = (dato: Dayjs): Dayjs => {
    let dag = dato;
    while (erHelg(dag)) {
        dag = dag.add(1, 'day');
    }
    return dag;
};

const getNesteHverdag = (dato: Dayjs): Dayjs => {
    return getFørsteHverdag(dato.add(1, 'day'));
};

const leggTilHverdager = (dato: Dayjs, antall: number): Dayjs => {
    let dag = getFørsteHverdag(dato);
    for (let i = 0; i < antall; i++) {
        dag = getNesteHverdag(dag);
    }
    return dag;
};

export const get5FørsteHverdager = (dato: Dayjs): Dayjs[] => {
    return [0, 1, 2, 3, 4].map((antallDager) =>
        leggTilHverdager(dato, antallDager)
    );
};
