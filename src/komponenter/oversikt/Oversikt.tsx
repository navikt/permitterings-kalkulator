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
        hopplenke: '#hvordanPermittere',
        lenketekst: 'Hvordan permittere ansatte?',
    },
    {
        hopplenke: '#permitteringsperioden',
        lenketekst: 'I permitteringsperioden',
    },
    {
        hopplenke: '#vanligSpr',
        lenketekst: 'Vanlige spørsmål',
    },
];

const Oversikt = (props: Props) => {
    const cls = BEMHelper(props.className);

    return (
        <div className={cls.element('oversikt')}>
            <Innholdstittel className={cls.element('oversikt-tittel')}>Innhold</Innholdstittel>
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
