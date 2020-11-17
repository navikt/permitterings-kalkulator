const CONTAINER_WIDTH = 560;
const STICKYHEADER_HEIGHT = 100;

export const isDesktop = () => window.innerWidth > 1024;

const compare = (): boolean => {
    return window.pageYOffset < getContainerHeight() - STICKYHEADER_HEIGHT;
};

export const setScroll = () => {
    return compare()
        ? getContainerHeight() - window.pageYOffset
        : STICKYHEADER_HEIGHT;
};

export const calcWithPosition = () => {
    if (!isDesktop()) {
        return window.innerWidth > CONTAINER_WIDTH
            ? (window.innerWidth - CONTAINER_WIDTH) / 2 + 20
            : 16;
    }
    return 0;
};

export const getContainerHeight = (): number => {
    if (!isDesktop()) {
        const htmlcontainer = document.getElementById(
            'hvordanPermittere'
        ) as HTMLDivElement;
        if (htmlcontainer) {
            console.log('htmlcontainer.offsetTop', htmlcontainer.offsetTop);
            return htmlcontainer.offsetTop;
        }
    }
    return 0;
};
