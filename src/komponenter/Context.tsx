import React, { useEffect, useState } from 'react';
import {
    SanityBlockTypes,
    NarSkalJegUtbetaleIllustration,
} from '../sanity-blocks/sanityTypes';
import { fetchsanityJSON, isProduction } from '../utils/fetch-utils';
import { skrivTilMalingBesokerSide } from '../utils/amplitudeUtils';
import { scrollIntoView } from '../utils/scrollIntoView';
import { setEnv } from '../sanity-blocks/serializer';

interface Props {
    children: React.ReactNode;
}

type DocumentTypes = SanityBlockTypes | NarSkalJegUtbetaleIllustration;

interface ContextTypes {
    hvordanPermittere: [] | SanityBlockTypes[];
    narSkalJegUtbetaleIllustrasjon: null | NarSkalJegUtbetaleIllustration;
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
    const [
        narSkalJegUtbetaleIllustrasjon,
        setNarSkalJegUtbetaleIllustrasjon,
    ] = useState<null | NarSkalJegUtbetaleIllustration>(null);
    const [iPermitteringsperioden, setIpermitteringsperioden] = useState<
        [] | SanityBlockTypes[]
    >([]);
    const [vanligeSpr, setVanligeSpr] = useState<[] | SanityBlockTypes[]>([]);

    const contextdata: ContextTypes = {
        hvordanPermittere: hvordanPermittere,
        narSkalJegUtbetaleIllustrasjon: narSkalJegUtbetaleIllustrasjon,
        narSkalJegUtbetale: narSkalJegUtbetale,
        iPermitteringsperioden: iPermitteringsperioden,
        vanligeSpr: vanligeSpr,
    };

    useEffect(() => {
        const skrivfraSanity = (item: DocumentTypes) => {
            switch (item._type) {
                case 'hvordan-permittere-ansatte':
                    return setHvordanPermittere((data) => [
                        ...data,
                        item as SanityBlockTypes,
                    ]);
                case 'i-permitteringsperioden':
                    return setIpermitteringsperioden((data) => [
                        ...data,
                        item as SanityBlockTypes,
                    ]);
                case 'nar-skal-jeg-utbetale-lonn':
                    return setNarSkalJegUtbetale((data) => [
                        ...data,
                        item as SanityBlockTypes,
                    ]);
                case 'vanlige-sporsmal':
                    return setVanligeSpr((data) => [
                        ...data,
                        item as SanityBlockTypes,
                    ]);
                case 'nar-skal-jeg-utbetale-lonn-illustrasjon':
                    return setNarSkalJegUtbetaleIllustrasjon(
                        item as NarSkalJegUtbetaleIllustration
                    );
            }
        };

        const url = isProduction();
        fetchsanityJSON(url)
            .then((res) => {
                console.log('innholdet til sanity client', res);
                setEnv(res.env);
                res.data.forEach((item: SanityBlockTypes) => {
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
