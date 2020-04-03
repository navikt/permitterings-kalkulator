import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import BEMHelper from '../../../../utils/bem';
import { permitteringClassName } from '../../../Permittering';
import Lenke from 'nav-frontend-lenker';

const GiAnsatteBeskjed = () => {
    const cls = BEMHelper(permitteringClassName);
    return (
        <div className={cls.element('blockmodifier')}>
            <Undertittel>3. Du bør oppfordre de ansatte om å gjøre dette:</Undertittel>
            <ul>
                <li>
                    <Lenke href="https://arbeidssokerregistrering.nav.no/start">
                        Registrer seg som arbeidssøker hos NAV
                    </Lenke>
                </li>
                <li>
                    <Lenke href="https://www.nav.no/arbeid/dagpenger/permittert">Søke om dagpenger</Lenke> Dette bør de
                    helst gjøre digitalt.
                </li>
            </ul>
        </div>
    );
};

export default GiAnsatteBeskjed;
