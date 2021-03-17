import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import * as Sentry from '@sentry/react';
import { SanityBlockTypes, SistOppdatert } from '../sanity-blocks/sanityTypes';
import { fetchsanityJSON } from '../utils/fetch-utils';
import { skrivTilMalingBesokerSide } from '../utils/amplitudeUtils';
import { scrollIntoView } from '../utils/scrollIntoView';
import { setEnv } from '../sanity-blocks/serializer';
import {
    PermitteringInnhold,
    setPermitteringInnholdFraNokkelVerdi,
    SettPermitteringInnhold,
    SettSideSistOppdatert,
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
    dagensDato: Dayjs;
    innføringsdatoAGP2: Dayjs;
}

export const PermitteringContext = React.createContext({} as Context);

const ContextProvider = (props: Props) => {
    const [innhold, setInnhold] = useState({
        hvordanPermittere: [],
        narSkalJegUtbetale: [],
        iPermitteringsperioden: [],
        informasjonTilAnsatte: [],
        vanligeSpr: [],
    });

    const [sistOppdatert, setSistOppdatert] = useState<SistOppdatert | null>(
        null
    );

    const [dagensDato] = useState<Dayjs>(dayjs().startOf('date'));

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
        dagensDato: dagensDato,
        innføringsdatoAGP2: dayjs('2021-06-01'),
    };

    useEffect(() => {
        fetchsanityJSON()
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
            .catch((err) => {
                Sentry.captureException(err);
                console.warn(err);
            });
        skrivTilMalingBesokerSide();
        scrollIntoView();
    }, []);

    return (
        <PermitteringContext.Provider value={contextData}>
            {props.children}
        </PermitteringContext.Provider>
    );
};

export default ContextProvider;
