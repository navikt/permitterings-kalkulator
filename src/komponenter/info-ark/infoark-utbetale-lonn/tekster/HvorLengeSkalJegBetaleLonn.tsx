import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

const HvorLengeSkalJegBetaleLonn = () => {
    return (
        <>
            <Normaltekst>
                På grunn av koronasituasjonen skal du kun betale lønn i to dager
                etter at du har permittert ansatte. Dette gjaldt fra og med 20.
                mars. Arbeidsgivere som har betalt lønn til ansatte to eller
                flere dager før denne datoen slipper å utbetale mer lønn. Se
                hvordan du beregner perioden i{' '}
                <Lenke href="https://lovdata.no/nav/rundskriv/v1-04-00">
                    rundskrivet om lønnsplikt.
                </Lenke>
            </Normaltekst>
            <Normaltekst className="textair">
                Skyldes permitteringen brann, ulykker eller naturomstendigheter,
                er det ingen lønnspliktperiode. Les mer om frister i
                <Lenke href="https://lovdata.no/dokument/NL/lov/2005-06-17-62/KAPITTEL_17#%C2%A715-3">
                    Arbeidsmiljøloven
                </Lenke>
            </Normaltekst>
        </>
    );
};

export default HvorLengeSkalJegBetaleLonn;
