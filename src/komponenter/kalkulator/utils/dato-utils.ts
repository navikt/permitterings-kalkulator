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

export const getAntallOverlappendeDager = (
    intervall1: DatoIntervall,
    intervall2: DatoIntervall
): number => {
    if (intervall1.erLøpende && intervall2.erLøpende) {
        throw new Error(
            'Kan ikke regne ut overlappende dager mellom løpende intervaller'
        );
    }

    const intervallSomIkkeErLøpende = intervall1.erLøpende
        ? intervall2
        : intervall1;
    const annetIntervall = intervall1.erLøpende ? intervall1 : intervall2;

    let antallOverlappendeDager = 0;
    for (
        let dag = intervallSomIkkeErLøpende.datoFra;
        dag.isSameOrBefore(intervallSomIkkeErLøpende.datoTil!);
        dag = dag.add(1, 'day')
    ) {
        if (finnesIIntervall(dag, annetIntervall)) {
            antallOverlappendeDager++;
        }
    }
    return antallOverlappendeDager;
};

export const tilDatoIntervall = (
    potensieltUdefinertDatointervall: Partial<DatoIntervall>
): DatoIntervall | undefined => {
    const { datoFra, datoTil, erLøpende } = potensieltUdefinertDatointervall;
    if (datoFra !== undefined && datoTil !== undefined) {
        return { datoFra, datoTil };
    }
    if (datoFra !== undefined && erLøpende) {
        return { datoFra, erLøpende };
    }
    return undefined;
};

export const filtrerBortUdefinerteDatoIntervaller = (
    potensieltUdefinerteIntervaller: Partial<DatoIntervall>[]
): DatoIntervall[] => {
    return potensieltUdefinerteIntervaller
        .map((intervall) => tilDatoIntervall(intervall))
        .filter((intervall) => intervall !== undefined) as DatoIntervall[];
};

const fjernUdefinerteDatoIntervaller = (
    potensieltUdefinerteDatointervaller: Partial<DatoIntervall>[]
): DatoIntervall[] => {
    return potensieltUdefinerteDatointervaller
        .map((intervall) => tilDatoIntervall(intervall))
        .filter((intervall) => intervall !== undefined) as DatoIntervall[];
};

export const finnUtOmDefinnesOverlappendePerioder = (
    perioder: Partial<DatoIntervall>[]
): boolean => {
    let finnesOverLapp = false;
    const definertePerioder = fjernUdefinerteDatoIntervaller(perioder);

    definertePerioder.forEach((periode) => {
        definertePerioder.forEach((periode2) => {
            if (periode !== periode2) {
                if (getAntallOverlappendeDager(periode, periode2) > 0) {
                    finnesOverLapp = true;
                }
            }
        });
    });
    return finnesOverLapp;
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
    const definertPeriode = tilDatoIntervall(periode);
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
