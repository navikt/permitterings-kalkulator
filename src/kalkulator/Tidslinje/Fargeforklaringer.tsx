import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

export const Fargeforklaringer = (finnesSlettetPermittering: boolean) => {
    return (
        <div aria-hidden className={'kalkulator__tidslinje-farge-forklaring'}>
            <div className={'kalkulator__tidslinje-farge-forklaring-container'}>
                <Normaltekst>permittert</Normaltekst>
                <div className={'kalkulator__tidslinje-farge permittert'} />
            </div>
            <div className={'kalkulator__tidslinje-farge-forklaring-container'}>
                <Normaltekst>annet fravær</Normaltekst>
                <div className={'kalkulator__tidslinje-farge annet-fravær'} />
            </div>
            {finnesSlettetPermittering && (
                <div
                    className={
                        'kalkulator__tidslinje-farge-forklaring-container'
                    }
                >
                    <Normaltekst>slettet</Normaltekst>
                    <div
                        className={
                            'kalkulator__tidslinje-farge slettet-permittering'
                        }
                    />
                </div>
            )}
        </div>
    );
};
