import React from 'react';
import Lenke from 'nav-frontend-lenker';

const HvordanSkalJegBeregne = () => {
    return (
        <>
            På grunn av koronasituasjonen skal du kun betale lønn i to dager etter at du har permittert ansatte. Dette
            gjaldt fra og med 20. mars. Arbeidsgivere som har betalt lønn til ansatte to eller flere dager før denne
            datoen slipper å utbetale mer lønn. Se hvordan du beregner perioden i{' '}
            <Lenke href="https://lovdata.no/nav/rundskriv/v1-04-00">rundskrivet om lønnsplikt</Lenke>.
        </>
    );
};

export default HvordanSkalJegBeregne;
