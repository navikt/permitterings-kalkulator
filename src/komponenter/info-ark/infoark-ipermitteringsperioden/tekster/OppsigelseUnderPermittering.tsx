import React from 'react';
import Tekstseksjon from '../../../infoseksjon/Tekstseksjon';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';

const OppsigelseUnderPermittering = () => {
    return (
        <>
            <Tekstseksjon tittel="Oppsigelse under permittering">
                <Normaltekst>
                    Dersom du sier opp en ansatt som er permittert, må du som
                    hovedregel utbetale lønn i oppsigelsestiden. Dette gjelder
                    fra den dagen den ansatte får oppsigelsen.
                </Normaltekst>
            </Tekstseksjon>
            <Tekstseksjon>
                <Normaltekst>
                    Hvis en permittert ansatt selv sier opp jobben sin, skal du
                    vanligvis ikke utbetale lønn. Dette avhenger av for eksempel
                    hva som står i tariffavtalen eller andre avtaler mellom
                    arbeidsgiver og ansatt, og må undersøkes i hvert enkelt
                    tilfelle. Oppsigelsestiden er kortere enn vanlig når en
                    permittert ansatt sier opp selv. Lenke til{' '}
                    <Lenke href="https://lovdata.no/nav/lov/2005-06-17-62/kap15">
                        arbeidsmiljøloven § 15-3 nr. 9
                    </Lenke>
                </Normaltekst>
            </Tekstseksjon>
        </>
    );
};

export default OppsigelseUnderPermittering;
