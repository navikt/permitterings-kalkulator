import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { skrivTilMalingFantDuIkkeDetDuLetteEtter } from '../../../../utils/amplitudeUtils';

const brukerFantIkkeSvar = (
    event: React.MouseEvent<MouseEvent | HTMLAnchorElement>,
    url: string
) => {
    event.preventDefault();
    skrivTilMalingFantDuIkkeDetDuLetteEtter();
    window.location.href = url;
};

const FantDuIkkeSvar = () => {
    return (
        <>
            <Normaltekst>
                <Lenke
                    href="https://www.nav.no/person/kontakt-oss/chat/arbeidsgiver"
                    onClick={(
                        event: React.MouseEvent<MouseEvent | HTMLAnchorElement>
                    ) =>
                        brukerFantIkkeSvar(
                            event,
                            'https://www.nav.no/person/kontakt-oss/chat/arbeidsgiver'
                        )
                    }
                >
                    Chat med NAV om permittering
                </Lenke>
            </Normaltekst>
            <br />
        </>
    );
};

export default FantDuIkkeSvar;
