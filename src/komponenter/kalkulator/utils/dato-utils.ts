import { Dayjs } from 'dayjs';
import { DatoIntervall } from '../typer';

export const formaterDato = (dato: Dayjs): string => dato.format('DD.MM.YYYY');

export const lengdePåIntervall = (datointervall: DatoIntervall): number => {
    return antallDagerGått(datointervall.datoFra, datointervall.datoTil);
};

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
        dag?.isSameOrBefore(intervallSomIkkeErLøpende.datoTil!);
        dag = dag!.add(1, 'day')
    ) {
        if (finnesIIntervall(dag!, annetIntervall)) {
            antallOverlappendeDager++;
        }
    }
    return antallOverlappendeDager;
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
    const { datoFra, datoTil, erLøpende } = datoIntervall;
    return (
        (datoFra !== undefined && datoTil !== undefined) ||
        (datoFra !== undefined && erLøpende)
    );
};

export const finnesIIntervaller = (dato: Dayjs, perioder: DatoIntervall[]) => {
    return !!perioder.find((periode) => finnesIIntervall(dato, periode));
};

const finnesIIntervall = (dato: Dayjs, periode: DatoIntervall): boolean => {
    if (!periode.datoFra) {
        return false;
    } else if (periode.erLøpende) {
        return dato.isSameOrAfter(periode.datoFra, 'date');
    } else if (!periode.datoTil) {
        return false;
    } else {
        return dato.isBetween(periode.datoFra, periode.datoTil, 'date', '[]');
    }
};
