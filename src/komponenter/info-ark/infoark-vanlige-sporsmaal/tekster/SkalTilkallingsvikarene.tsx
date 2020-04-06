import React from 'react';
import Lenke from 'nav-frontend-lenker';

const SkalTilkallingsvikarene = () => {
    return (
        <>
            Ja, du må sende ut permitteringsvarsel på vanlig måte til tillkallingshjelp og frilansere du har konkrete
            arbeidsavtaler med. Dersom du ikke har slike avtaler med tilkallingshjelp og frilansere, skal du ikke sende
            ut varsel. Da har de ikke rett til dagpenger fordi de er permittert, men de kan ha rett til{' '}
            <Lenke href="https://www.nav.no/no/person/arbeid/dagpenger-ved-arbeidsloshet-og-permittering/dagpenger">
                dagpenger på ordinær måte
            </Lenke>
            .
        </>
    );
};

export default SkalTilkallingsvikarene;
