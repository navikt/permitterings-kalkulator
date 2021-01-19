import React, { FunctionComponent } from 'react';
import './Utregningskolonne.less';
import { Element } from 'nav-frontend-typografi';

import { PermitteringsperiodeInfo } from '../kalkulator';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';
import { regnUtTotalAntallDager } from '../utregninger';

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

    return (
        <div className={'utregningskolonne'}>
            {enkeltUtregninger}
            <div className={'utregningskolonne__total-alle-perioder'}>
                <Element>totalt antall dager</Element>
                <Element className={'utregningskolonne__svar'}>
                    {regnUtTotalAntallDager(props.listeMedPermitteringsinfo)}
                </Element>

            </div>
        </div>
    );
};

export default Utregningskolonne;