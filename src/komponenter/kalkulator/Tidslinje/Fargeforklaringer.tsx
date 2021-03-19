import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

export const Fargeforklaringer = () => {
    return (
        <div aria-hidden className={'kalkulator__tidslinje-farge-forklaring'}>
            <div className={'kalkulator__tidslinje-farge-forklaring-container'}>
                <Normaltekst>Permittert</Normaltekst>
                <div className={'kalkulator__tidslinje-farge permittert'} />
            </div>
            <div className={'kalkulator__tidslinje-farge-forklaring-container'}>
                <Normaltekst>Annet fravær</Normaltekst>
                <div className={'kalkulator__tidslinje-farge annet-fravær'} />
            </div>
        </div>
    );
};
