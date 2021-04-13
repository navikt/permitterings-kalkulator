import { DatoIntervall, Permitteringsoversikt } from '../../../typer';
import React, { FunctionComponent } from 'react';
import { formaterDatoIntervall } from '../../../utils/dato-utils';
import './UtregningAvEnkeltPeriodeITabell.less';

interface Props {
    permitteringsperiode: DatoIntervall;
    permitteringsoversikt: Permitteringsoversikt;
}

const UtregningAvEnkeltPeriodeITabell: FunctionComponent<Props> = ({
    permitteringsperiode,
    permitteringsoversikt,
}) => {
    const {
        dagerBrukt,
        dagerPermittert,
        dagerAnnetFravær,
    } = permitteringsoversikt;

    return (
        <tr>
            <td>{formaterDatoIntervall(permitteringsperiode)}</td>
            <td>{dagerPermittert + ' dager'}</td>
            <td>{dagerAnnetFravær + ' dager'}</td>
            <td>{dagerBrukt + ' dager'}</td>
        </tr>
    );
};

export default UtregningAvEnkeltPeriodeITabell;
