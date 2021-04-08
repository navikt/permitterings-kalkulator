import React, { FunctionComponent } from 'react';
import './AttributtVisning.less';

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
            <div className="attributt__navn"> {props.attributt}</div>
            <div className="attributt__verdi"> {props.attributtVerdi}</div>
        </li>
    );
};

export default AttributtVisning;
