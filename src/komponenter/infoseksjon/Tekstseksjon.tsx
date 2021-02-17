import React, { FunctionComponent } from 'react';
import BEMHelper from '../../utils/bem';
import { permitteringClassName } from '../Permittering';
import { Undertittel } from 'nav-frontend-typografi';

interface TekstseksjonType {
    tittel?: string;
    id?: string;
    disableModifier?: boolean;
}

const Tekstseksjon: FunctionComponent<TekstseksjonType> = (props) => {
    const className = BEMHelper(permitteringClassName);
    return (
        <>
            <div
                className={className.element(
                    'blockmodifier',
                    props.disableModifier ? 'none' : ''
                )}
            >
                {props.tittel ? (
                    <Undertittel
                        className={className.element('underOverskirft')}
                        id={props.id}
                        role="heading"
                        aria-level={2}
                        aria-labelledby={props.id}
                    >
                        {props.tittel}
                    </Undertittel>
                ) : null}
                <>{props.children}</>
            </div>
        </>
    );
};

export default Tekstseksjon;
