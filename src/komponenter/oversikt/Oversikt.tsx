import React from 'react';
import BEMHelper from '../../utils/bem';
import Infolenke from './Infolenke';
import { Innholdstittel } from 'nav-frontend-typografi';

interface Props {
    className: string;
}

interface PermitteringsLenke {
    hopplenke: string;
    lenketekst: string;
}

const lenker: PermitteringsLenke[] = [
    {
        hopplenke: '#',
        lenketekst: 'Hvordan permittere ansatte?',
    },
    {
        hopplenke: '#',
        lenketekst: 'I permitteringsperioden',
    },
    {
        hopplenke: '#',
        lenketekst: 'Vanlige spørsmål',
    },
];

const Oversikt = (props: Props) => {
    const cls = BEMHelper(props.className);

    return (
        <div className={cls.element('oversikt')}>
            <Innholdstittel className={cls.element('oversikt-tittel')}>Oversikt:</Innholdstittel>
            {lenker.map((lenke) => {
                return (
                    <Infolenke
                        hopplenke={lenke.hopplenke}
                        lenketekst={lenke.lenketekst}
                        className={props.className}
                        key={lenke.lenketekst}
                    />
                );
            })}
        </div>
    );
};

export default Oversikt;
