import React from 'react';
import Lenke from 'nav-frontend-lenker';
import Ingress from 'nav-frontend-typografi/lib/ingress';
import { HoyreChevron } from 'nav-frontend-chevron';
import { skrivTilMalingMenyValg } from '../../utils/amplitudeUtils';

interface Props {
    hopplenke: string;
    lenketekst: string;
    className: string;
    lenkeAction: () => void;
}

const Infolenke = (props: Props) => {
    return (
        <div className={props.className}>
            <Lenke
                href={props.hopplenke}
                onClick={() => {
                    skrivTilMalingMenyValg(props.hopplenke);
                    props.lenkeAction();
                }}
            >
                <HoyreChevron />
                <Ingress>{props.lenketekst}</Ingress>
            </Lenke>
        </div>
    );
};

export default Infolenke;
