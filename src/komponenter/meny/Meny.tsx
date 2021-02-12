import React, { useContext, useEffect, useState } from 'react';
import BEMHelper from '../../utils/bem';
import debounce from 'lodash.debounce';
import Menyknapp from './menyknapp/Menyknapp';
import { Undertittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import './meny.less';
import {
    adjustMenuHeight,
    calcMenuWidthPosition,
    getContainerHeight,
    getDesktopContainerOffsetTopDiff,
    windowWidthIsDesktopSize,
} from '../../utils/menu-utils';
import { PermitteringContext } from '../Context';

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
    const context = useContext(PermitteringContext);
    const cls = BEMHelper('meny');
    const [appDisplayMobileMenu, setAppDisplayMobileMenu] = useState<boolean>(
        !windowWidthIsDesktopSize()
    );
    const [viewmobilMenu, setViewmobilMenu] = useState<boolean>(false);
    const [sectionInFocus, setSectionInFocus] = useState<number>(0);
    const [heightPosition, setHeightPosition] = useState<number>(0);
    const [widthPosition, SetWidthPosition] = useState<number>(
        calcMenuWidthPosition()
    );

    const toggleButton = (): void => setViewmobilMenu(!viewmobilMenu);

    useEffect(() => {
        setHeightPosition(getContainerHeight());
    }, [context]);

    useEffect(() => {
        const scrollHeight = (): number => window.scrollY || window.pageYOffset;
        const hoppLenkerScrollheight = (): number[] =>
            lenker
                .map((section) =>
                    document.getElementById(section.hopplenke.slice(1))
                )
                .map((sectionNode) =>
                    sectionNode ? sectionNode.offsetTop : 0
                );

        const setFocusIndex = (): (void | null)[] | null => {
            return lenker.length === 4
                ? hoppLenkerScrollheight().map((scrollheight, index) => {
                      if (scrollheight - 450 < scrollHeight()) {
                          return setSectionInFocus(index);
                      }
                      return null;
                  })
                : null;
        };
        const throttleSetFocusOnMenuLinkevent = debounce(
            () => setFocusIndex(),
            10
        );

        const setMenuHeightPosition = (): number | void => {
            if (!windowWidthIsDesktopSize()) {
                return setHeightPosition(adjustMenuHeight());
            }
            return getDesktopContainerOffsetTopDiff();
        };

        window.onscroll = function () {
            throttleSetFocusOnMenuLinkevent();
            setMenuHeightPosition();
        };

        const recalibrateMenuPosition = (): void => {
            if (appDisplayMobileMenu === windowWidthIsDesktopSize()) {
                setAppDisplayMobileMenu(!windowWidthIsDesktopSize());
                !windowWidthIsDesktopSize()
                    ? setHeightPosition(adjustMenuHeight())
                    : setHeightPosition(getDesktopContainerOffsetTopDiff());
            }
            SetWidthPosition(calcMenuWidthPosition());
        };

        window.addEventListener('resize', recalibrateMenuPosition);

        return () =>
            window.removeEventListener('resize', recalibrateMenuPosition);
    }, [appDisplayMobileMenu]);

    return (
        <>
            <div
                className={cls.className}
                style={{ marginTop: `${heightPosition}px` }}
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
