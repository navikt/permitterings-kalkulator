import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import BEMHelper from '../../../../utils/bem';
import { permitteringClassName } from '../../../Permittering';

const VarselSkalInneholde = () => {
    const cls = BEMHelper(permitteringClassName);
    return (
        <div className={cls.element('blockmodifier')}>
            <Normaltekst>Varselet må innholde disse opplysningene:</Normaltekst>
            <ul>
                <li>
                    <Normaltekst>Fortell hvorfor du permitterer ansatte.</Normaltekst>
                </li>
                <li>
                    <Normaltekst>Datoen når du har varslet om permitteringen.</Normaltekst>
                </li>
                <li>
                    <Normaltekst>Datoen når permitteringen starter og hvor lenge den vil vare.</Normaltekst>
                </li>
                <li>
                    <Normaltekst>Navnet på den som blir permittert.</Normaltekst>
                </li>
                <li>
                    <Normaltekst>Er det snakk om helt eller delvis permittering.</Normaltekst>
                </li>
            </ul>
        </div>
    );
};

export default VarselSkalInneholde;
