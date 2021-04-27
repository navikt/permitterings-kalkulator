import React, { FunctionComponent } from 'react';
import './AttributtVisning.less';
import { Normaltekst } from 'nav-frontend-typografi';

interface Props {
    attributt: string;
    attributtVerdi: any;
}

const AttributtVisning: FunctionComponent<Props> = (props) => {
    return (
        <li
            className="attributt"
            aria-label={`${props.attributt}, ${props.attributtVerdi}`}
        >
            <div className="attributt__navn">
                {' '}
                <Normaltekst>{props.attributt}</Normaltekst>
            </div>
            <div className="attributt__verdi">
                {' '}
                <Normaltekst>{props.attributtVerdi}</Normaltekst>
            </div>
        </li>
    );
};

export default AttributtVisning;
