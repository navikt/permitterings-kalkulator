import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import BEMHelper from '../../../../utils/bem';
import { permitteringClassName } from '../../../Permittering';

const VarselSkalInneholde = () => {
    const cls = BEMHelper(permitteringClassName);
    return (
        <div className={cls.element('blockmodifier')}>
            <Normaltekst>Varselet skal inneholde:</Normaltekst>
            <ul>
                <li>
                    <Normaltekst>Informasjon om permitteringens årsak</Normaltekst>
                </li>
                <li>
                    <Normaltekst>Varslingdato</Normaltekst>
                </li>
                <li>
                    <Normaltekst>Dato for iverksettelse og permitteringens lengde</Normaltekst>
                </li>
                <li>
                    <Normaltekst>Hvem som blir permittert</Normaltekst>
                </li>
                <li>
                    <Normaltekst>Hel eller delvis permittering</Normaltekst>
                </li>
            </ul>
        </div>
    );
};

export default VarselSkalInneholde;
