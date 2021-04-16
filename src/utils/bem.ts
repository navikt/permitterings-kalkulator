export interface BEMWrapper {
    className: string;
    element: (e?: string, m?: string) => string;
    modifier: (m?: string) => string;
}

const BEMHelper: (cls: string) => BEMWrapper = (cls: string) => ({
    className: cls,
    element: (e?: string, m?: string) => {
        if (m) {
            return `${cls}__${e} ${cls}__${e}--${m}`;
        }
        return `${cls}__${e}`;
    },
    modifier: (m?: string) => `${cls}--${m}`,
});

export default BEMHelper;
