import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';

const HvordanSkalJegVareSikker = () => {
    return (
        <>
            <Normaltekst>
                Du kan permittere dersom virksomheten din reduseres eller
                stanses i en periode . Dette går fram av{' '}
                <Lenke href="https://www.lo.no/hovedavtalen/#3989">
                    Hovedavtalen LO NHO
                </Lenke>
                . Vi tar stilling til om permitteringen gir rett til dagpenger
                når vi behandler søknaden. Det vil si at vi vurderer om
                permitteringen skyldes at bedriften har redusert eller stanset
                virksomheten på grunn av forhold du ikke har hatt mulighet til å
                påvirke.
            </Normaltekst>
        </>
    );
};

export default HvordanSkalJegVareSikker;
