import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';

const KanJegPermitterePunkter = () => {
    return (
        <>
            <Normaltekst>
                Når NAV skal overta ansvaret for sykepenger, må du
            </Normaltekst>
            <ul>
                <li>
                    <Normaltekst>
                        sende en korrigert inntektsmelding til NAV
                    </Normaltekst>
                </li>
                <li>
                    <Normaltekst>
                        be den ansatte ettersende sykepengesøknaden til NAV fra
                        Ditt sykefravær på{' '}
                        <Lenke href="https://www.nav.no">nav.no</Lenke>
                    </Normaltekst>
                </li>
            </ul>
            <Normaltekst>
                Hvis arbeidstakeren allerede er 100% permittert og blir sykmeldt
                etter permitteringsdatoen, trenger du ikke sende
                inntektsopplysninger til NAV.
            </Normaltekst>
        </>
    );
};

export default KanJegPermitterePunkter;
