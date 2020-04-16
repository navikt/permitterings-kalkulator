import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';

const SkyldesPermitteringBrann = () => {
    return (
        <>
            <Normaltekst>
                Skyldes permitteringen brann, ulykker eller naturomstendigheter,
                er det ingen lønnspliktperiode. Les mer om frister{' '}
                <Lenke href="https://lovdata.no/dokument/NL/lov/2005-06-17-62/KAPITTEL_17#%C2%A715-3">
                    i Arbeidsmiljøloven
                </Lenke>
            </Normaltekst>
        </>
    );
};

export default SkyldesPermitteringBrann;
