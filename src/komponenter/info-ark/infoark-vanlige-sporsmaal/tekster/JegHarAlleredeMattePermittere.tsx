import React from 'react';
import Lenke from 'nav-frontend-lenker';

const JegHarAlleredeMattePermittere = () => {
    return (
        <>
            Hvis du har utbetalt lønn utover de 2 dagene med arbeidsgiverperiode
            før 20. mars, etter tidligere regler, vil ikke disse refunderes.
            Lønn du har utbetalt utover de 2 dagene etter 20.mars, kan du få
            refundert av NAV. Du får ikke refusjon for permitteringer som blir
            iverksatt 20. april eller senere. NAV jobber med løsning for å søke
            om refusjon. Les mer om{' '}
            <Lenke href="https://lovdata.no/dokument/SF/forskrift/2020-04-08-757">
                refusjon av lønn.
            </Lenke>
        </>
    );
};

export default JegHarAlleredeMattePermittere;
