import React from 'react';
import Tekstseksjon from '../../../infoseksjon/Tekstseksjon';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';

const HuskArapportere = () => {
    return (
        <>
            <Tekstseksjon
                tittel="4. Husk å rapportere permittering til a-ordningen"
                id="Aordningen"
            >
                <Normaltekst>
                    Du som arbeidsgiver har meldeplikt om permittering til
                    a-ordningen. Permittering skal senest rapporteres for den
                    måneden permitteringen begynner.
                </Normaltekst>
            </Tekstseksjon>
            <Tekstseksjon disableModifier={true}>
                <Normaltekst>
                    Når du melder inn til a-ordningen er det viktig at du oppgir
                    den startdatoen permitteringen faktiske begynte. Dette
                    gjelder også dersom den permitterte har ferie eller
                    sykefravær eller er i permisjon. Gjenta startdatoen i hver
                    a-melding så lenge permitteringen varer.
                </Normaltekst>
            </Tekstseksjon>
            <Tekstseksjon>
                <Normaltekst>
                    Husk å bruke ny permitteringsID dersom den ansatte har vært
                    permittert tidligere.{' '}
                    <Lenke href="https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/veiledning/arbeidsforholdet/opplysninger-om-arbeidsforholdet/permittering/">
                        Les mer om rapportering av permittering i veiledningen
                        til a-ordningen på Skatteetaten
                    </Lenke>
                    .
                </Normaltekst>
            </Tekstseksjon>
        </>
    );
};

export default HuskArapportere;
