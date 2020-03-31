import React from 'react';
import Tekstseksjon from '../../../infoseksjon/Tekstseksjon';
import Lenke from 'nav-frontend-lenker';

const OppsigelseUnderPermittering = () => {
    return (
        <>
            <Tekstseksjon tittel="Oppsigelse under permittering">
                Dersom arbeidsgiver sier opp en arbeidstaker som er permittert, har arbeidsgiver som hovedregel
                lønnsplikt i lovbestemt eller avtalt oppsigelsestid. Lønnsplikten inntrer den dagen den permitterte
                mottar oppsigelsen fra arbeidsgiver.
            </Tekstseksjon>
            <Tekstseksjon>
                Arbeidstaker som selv sier opp mens vedkommende er permittert, har vanligvis ikke krav på lønn i
                oppsigelsestid med mindre noe annet går fram av tariffavtale eller liknende. Dette må undersøkes i hvert
                enkelt tilfelle. For permitterte som selv sier opp sin stilling, gjelder kortere oppsigelsesfrister enn
                vanlig, se arbeidsmiljølovens bestemmelser{' '}
                <Lenke href="https://lovdata.no/nav/lov/2005-06-17-62/kap15">arbeidsmiljøloven § 15-3 nr. 9</Lenke>
            </Tekstseksjon>
        </>
    );
};

export default OppsigelseUnderPermittering;
