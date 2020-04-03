import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import BEMHelper from '../../../../utils/bem';
import { permitteringClassName } from '../../../Permittering';

const ItilleggBerVi = () => {
    const cls = BEMHelper(permitteringClassName);
    return (
        <div className={cls.element('blockmodifier')}>
            <Normaltekst>
                For at vi skal kunne behandle søknaden om dagpenger må du i tillegg opplyse om dette i varselet:
            </Normaltekst>
            <ul>
                <li>
                    <Normaltekst>Du må opplyse om partene på arbeidsplassen er enige om permitteringen.</Normaltekst>
                </li>
                <li>
                    <Normaltekst>Du må oppgi stillingsprosenten til den som permitteres.</Normaltekst>
                </li>
                <li>
                    <Normaltekst>Du må oppgi når den permitterte ble ansatt i bedriften.</Normaltekst>
                </li>
            </ul>
        </div>
    );
};

export default ItilleggBerVi;
