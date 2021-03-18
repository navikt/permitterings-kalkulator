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
    recalibrateMenuPosition,
    windowWidthIsDesktopSize,
} from '../../utils/menu-utils';
import { PermitteringContext } from '../ContextProvider';
import {
    seksjoner,
    PermitteringsLenke,
    setFocusIndex,
} from '../../utils/menu-lenker-utils';

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
    }, [context.permitteringInnhold.vanligeSpr]);

    useEffect(() => {
        const recalebrateMenuPos = (): void =>
            recalibrateMenuPosition(
                appDisplayMobileMenu,
                setAppDisplayMobileMenu,
                setHeightPosition,
                SetWidthPosition
            );

        const throttleSetFocusOnMenuLinkevent = debounce(
            () => setFocusIndex(setSectionInFocus),
            10
        );

        const setMenuHeightPosition = (): number | void => {
            if (!windowWidthIsDesktopSize()) {
                return setHeightPosition(adjustMenuHeight());
            }
        };

        window.onscroll = function () {
            throttleSetFocusOnMenuLinkevent();
            setMenuHeightPosition();
        };

        window.addEventListener('resize', recalebrateMenuPos);

        return () => window.removeEventListener('resize', recalebrateMenuPos);
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
                                                      href={'#'.concat(
                                                          element.id
                                                      )}
                                                  >
                                                      {element.navn}
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
