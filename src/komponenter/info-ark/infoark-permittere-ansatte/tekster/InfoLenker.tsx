import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

const InfoLenker = () => {
    return (
        <>
            <Normaltekst>
                Du kan lese mer om permittering og frister i{' '}
                <Lenke href="https://www.lo.no/hovedavtalen/#3991">
                    Hovedavtalen LO NHO
                </Lenke>{' '}
            </Normaltekst>
            <Normaltekst>
                og{' '}
                <Lenke href="https://lovdata.no/nav/lov/2005-06-17-62/kap15">
                    arbeidsmiljøloven
                </Lenke>
                {''}.
            </Normaltekst>
        </>
    );
};

export default InfoLenker;
