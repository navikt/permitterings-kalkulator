import React, { FunctionComponent } from 'react';

import './MobilversjonKort.less';
import { DatoIntervall, DatoMedKategori } from '../../../typer';
import { formaterDatoIntervall } from '../../../utils/dato-utils';
import { getPermitteringsoversikt } from '../../../utils/beregningerForAGP2';
import AttributtVisning from './AttributtVisning/AttributtVisning';

interface Props {
    tidslinje: DatoMedKategori[];
    permitteringsperioderInnenfor18mndsperiode: DatoIntervall[];
}

const MobilversjonKort: FunctionComponent<Props> = ({
    tidslinje,
    permitteringsperioderInnenfor18mndsperiode,
}) => {
    return (
        <li
            className="mobilversjon-kort"
            aria-label={'liste med informasjon om enkelt arbeidsforhold'}
        >
            {permitteringsperioderInnenfor18mndsperiode.map(
                (periode, index) => {
                    const permitteringsoversikt = getPermitteringsoversikt(
                        tidslinje,
                        periode
                    );
                    return (
                        <div className="mobilversjon-kort__liste" role="list">
                            <AttributtVisning
                                attributt="Permitteringsperiode"
                                attributtVerdi={formaterDatoIntervall(periode)}
                            />
                            <AttributtVisning
                                attributt="Permittert"
                                attributtVerdi={
                                    permitteringsoversikt.dagerPermittert +
                                    ' dager'
                                }
                            />
                            <AttributtVisning
                                attributt="Fravær"
                                attributtVerdi={
                                    permitteringsoversikt.dagerAnnetFravær +
                                    ' dager'
                                }
                            />
                            <AttributtVisning
                                attributt="Permittert u/fravær"
                                attributtVerdi={
                                    permitteringsoversikt.dagerBrukt + ' dager'
                                }
                            />
                        </div>
                    );
                }
            )}
        </li>
    );
};

export default MobilversjonKort;
