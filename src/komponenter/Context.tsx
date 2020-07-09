import React, { useEffect, useState } from 'react';
import { SanityBlockTypes } from '../sanity-blocks/sanityTypes';
import { fetchsanityJSON, isProduction } from '../utils/fetch-utils';
import { skrivTilMalingBesokerSide } from '../utils/amplitudeUtils';
import { scrollIntoView } from '../utils/scrollIntoView';

interface Props {
    children: React.ReactNode;
}

interface ContextTypes {
    hvordanPermittere: [] | SanityBlockTypes[];
    narSkalJegUtbetale: [] | SanityBlockTypes[];
    iPermitteringsperioden: [] | SanityBlockTypes[];
    vanligeSpr: [] | SanityBlockTypes[];
}

export const PermitteringContext = React.createContext({} as ContextTypes);

const Context = (props: Props) => {
    const [hvordanPermittere, setHvordanPermittere] = useState<
        [] | SanityBlockTypes[]
    >([]);
    const [narSkalJegUtbetale, setNarSkalJegUtbetale] = useState<
        [] | SanityBlockTypes[]
    >([]);
    const [iPermitteringsperioden, setIpermitteringsperioden] = useState<
        [] | SanityBlockTypes[]
    >([]);
    const [vanligeSpr, setVanligeSpr] = useState<[] | SanityBlockTypes[]>([]);

    const contextdata: ContextTypes = {
        hvordanPermittere: hvordanPermittere,
        narSkalJegUtbetale: narSkalJegUtbetale,
        iPermitteringsperioden: iPermitteringsperioden,
        vanligeSpr: vanligeSpr,
    };

    useEffect(() => {
        const writeToHook = (item: SanityBlockTypes) => {
            switch (item._type) {
                case 'hvordan-permittere-ansatte':
                    return setHvordanPermittere((hvordanPermittere) => [
                        ...hvordanPermittere,
                        item,
                    ]);
                case 'i-permitteringsperioden':
                    return setIpermitteringsperioden(
                        (iPermitteringsperioden) => [
                            ...iPermitteringsperioden,
                            item,
                        ]
                    );
                case 'nar-skal-jeg-utbetale-lonn':
                    return setNarSkalJegUtbetale((narSkalJegUtbetale) => [
                        ...narSkalJegUtbetale,
                        item,
                    ]);
                case 'vanlige-sporsmal':
                    return setVanligeSpr((vanligeSpr) => [...vanligeSpr, item]);
            }
        };

        const url = isProduction();
        fetchsanityJSON(url)
            .then((res) => {
                res.forEach((item: SanityBlockTypes) => {
                    writeToHook(item);
                });
            })
            .catch((err) => console.warn(err));
        skrivTilMalingBesokerSide();
        scrollIntoView();
    }, []);

    return (
        <PermitteringContext.Provider value={contextdata}>
            {props.children}
        </PermitteringContext.Provider>
    );
};

export default Context;
