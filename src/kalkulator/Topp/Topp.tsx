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
                <Element>Denne informasjonen trenger du</Element>
                <ul className="topp__liste">
                    <Normaltekst tag="li">
                        Periodene den ansatte har vært permittert
                    </Normaltekst>
                    <Normaltekst tag="li">
                        Eventuelle fravær under permitteringen
                    </Normaltekst>
                </ul>
                <Element>Du skal fylle inn</Element>
                <Normaltekst tag="ul" className="topp__liste">
                    <li>
                        Uavhengig av permitteringsprosent og stillingsprosent
                    </li>
                    <li>Fra første permitteringsdag etter lønnsplikt</li>
                </Normaltekst>
            </div>
        </div>
    );
};

export default Topp;
