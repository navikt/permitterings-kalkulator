import React from 'react';
import Lenke from 'nav-frontend-lenker';
import BEMHelper from '../../utils/bem';
import Ingress from 'nav-frontend-typografi/lib/ingress';

interface Props {
    hopplenke: string;
    lenketekst: string;
    className: string;
}

const Infolenke = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('info-lenke')}>
            <Lenke href={props.hopplenke}>
                <Ingress>{props.lenketekst}</Ingress>
            </Lenke>
        </div>
    );
};

export default Infolenke;
