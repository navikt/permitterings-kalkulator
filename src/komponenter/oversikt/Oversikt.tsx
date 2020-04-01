import React, { useEffect, useState } from 'react';
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
    const [sectionInFocus, setSectionInFocus] = useState<number>(0);

    useEffect(() => {
        window.addEventListener('scroll', () => setFocusIndex());
        return () => {
            window.removeEventListener('scroll', () => setFocusIndex());
        };
    }, []);

    const scrollHeight = () => window.scrollY || window.pageYOffset;
    const hoppLenkerScrollheight = () =>
        lenker
            .map((section) => document.getElementById(section.hopplenke.slice(1)))
            .map((sectionNode) => (sectionNode ? sectionNode.offsetTop : 0));

    const setFocusIndex = () => {
        hoppLenkerScrollheight().map((hoppLenkerScrollheight, index) => {
            if (hoppLenkerScrollheight - 450 < scrollHeight()) {
                setSectionInFocus(index);
            }
        });
    };

    return (
        <div className={cls.element('oversikt')}>
            <Innholdstittel className={cls.element('oversikt-tittel')}>Innhold</Innholdstittel>
            {lenker.map((lenke, index) => {
                return (
                    <Infolenke
                        hopplenke={lenke.hopplenke}
                        lenketekst={lenke.lenketekst}
                        className={cls.element('info-lenke', sectionInFocus === index ? 'bold' : '')}
                        key={lenke.lenketekst}
                    />
                );
            })}
        </div>
    );
};

export default Oversikt;
