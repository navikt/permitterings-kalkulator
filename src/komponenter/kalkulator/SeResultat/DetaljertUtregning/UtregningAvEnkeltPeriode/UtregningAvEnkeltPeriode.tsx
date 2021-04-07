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
        <div className="utregning-av-enkelt-periode">
            <Element>
                {permitteringsnr}. permitteringsperiode <br />(
                {formaterDatoIntervall(permitteringsperiode)})
            </Element>
            <Normaltekst>
                Antall dager permittert: {dagerPermittert}
            </Normaltekst>
            {dagerAnnetFravær > 0 && (
                <Normaltekst>
                    Antall dager fravær: {dagerAnnetFravær}
                </Normaltekst>
            )}
            <Normaltekst>Totalt: {dagerBrukt}</Normaltekst>
        </div>
    );
};

export default UtregningAvEnkeltPeriode;
