import { DatoIntervall, Permitteringsoversikt } from '../../../typer';
import React, { FunctionComponent } from 'react';
import { formaterDatoIntervall } from '../../../utils/dato-utils';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import './UtregningAvEnkeltPeriode.less';

interface Props {
    permitteringsperiode: DatoIntervall;
    permitteringsoversikt: Permitteringsoversikt;
    permitteringsnr: number;
}

const UtregningAvEnkeltPeriode: FunctionComponent<Props> = ({
    permitteringsperiode,
    permitteringsoversikt,
    permitteringsnr,
}) => {
    const {
        dagerBrukt,
        dagerPermittert,
        dagerAnnetFravær,
    } = permitteringsoversikt;

    return (
        <tr>
            <td>{formaterDatoIntervall(permitteringsperiode)}</td>
            <td>{dagerPermittert}</td>
            <td>{dagerAnnetFravær}</td>
            <td>{dagerBrukt}</td>
        </tr>
    );
};

export default UtregningAvEnkeltPeriode;
