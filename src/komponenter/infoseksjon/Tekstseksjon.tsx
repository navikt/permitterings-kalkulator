import React, { FunctionComponent } from 'react';
import BEMHelper from '../../utils/bem';
import { permitteringClassName } from '../Permittering';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

interface Tekstseksjon {
    tittel?: string;
    id?: string;
}

const Tekstseksjon: FunctionComponent<Tekstseksjon> = (props) => {
    const className = BEMHelper(permitteringClassName);
    return (
        <>
            <div className={className.element('blockmodifier')}>
                {props.tittel ? (
                    <Undertittel className={className.element('underOverskirft')} id={props.id}>
                        {props.tittel}
                    </Undertittel>
                ) : null}
                <Normaltekst>{props.children}</Normaltekst>
            </div>
        </>
    );
};

export default Tekstseksjon;
