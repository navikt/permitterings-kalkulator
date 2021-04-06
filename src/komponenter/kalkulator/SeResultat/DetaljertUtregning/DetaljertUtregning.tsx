import React, { FunctionComponent } from 'react';
import UtregningAvEnkeltPeriode from './UtregningAvEnkeltPeriode/UtregningAvEnkeltPeriode';
import dayjs from 'dayjs';
import { DatoIntervall, DatoMedKategori } from '../../typer';
import { getPermitteringsoversikt } from '../../utils/beregningerForAGP2';

interface Props {
    tidslinje: DatoMedKategori[];
    permitteringsperioder: DatoIntervall[];
}

export const DetaljertUtregning: FunctionComponent<Props> = ({
    tidslinje,
    permitteringsperioder,
}) => {
    return (
        <div>
            detaljert utregning
            {permitteringsperioder.map((periode, index) => (
                <UtregningAvEnkeltPeriode
                    permitteringsperiode={periode}
                    permitteringsoversikt={getPermitteringsoversikt(
                        tidslinje,
                        periode
                    )}
                    permitteringsnr={index + 1}
                />
            ))}
        </div>
    );
};
