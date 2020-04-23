import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

const DuMaIkkeForskuttereLonn = () => {
    return (
        <>
            <Normaltekst>
                Du skal ikke forskuttere lønn til ansatte for dag 3-20 for
                permitteringer som starter 20. april eller senere. NAV
                refunderer ikke lønn for permitteringer som starter etter denne
                datoen.
            </Normaltekst>
            <Normaltekst className="textair">
                Dersom du permitterer ansatte etter 20. april eller senere må
                den som er permittert selv søke om lønnskompensasjon fra NAV.
            </Normaltekst>
        </>
    );
};

export default DuMaIkkeForskuttereLonn;
