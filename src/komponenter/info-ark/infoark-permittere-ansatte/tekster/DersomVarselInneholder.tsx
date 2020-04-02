import React from 'react';
import Tekstseksjon from '../../../infoseksjon/Tekstseksjon';
import Lenke from 'nav-frontend-lenker';

const DersomVarselInneholder = () => {
    return (
        <>
            <Tekstseksjon>
                Dersom permitteringsvarselet inneholder denne informasjonen, vil dette som hovedregel være tilstrekkelig
                for å kunne behandle søknad om dagpenger.
            </Tekstseksjon>

            <Tekstseksjon>
                Arbeidsgiverorganisasjonene utarbeider ofte egne maler for permitteringsvarsel. På Altinn finnes også en
                mal som alle har tilgang til:
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
