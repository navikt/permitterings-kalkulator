import React from 'react';
import Lenke from 'nav-frontend-lenker';

const Sendpermitteringsvarsel = () => {
    return (
        <>
            Arbeidsgiver plikter å varsle arbeidstakerne på forhånd om permittering. Som hovedregel er varselfristen 14
            dager. Dette er fastsatt i <Lenke href="https://www.lo.no/hovedavtalen/#3991"> Hovedavtalen LO-NHO.</Lenke>{' '}
            Ved permittering på grunn av en uforutsett hendelse{' '}
            <Lenke href="https://lovdata.no/nav/lov/2005-06-17-62/kap15">(jf. arbeidsmiljølovens § 15-3 (10))</Lenke> er
            varselfristen 2 dager. Koronaviruset kan være en slik uforutsett hendelse.
        </>
    );
};

export default Sendpermitteringsvarsel;
