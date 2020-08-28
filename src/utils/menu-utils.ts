const margintop = 400;
const container = 560;

export const isMobil = () => window.innerWidth < 768;
export const isDesktop = () => window.innerWidth < 1024;
const containerheight = () => (isMobil() ? margintop : 365);

const pageScrolled = (): boolean => window.pageYOffset > 0;
const calcResult = (): number => containerheight() - window.pageYOffset;
const compare = (): boolean => window.pageYOffset < containerheight();
const setResult = () => (compare() ? calcResult() : 0);

export const initmenuPosition = () =>
    isDesktop() ? (pageScrolled() ? setResult() : containerheight()) : 0;

export const setScroll = () => {
    return compare() ? containerheight() - window.pageYOffset : 0;
};

export const calcWithPosition = () => {
    if (isDesktop()) {
        return window.innerWidth > container
            ? (window.innerWidth - container) / 2 + 20
            : 16;
    }
    return 0;
};
