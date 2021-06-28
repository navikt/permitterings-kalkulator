import React, { FunctionComponent } from 'react';
import './Topp.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';

const Topp: FunctionComponent = () => {
    return (
        <div className={'topp'}>
            <div className={'topp__generell-info'}>
                <Element className="topp__introtekst">
                    Det er begrenset hvor lenge du kan permittere ansatte uten
                    lønn. Denne kalkulatoren er et verktøy for å forstå
                    regelverket rundt permittering og hva som gjelder for dine
                    ansatte.
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
