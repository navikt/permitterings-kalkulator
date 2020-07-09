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
        const skrivfraSanity = (item: SanityBlockTypes) => {
            switch (item._type) {
                case 'hvordan-permittere-ansatte':
                    return setHvordanPermittere((data) => [...data, item]);
                case 'i-permitteringsperioden':
                    return setIpermitteringsperioden((data) => [...data, item]);
                case 'nar-skal-jeg-utbetale-lonn':
                    return setNarSkalJegUtbetale((data) => [...data, item]);
                case 'vanlige-sporsmal':
                    return setVanligeSpr((data) => [...data, item]);
            }
        };

        const url = isProduction();
        fetchsanityJSON(url)
            .then((res) => {
                res.forEach((item: SanityBlockTypes) => {
                    skrivfraSanity(item);
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
