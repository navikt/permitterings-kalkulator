import React, { useEffect, useState } from 'react';
import BEMHelper from '../../utils/bem';
import throttle from 'lodash.throttle';
import Menyknapp from './menyknapp/Menyknapp';
import { Undertittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import './meny.less';
import {
    calcWithPosition,
    initmenuPosition,
    isDesktop,
    setScroll,
} from '../../utils/menu-utils';

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
        hopplenke: '#narSkalJegUtbetaleLonn',
        lenketekst: 'Når skal jeg utbetale lønn?',
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

const Meny = () => {
    const cls = BEMHelper('meny');
    const [sectionInFocus, setSectionInFocus] = useState<number>(0);
    const [viewmobilMenu, setViewmobilMenu] = useState<boolean>(false);
    const [buttonStyling, setButtonStyling] = useState<number>(
        initmenuPosition()
    );
    const [widthPosition, SetWidthPosition] = useState<number>(
        calcWithPosition()
    );

    const toggleButton = () => setViewmobilMenu(!viewmobilMenu);

    useEffect(() => {
        const scrollHeight = () => window.scrollY || window.pageYOffset;
        const hoppLenkerScrollheight = () =>
            lenker
                .map((section) =>
                    document.getElementById(section.hopplenke.slice(1))
                )
                .map((sectionNode) =>
                    sectionNode ? sectionNode.offsetTop : 0
                );

        const setFocusIndex = () => {
            return lenker.length === 4
                ? hoppLenkerScrollheight().map((scrollheight, index) => {
                      if (scrollheight - 250 < scrollHeight()) {
                          return setSectionInFocus(index);
                      }
                      return null;
                  })
                : null;
        };
        const throttleScrollevent = throttle(() => setFocusIndex(), 75);
        const dispatchmobilevent = () =>
            isDesktop() ? setButtonStyling(setScroll()) : null;

        window.onscroll = function () {
            throttleScrollevent();
            dispatchmobilevent();
        };

        window.addEventListener('resize', () => {
            setButtonStyling(initmenuPosition());
            SetWidthPosition(calcWithPosition());
        });
        return () =>
            window.removeEventListener('resize', () => {
                setButtonStyling(initmenuPosition());
                SetWidthPosition(calcWithPosition());
            });
    }, []);

    return (
        <>
            <div
                className={cls.className}
                style={{ marginTop: `${buttonStyling}px` }}
            >
                <div className={cls.element('wrapper')}>
                    <Menyknapp
                        on={viewmobilMenu}
                        change={toggleButton}
                        width={widthPosition}
                    />
                    <div
                        className={cls.element(
                            'container',
                            viewmobilMenu ? '' : 'closed'
                        )}
                        style={{ right: `${widthPosition}px` }}
                    >
                        <div className={cls.element('content')}>
                            <Undertittel className={cls.element('tittel')}>
                                Innhold på denne siden:
                            </Undertittel>

                            {lenker
                                ? lenker.map(
                                      (
                                          element: PermitteringsLenke,
                                          index: number
                                      ) => {
                                          return (
                                              <Normaltekst
                                                  className={cls.element(
                                                      'lenke',
                                                      sectionInFocus === index
                                                          ? 'bold'
                                                          : ''
                                                  )}
                                                  key={index}
                                              >
                                                  <Lenke
                                                      href={element.hopplenke}
                                                  >
                                                      {element.lenketekst}
                                                  </Lenke>
                                              </Normaltekst>
                                          );
                                      }
                                  )
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Meny;
