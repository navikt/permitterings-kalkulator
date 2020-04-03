import React from 'react';
import Tekstseksjon from '../../../infoseksjon/Tekstseksjon';
import Lenke from 'nav-frontend-lenker';

const HuskArapportere = () => {
    return (
        <>
            <Tekstseksjon tittel="4. Husk å rapportere permittering til a-ordningen">
                Du som arbeidsgiver har meldeplikt om permittering til a-ordningen. Permittering skal senest rapporteres
                for den måneden som permitteringen ble iverksatt.
            </Tekstseksjon>
            <Tekstseksjon>
                Startdato på permitteringen skal være den dagen permitteringen iverksettes. Dette gjelder også dersom
                den permitterte har ferie eller sykefravær eller er i permisjon. Gjenta startdatoen i hver a-melding så
                lenge permitteringen varer.
            </Tekstseksjon>
            <Tekstseksjon>
                Husk å bruke ny permitteringsID dersom den ansatte har vært permittert tidligere.{' '}
                <Lenke href="https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/veiledning/arbeidsforholdet/opplysninger-om-arbeidsforholdet/permittering/">
                    Les mer om rapportering av permittering i veiledningen til a-ordningen på Skatteetaten
                </Lenke>
                .
            </Tekstseksjon>
        </>
    );
};

export default HuskArapportere;
