import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
    children: React.ReactNode;
}

export interface Context {
    dagensDato: Dayjs;
    regelEndringsDato1Oktober: Dayjs;
    regelEndring1Juli: Dayjs;
}

export const PermitteringContext = React.createContext({} as Context);

const ContextProvider = (props: Props) => {
    const [dagensDato] = useState<Dayjs>(dayjs().startOf('date'));

    const contextData: Context = {
        dagensDato: dagensDato,
        regelEndringsDato1Oktober: dayjs('2021-10-01'),
        regelEndring1Juli: dayjs('2021-07-01'),
    };

    return (
        <PermitteringContext.Provider value={contextData}>
            {props.children}
        </PermitteringContext.Provider>
    );
};

export default ContextProvider;
