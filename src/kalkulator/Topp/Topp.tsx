import React, { FunctionComponent } from 'react';
import './Topp.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';

const Topp: FunctionComponent = () => {
    return (
        <div className={'topp'}>
            <div className={'topp__generell-info'}>
                <Element className="topp__introtekst">
                    Denne kalkulatoren er et verktøy som hjelper deg å beregne
                    når lønnsplikten gjeninntrer. Merk at det er andre regler
                    som styrer de{' '}
                    <a
                        href="https://www.nav.no/arbeid/permittert#hvor-lenge-kan-du-fa-dagpenger"
                        className="lenke"
                    >
                        ansattes rettigheter til dagpenger.
                    </a>
                </Element>
                <Element>
                    For å bruke kalkulatoren må du ha oversikt over
                </Element>
                <ul className="topp__liste">
                    <Normaltekst tag="li">
                        hvilke dager du hadde lønnsplikt under permitteringen
                    </Normaltekst>
                    <Normaltekst tag="li">
                        periodene den ansatte har vært permittert
                    </Normaltekst>
                    <Normaltekst tag="li">
                        eventuelle fravær under permitteringen
                    </Normaltekst>
                </ul>
            </div>
        </div>
    );
};

export default Topp;
