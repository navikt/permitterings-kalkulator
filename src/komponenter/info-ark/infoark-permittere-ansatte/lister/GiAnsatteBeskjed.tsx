import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import BEMHelper from '../../../../utils/bem';
import { permitteringClassName } from '../../../Permittering';
import Lenke from 'nav-frontend-lenker';

const GiAnsatteBeskjed = () => {
    const cls = BEMHelper(permitteringClassName);
    return (
        <div className={cls.element('blockmodifier')}>
            <Undertittel>3. Gi ansatte beskjed om å:</Undertittel>
            <ul>
                <li>
                    <Lenke href="https://arbeidssokerregistrering.nav.no/start">
                        Registrer seg som arbeidssøker hos NAV
                    </Lenke>
                </li>
                <li>
                    <Lenke href="https://www.nav.no/arbeid/dagpenger/permittert">Søke om dagpenger</Lenke> (helst
                    digitalt)
                </li>
                <li>Sende inn permitteringsvarselet til NAV sammen med søknad om dagpenger</li>
            </ul>
        </div>
    );
};

export default GiAnsatteBeskjed;
