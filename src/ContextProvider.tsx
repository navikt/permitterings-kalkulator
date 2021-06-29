import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
    children: React.ReactNode;
}

export interface Context {
    dagensDato: Dayjs;
    innføringsdatoAGP2: Dayjs;
    regelEndringsDato1Oktober: Dayjs;
}

export const PermitteringContext = React.createContext({} as Context);

const ContextProvider = (props: Props) => {
    const [dagensDato] = useState<Dayjs>(dayjs().startOf('date'));

    const contextData: Context = {
        dagensDato: dagensDato,
        innføringsdatoAGP2: dayjs('2021-06-01'),
        regelEndringsDato1Oktober: dayjs('2021-10-01'),
    };

    return (
        <PermitteringContext.Provider value={contextData}>
            {props.children}
        </PermitteringContext.Provider>
    );
};

export default ContextProvider;
