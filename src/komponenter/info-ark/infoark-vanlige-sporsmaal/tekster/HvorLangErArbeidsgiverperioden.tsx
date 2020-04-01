import React from 'react';
import Tekstseksjon from '../../../infoseksjon/Tekstseksjon';
import Lenke from 'nav-frontend-lenker';

const HvorLangErArbeidsgiverperioden = () => {
    return (
        <>
            <Tekstseksjon>
                Arbeidsgiverperioden (dagene da arbeidsgiver betaler full lønn til den permitterte) reduseres fra 15 til
                2 dager. Dette gjelder fra 20. mars. Det betyr at arbeidsgivere som allerede har betalt to eller flere
                dager med lønnsplikt før 20. mars, slipper flere dager med lønnsplikt. Staten tar over betalingsansvaret
                fra og med 20. mars. Les mer om{' '}
                <Lenke href="https://www.regjeringen.no/no/aktuelt/slik-blir-endringene-i-permitterings--og-dagpengeregelverket/id2694346/">
                    endringene i permitterings- og dagpengeregelverket
                </Lenke>
                .
            </Tekstseksjon>
            <Tekstseksjon>
                Skyldes permitteringen brann, ulykker eller naturomstendigheter, gjelder ingen arbeidsgiverperiode (jf.
                <Lenke href="https://lovdata.no/nav/lov/1988-05-06-22/%C2%A73?q=permitteringsl%C3%B8nnsloven%20%C2%A7%203">
                    permitteringslønnsloven § 3 andre ledd
                </Lenke>
                ). Koronaviruset defineres ikke som «brann, ulykker eller naturomstendigheter», og det er derfor
                arbeidsgiverperiode.
            </Tekstseksjon>
        </>
    );
};

export default HvorLangErArbeidsgiverperioden;
