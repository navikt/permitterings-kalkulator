import React, { FunctionComponent } from 'react';
import './Topp.less';
import { Normaltekst } from 'nav-frontend-typografi';

const Topp: FunctionComponent = () => {
    return (
        <div className={'topp'}>
            <div className={'topp__generell-info'}>
                <Normaltekst>
                    <strong>
                        Du har lønnsplikt når den ansatte har vært permittert i
                        30 uker
                    </strong>
                </Normaltekst>
                <Normaltekst>Kalkulatoren regner ut:</Normaltekst>
                <ul className="topp__liste">
                    <Normaltekst tag="li">
                        Hvor lenge den ansatte har vært permittert
                    </Normaltekst>
                    <Normaltekst tag="li">Når du skal betale lønn</Normaltekst>
                </ul>
                <Normaltekst>
                    <strong>Denne informasjonen trenger du</strong>
                </Normaltekst>
                <ul className="topp__liste">
                    <Normaltekst tag="li">
                        Periodene den ansatte har vært permittert
                    </Normaltekst>
                    <Normaltekst tag="li">
                        Eventuelle fravær under permitteringen
                    </Normaltekst>
                </ul>
            </div>
        </div>
    );
};

export default Topp;
