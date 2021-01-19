import React, { FunctionComponent } from 'react';
import './Utregningskolonne.less';
import { Element } from 'nav-frontend-typografi';

import { PermitteringsperiodeInfo } from '../kalkulator';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';
import { regnUtDatoAGP2, regnUtTotalAntallDager } from '../utregninger';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';

interface UtregningskolonneProps  {
    listeMedPermitteringsinfo: PermitteringsperiodeInfo[]
}

const Utregningskolonne:FunctionComponent<UtregningskolonneProps> = props => {



    const enkeltUtregninger = props.listeMedPermitteringsinfo.map( (enkeltutregning, index) => {
        return (
            <UtregningAvEnkelPeriode
                info={enkeltutregning}
                indeks={index}
                listeMedPermitteringsinfo={props.listeMedPermitteringsinfo}
            />

        );
    })

    const antallDager = regnUtTotalAntallDager(props.listeMedPermitteringsinfo)

    return (
        <div className={'utregningskolonne'}>
            {enkeltUtregninger}
            <div className={'utregningskolonne__total-alle-perioder'}>
                <Element>totalt antall dager</Element>
                <Element className={'utregningskolonne__svar'}>
                    {antallDager}
                </Element>
            </div>
            {antallDager>0 && <Element>Arbeidsgiverperiode 2 starter: {skrivOmDato(regnUtDatoAGP2(antallDager))}</Element>}
        </div>
    );
};

export default Utregningskolonne;