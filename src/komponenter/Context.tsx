import React, { useEffect, useState } from 'react';
import { SanityBlockTypes, SistOppdatert } from '../sanity-blocks/sanityTypes';
import { fetchsanityJSON, isProduction } from '../utils/fetch-utils';
import { skrivTilMalingBesokerSide } from '../utils/amplitudeUtils';
import { scrollIntoView } from '../utils/scrollIntoView';
import { setEnv } from '../sanity-blocks/serializer';

interface Props {
    children: React.ReactNode;
}

type DocumentTypes = SanityBlockTypes;

interface ContextTypes {
    sistOppdatert: SistOppdatert | null;
    hvordanPermittere: [] | SanityBlockTypes[];
    narSkalJegUtbetale: [] | SanityBlockTypes[];
    iPermitteringsperioden: [] | SanityBlockTypes[];
    vanligeSpr: [] | SanityBlockTypes[];
}

export const PermitteringContext = React.createContext({} as ContextTypes);

const Context = (props: Props) => {
    const [sistOppdatert, setSistOppdatert] = useState<SistOppdatert | null>(
        null
    );
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
        sistOppdatert: sistOppdatert,
        hvordanPermittere: hvordanPermittere,
        narSkalJegUtbetale: narSkalJegUtbetale,
        iPermitteringsperioden: iPermitteringsperioden,
        vanligeSpr: vanligeSpr,
    };

    useEffect(() => {
        const skrivfraSanity = (item: DocumentTypes) => {
            switch (item._type) {
                case 'sist-oppdatert':
                    return setSistOppdatert(item as SistOppdatert);
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
