import React, { FunctionComponent } from 'react';
import UtregningAvEnkeltPeriode from './UtregningAvEnkeltPeriode/UtregningAvEnkeltPeriode';
import { DatoIntervall, DatoMedKategori } from '../../typer';
import { getPermitteringsoversikt } from '../../utils/beregningerForAGP2';
import {
    formaterDatoIntervall,
    getOverlappendePeriode,
} from '../../utils/dato-utils';

interface Props {
    tidslinje: DatoMedKategori[];
    permitteringsperioder: DatoIntervall[];
    aktuell18mndsperiode: DatoIntervall;
}

export const DetaljertUtregning: FunctionComponent<Props> = ({
    tidslinje,
    permitteringsperioder,
    aktuell18mndsperiode,
}) => {
    const permitteringsperioderInnenfor18mndsperiode: DatoIntervall[] = permitteringsperioder
        .map((periode) => getOverlappendePeriode(periode, aktuell18mndsperiode))
        .filter((periode) => periode !== undefined) as DatoIntervall[];

    return (
        <div>
            detaljert utregning for 18-månedsperioden{' '}
            {formaterDatoIntervall(aktuell18mndsperiode)}
            {permitteringsperioderInnenfor18mndsperiode.map(
                (periode, index) => (
                    <UtregningAvEnkeltPeriode
                        permitteringsperiode={periode}
                        permitteringsoversikt={getPermitteringsoversikt(
                            tidslinje,
                            periode
                        )}
                        permitteringsnr={index + 1}
                    />
                )
            )}
        </div>
    );
};
