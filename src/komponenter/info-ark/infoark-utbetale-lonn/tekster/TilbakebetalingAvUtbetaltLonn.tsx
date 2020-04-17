import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

const TilbakebetalingAvUtbetaltLonn = () => {
    return (
        <>
            <Normaltekst>
                Du skal kun betale lønn de to første dagene etter at
                permitteringen har begynt. Har du forskuttert lønn til ansatte i
                de neste 18 kalenderdagene kan du søke om å få disse pengene
                tilbake. Dette gjelder kun permitteringsperioder som starter før
                20 april. Ansatte som blir permittert etter denne datoen må søke
                om lønnskompensasjon.
            </Normaltekst>
            <Normaltekst className="textair">
                Vi dekker ikke lønn som er høyere enn seks ganger grunnbeløpet.
                Er den ansatte delvis permittert, for eksempel 50 prosent, får
                du dekket 50 prosent av lønnsutgiftene dine. Du må søke senest
                31. oktober 2020 dersom du vil ha refundert lønn du har utbetalt
                til permitterte fra 20. mars. Vi jobber med en søknad og kommer
                med mer informasjon når den er klar.
            </Normaltekst>
        </>
    );
};

export default TilbakebetalingAvUtbetaltLonn;
