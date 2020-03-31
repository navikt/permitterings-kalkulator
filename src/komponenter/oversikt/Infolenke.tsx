import React from 'react';
import Lenke from 'nav-frontend-lenker';
import BEMHelper from '../../utils/bem';
import Ingress from 'nav-frontend-typografi/lib/ingress';
import { HoyreChevron } from 'nav-frontend-chevron';

interface Props {
    hopplenke: string;
    lenketekst: string;
    className: string;
}

// #0067C5

const Infolenke = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('info-lenke')}>
            <Lenke href={props.hopplenke}>
                <HoyreChevron />
                <Ingress>{props.lenketekst}</Ingress>
            </Lenke>
        </div>
    );
};

export default Infolenke;
