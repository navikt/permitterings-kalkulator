import { Dispatch, SetStateAction } from 'react';

const CONTAINER_WIDTH = 560;
const STICKYHEADER_HEIGHT = 100;
const HEADERDIFF = 46;

export const windowWidthIsDesktopSize = (): boolean => window.innerWidth > 1024;

const getMainContainer = (): HTMLDivElement | null =>
    document.getElementById('hvordanPermittere') as HTMLDivElement;

const scrollheightIsLowerThanContainerOffsetTop = (
    containerOffsetTop: number
): boolean => {
    return window.pageYOffset < containerOffsetTop - STICKYHEADER_HEIGHT;
};

export const adjustMenuHeight = (): number => {
    const elem = getMainContainer();
    if (elem && scrollheightIsLowerThanContainerOffsetTop(elem.offsetTop)) {
        return getContainerHeight() - window.pageYOffset;
    }
    return STICKYHEADER_HEIGHT;
};

export const calcMenuWidthPosition = (): number => {
    if (!windowWidthIsDesktopSize()) {
        return calcMobileMenuWidthPosition();
    }
    return 0; //desktop is 0.
};

const calcMobileMenuWidthPosition = (): number => {
    const windowWidthLessThanContainerWidth =
        window.innerWidth > CONTAINER_WIDTH;

    if (windowWidthLessThanContainerWidth) {
        return calcRightsideOffContainerWidth();
    }
    return 16; // 1rem indent
};

const calcRightsideOffContainerWidth = (): number =>
    (window.innerWidth - CONTAINER_WIDTH) / 2 + 20;

export const getContainerHeight = (): number => {
    if (!windowWidthIsDesktopSize()) {
        return getMobileContainerHeight();
    }
    return getDesktopContainerOffsetTopDiff();
};

const getMobileContainerHeight = (): number => {
    const container = getMainContainer();
    if (container) {
        return container.offsetTop;
    }
    return 0;
};

export const getDesktopContainerOffsetTopDiff = (): number => {
    return HEADERDIFF;
};

export const recalibrateMenuPosition = (
    appDisplayMobileMenu: boolean,
    setAppDisplayMobileMenu: Dispatch<SetStateAction<boolean>>,
    setHeightPosition: Dispatch<SetStateAction<number>>,
    SetWidthPosition: Dispatch<SetStateAction<number>>
): void => {
    if (appDisplayMobileMenu === windowWidthIsDesktopSize()) {
        setAppDisplayMobileMenu(!windowWidthIsDesktopSize());
        !windowWidthIsDesktopSize()
            ? setHeightPosition(adjustMenuHeight())
            : setHeightPosition(getDesktopContainerOffsetTopDiff());
    }
    SetWidthPosition(calcMenuWidthPosition());
};
