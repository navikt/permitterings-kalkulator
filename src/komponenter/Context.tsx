import React, { useEffect, useState } from 'react';
import { SanityBlockTypes, SistOppdatert } from '../sanity-blocks/sanityTypes';
import { fetchsanityJSON, isProduction } from '../utils/fetch-utils';
import { skrivTilMalingBesokerSide } from '../utils/amplitudeUtils';
import { scrollIntoView } from '../utils/scrollIntoView';
import { setEnv } from '../sanity-blocks/serializer';
import {
    PermitteringInnhold,
    SettPermitteringInnhold,
    SettSideSistOppdatert,
    setPermitteringInnholdFraNokkelVerdi,
} from './ContextTypes';

interface Props {
    children: React.ReactNode;
}

export type DocumentTypes = SanityBlockTypes;

export interface Context {
    permitteringInnhold: PermitteringInnhold;
    sistOppdatert: SistOppdatert | null;
    settPermitteringInnhold: SettPermitteringInnhold;
    setSideSistOppdatert: SettSideSistOppdatert;
}

export const PermitteringContext = React.createContext({} as Context);

const Context = (props: Props) => {
    const [innhold, setInnhold] = useState({
        hvordanPermittere: [],
        narSkalJegUtbetale: [],
        iPermitteringsperioden: [],
        vanligeSpr: [],
    });

    const [sistOppdatert, setSistOppdatert] = useState<SistOppdatert | null>(
        null
    );

    const settPermitteringInnhold = <
        K extends keyof NonNullable<PermitteringInnhold>,
        T extends SanityBlockTypes
    >(
        type: K,
        value: T
    ): void => {
        return setInnhold((prevState) => ({
            ...prevState,
            [type]: [...prevState[type], value],
        }));
    };

    const setSideSistOppdatert = <T extends SistOppdatert>(value: T): void => {
        setSistOppdatert(value);
    };

    const contextData: Context = {
        permitteringInnhold: innhold,
        sistOppdatert,
        settPermitteringInnhold,
        setSideSistOppdatert,
    };

    useEffect(() => {
        const url = isProduction();
        fetchsanityJSON(url)
            .then((res) => {
                setEnv(res.env);
                res.data.forEach((item) => {
                    setPermitteringInnholdFraNokkelVerdi(
                        item._type,
                        item,
                        setSideSistOppdatert,
                        settPermitteringInnhold
                    );
                });
            })
            .catch((err) => console.warn(err));
        skrivTilMalingBesokerSide();
        scrollIntoView();
    }, []);

    return (
        <PermitteringContext.Provider value={contextData}>
            {props.children}
        </PermitteringContext.Provider>
    );
};

export default Context;
