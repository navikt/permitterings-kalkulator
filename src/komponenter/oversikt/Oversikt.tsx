import React, { useEffect, useState } from 'react';
import BEMHelper from '../../utils/bem';
import Infolenke from './Infolenke';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';

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
    const [mobilpanelIsopen, setMobilpanelIsopen] = useState<boolean>(false);

    const setPanelView = () => {
        setMobilpanelIsopen(!mobilpanelIsopen);
    };

    const scrollHeight = () => window.scrollY || window.pageYOffset;
    const hoppLenkerScrollheight = () =>
        lenker
            .map((section) =>
                document.getElementById(section.hopplenke.slice(1))
            )
            .map((sectionNode) => (sectionNode ? sectionNode.offsetTop : 0));
    // test

    useEffect(() => {
        const setFocusIndex = () => {
            return hoppLenkerScrollheight().map(
                (hoppLenkerScrollheight, index) => {
                    if (hoppLenkerScrollheight - 150 < scrollHeight()) {
                        return setSectionInFocus(index);
                    }
                    return null;
                }
            );
        };

        window.addEventListener('scroll', () => setFocusIndex(), {
            passive: true,
        });
        return () => {
            window.removeEventListener('scroll', () => setFocusIndex());
        };
    }, []);

    return (
        <>
            <div
                className={cls.element('oversikt') + ' media-lg-desktop'}
                role="navigation"
            >
                {lenker.map((lenke, index) => {
                    return (
                        <Infolenke
                            hopplenke={lenke.hopplenke}
                            lenketekst={lenke.lenketekst}
                            className={cls.element(
                                'info-lenke',
                                sectionInFocus === index ? 'bold' : ''
                            )}
                            key={lenke.lenketekst}
                            lenkeAction={setPanelView}
                        />
                    );
                })}
            </div>
            <div
                className={
                    cls.element('oversikt-mobil') + ' media-mobil-tablet'
                }
            >
                <EkspanderbartpanelBase
                    tittel={lenker[sectionInFocus].lenketekst}
                    apen={mobilpanelIsopen}
                    onClick={() => setPanelView()}
                    aria-expanded={sectionInFocus ? 'true' : 'false'}
                >
                    {lenker.map((lenke, index) => {
                        return (
                            <Infolenke
                                hopplenke={lenke.hopplenke}
                                lenketekst={lenke.lenketekst}
                                className={cls.element(
                                    'info-lenke',
                                    sectionInFocus === index ? 'bold' : ''
                                )}
                                key={lenke.lenketekst}
                                lenkeAction={setPanelView}
                                isHidden={!sectionInFocus}
                            />
                        );
                    })}
                </EkspanderbartpanelBase>
            </div>
        </>
    );
};

export default Oversikt;
