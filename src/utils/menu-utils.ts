const CONTAINER_WIDTH = 560;
const STICKYHEADER_HEIGHT = 100;
const HEADERDIFF = 46;

export const windowWidthIsDesktopSize = () => window.innerWidth > 1024;

const getMainContainer = (): HTMLDivElement | null =>
    document.getElementById('hvordanPermittere') as HTMLDivElement;

const scrollheightIsLowerThanContainerOffsetTop = (
    containerOffsetTop: number
) => {
    return window.pageYOffset < containerOffsetTop - STICKYHEADER_HEIGHT;
};

export const adjustMenuHeight = () => {
    const elem = getMainContainer();
    if (elem && scrollheightIsLowerThanContainerOffsetTop(elem.offsetTop)) {
        return getContainerHeight() - window.pageYOffset;
    }
    return STICKYHEADER_HEIGHT;
};

export const calcMenuWidthPosition = () => {
    if (!windowWidthIsDesktopSize()) {
        calcMobileMenuWidthPosition();
    }
    return 0; //desktop is 0.
};

const calcMobileMenuWidthPosition = () => {
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

const getDesktopContainerOffsetTopDiff = (): number => {
    return HEADERDIFF;
};
