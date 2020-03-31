import React from 'react';
import Lenke from 'nav-frontend-lenker';

const HvordanSkalJegVareSikker = () => {
    return (
        <>
            Hovedavtalen gir adgang til å permittere i forbindelse med midlertidige driftsinnskrenkninger eller
            driftsstans. NAV tar stilling til om permitteringsårsaken kan gi rett til dagpenger når vi behandler
            dagpengesøknadene. Vi kan innvilge dagpenger dersom den ansatte er permittert på grunn av mangel på arbeid
            eller andre forhold som arbeidsgiveren ikke kan påvirke. NAV overprøver vanligvis ikke en forkortet varsling
            hvis forholdet går inn under{' '}
            <Lenke href="https://lovdata.no/nav/lov/2005-06-17-62/kap15/%C2%A715-3">
                arbeidsmiljølovens bestemmelser om ulykker, naturhendelser eller andre uforutsette hendelser
            </Lenke>
            .
        </>
    );
};

export default HvordanSkalJegVareSikker;
