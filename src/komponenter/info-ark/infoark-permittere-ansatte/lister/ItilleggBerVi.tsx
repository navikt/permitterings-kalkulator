import React from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import BEMHelper from '../../../../utils/bem';
import { permitteringClassName } from '../../../Permittering';
import Lenke from 'nav-frontend-lenker';

const ItilleggBerVi = () => {
    const cls = BEMHelper(permitteringClassName);
    return (
        <div className={cls.element('blockmodifier')}>
            <Normaltekst>I tillegg ber vi deg som arbeidsgiver oppgi følgende i varselet</Normaltekst>
            <ul>
                <li>Om det er enighet mellom partene på arbeidsplassen om permitteringen (JA/NEI)</li>
                <li>Den permitteres stillingsstørrelse</li>
                <li>Når den permitterte ble ansatt i bedriften.</li>
            </ul>
        </div>
    );
};

export default ItilleggBerVi;
