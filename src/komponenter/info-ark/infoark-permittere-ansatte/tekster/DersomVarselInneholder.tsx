import React from 'react';
import Tekstseksjon from '../../../infoseksjon/Tekstseksjon';
import Lenke from 'nav-frontend-lenker';

const DersomVarselInneholder = () => {
    return (
        <>
            <Tekstseksjon>
                Arbeidsgiverorganisasjonene utarbeider ofte egne maler for permitteringsvarsel. På Altinn finner du også
                en mal som alle har tilgang til:
                <Lenke href="https://www.altinn.no/globalassets/dokumentmaler/permitteringsvarsel.doc">
                    {' '}
                    Mal for permitteringsvarsel
                </Lenke>
                .
            </Tekstseksjon>
        </>
    );
};

export default DersomVarselInneholder;
