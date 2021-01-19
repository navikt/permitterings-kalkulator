import React, { FunctionComponent, useEffect, useState } from 'react';
import '../kalkulator.less';

import { Normaltekst } from 'nav-frontend-typografi';
import { PermitteringsperiodeInfo } from '../kalkulator';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';

interface UtregningskolonneProps  {
    listeMedPermitteringsinfo: PermitteringsperiodeInfo[]
}

const Utregningskolonne:FunctionComponent<UtregningskolonneProps> = props => {

    const enkeltUtregninger = props.listeMedPermitteringsinfo.map( (enkeltutregning, index) => {
        return (
            <UtregningAvEnkelPeriode
                info={enkeltutregning}
                indeks={index}
            />

        );
    })

    return (
        <div className={'utregningskolonne'}>
            {enkeltUtregninger}
        </div>
    );
};

export default Utregningskolonne;