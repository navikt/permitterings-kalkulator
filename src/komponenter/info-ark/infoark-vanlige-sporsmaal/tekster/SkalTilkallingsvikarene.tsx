import React from 'react';
import Lenke from 'nav-frontend-lenker';

const SkalTilkallingsvikarene = () => {
    return (
        <>
            Tilkallingshjelp og frilansere med avtale om konkret arbeid, kan permitteres fra denne arbeidsplikten. De må
            i tilfelle få permitteringsvarsel på vanlig måte. Hvis det ikke var gjort avtale om konkret arbeid, vil det
            ikke være aktuelt å permittere. I et slikt tilfelle vil de ikke ha rett til dagpenger under permittering,
            men kan ha rett til{' '}
            <Lenke href="https://www.nav.no/no/person/arbeid/dagpenger-ved-arbeidsloshet-og-permittering/dagpenger">
                dagpenger etter vanlige regler
            </Lenke>
            .
        </>
    );
};

export default SkalTilkallingsvikarene;
