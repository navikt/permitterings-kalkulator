import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

const DuMaIkkeForskuttereLonn = () => {
    return (
        <>
            <Normaltekst>
                Du skal ikke forskuttere lønn til ansatte for 3. til 20. dag.
                For alle permitteringer som starter fra 20. april eller senere.
                Du kan ikke kreve å få tilbake utbetalt lønn for permitteringer
                som starter etter denne datoen.
            </Normaltekst>
            <Normaltekst className="textair">
                Dersom du permitterer ansatte etter 20. april eller senere må
                den som er permittert selv søke om lønnskompensasjon fra NAV.
            </Normaltekst>
        </>
    );
};

export default DuMaIkkeForskuttereLonn;
