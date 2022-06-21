import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
    children: React.ReactNode;
}

export interface Context {
    dagensDato: Dayjs;
    regelEndringsDato1April: Dayjs;
    regelEndring1Juli: Dayjs;
}

export const PermitteringContext = React.createContext({} as Context);

const ContextProvider = (props: Props) => {
    console.log('rendrer kontekst');
    const [dagensDato] = useState<Dayjs>(dayjs().startOf('date'));
    console.log(dagensDato, 'dagens dato');

    const contextData: Context = {
        dagensDato: dagensDato,
        regelEndringsDato1April: dayjs('2022-04-01'),
        regelEndring1Juli: dayjs('2021-07-01'),
    };

    return (
        <PermitteringContext.Provider value={contextData}>
            {props.children}
        </PermitteringContext.Provider>
    );
};

export default ContextProvider;
