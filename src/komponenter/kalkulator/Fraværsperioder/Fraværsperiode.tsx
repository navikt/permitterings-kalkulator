import React, { FunctionComponent } from 'react';
import { DatoIntervall } from '../typer';
import DatoIntervallInput from '../DatointervallInput/DatointervallInput';

interface Props {
    fraværsperiode: Partial<DatoIntervall>;
    setFraværsperiode: (datoIntervall: Partial<DatoIntervall>) => void;
    slettFraværsperiode: () => void;
    inngårIPermitteringsperiode: boolean;
}

const Fraværsperiode: FunctionComponent<Props> = ({
    fraværsperiode,
    setFraværsperiode,
    slettFraværsperiode,
    inngårIPermitteringsperiode,
}) => {
    const advarsel = inngårIPermitteringsperiode
        ? ''
        : 'Fravær som ikke inngår i permitteringsperioder telles ikke med i beregningen';

    return (
        <DatoIntervallInput
            advarsel={advarsel}
            datoIntervall={fraværsperiode}
            setDatoIntervall={setFraværsperiode}
            slettPeriode={slettFraværsperiode}
        />
    );
};

export default Fraværsperiode;
