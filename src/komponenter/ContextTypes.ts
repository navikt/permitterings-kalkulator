import { SanityBlockTypes, SistOppdatert } from '../sanity-blocks/sanityTypes';

export interface PermitteringInnhold {
    hvordanPermittere: [] | SanityBlockTypes[];
    narSkalJegUtbetale: [] | SanityBlockTypes[];
    iPermitteringsperioden: [] | SanityBlockTypes[];
    vanligeSpr: [] | SanityBlockTypes[];
}

export type SettPermitteringInnhold = <
    K extends keyof NonNullable<PermitteringInnhold>,
    T extends SanityBlockTypes
>(
    felt: K,
    verdi: T
) => void;

export type SettSideSistOppdatert = <T extends SistOppdatert>(value: T) => void;

export const setPermitteringInnholdFraNokkelVerdi = (
    type: string,
    item: SanityBlockTypes,
    setSideSistOppdatert: <T extends SistOppdatert>(value: T) => void,
    settPermitteringInnhold: <
        K extends keyof NonNullable<PermitteringInnhold>,
        T extends SanityBlockTypes
    >(
        type: K,
        value: T
    ) => void
): void => {
    console.log('type', type);
    switch (type) {
        case 'sist-oppdatert':
            setSideSistOppdatert(item);
            break;
        case 'hvordan-permittere-ansatte':
            console.log('type = hvordan-permittere-ansatte');
            settPermitteringInnhold('hvordanPermittere', item);
            break;
        case 'i-permitteringsperioden':
            settPermitteringInnhold('iPermitteringsperioden', item);
            break;
        case 'nar-skal-jeg-utbetale-lonn':
            settPermitteringInnhold('narSkalJegUtbetale', item);
            break;
        case 'vanlige-sporsmal':
            settPermitteringInnhold('vanligeSpr', item);
            break;
    }
};
