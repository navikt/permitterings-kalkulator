import { DatoIntervall } from '../typer';
import { getAntallOverlappendeDager } from './dato-utils';

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
