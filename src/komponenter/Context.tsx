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
    ) => {
        return setInnhold((prevState) => ({
            ...prevState,
            [type]: [...prevState[type], value],
        }));
    };

    const setSideSistOppdatert = <T extends SistOppdatert>(value: T) => {
        setSistOppdatert(value);
    };

    const contextData: Context = {
        permitteringInnhold: innhold,
        sistOppdatert,
        settPermitteringInnhold,
        setSideSistOppdatert,
    };

    /* const setPermitteringInnholdFraNokkelVerdi = (
        type: string,
        item: SanityBlockTypes
    ): keyof PermitteringInnhold | keyof SistOppdatert | void => {
        switch (type) {
            case 'sist-oppdatert':
                setSideSistOppdatert(item);
                break;
            case 'hvordan-permittere-ansatte':
                settPermitteringInnhold('hvordanPermittere', item);
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
*/
    useEffect(() => {
        const url = isProduction();
        fetchsanityJSON(url)
            .then((res) => {
                setEnv(res.env);
                res.data.forEach((item) => {
                    //setPermitteringInnholdFraNokkelVerdi(item._type, item);
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
