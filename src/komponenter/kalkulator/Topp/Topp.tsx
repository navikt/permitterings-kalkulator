import React, { FunctionComponent } from 'react';
import './Topp.less';
import { Normaltekst, Element } from 'nav-frontend-typografi';

const Topp: FunctionComponent = () => {
    return (
        <div className={'topp'}>
            <div className={'topp__generell-info'}>
                <Element className="topp__introtekst">
                    Du har lønnsplikt når den ansatte har vært permittert i 30
                    uker. Kalkulatoren regner ut når du skal betale lønn.
                </Element>
                <Element>Denne informasjonen trenger du</Element>
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
