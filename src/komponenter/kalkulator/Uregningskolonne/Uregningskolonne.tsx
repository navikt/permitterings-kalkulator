import React, { FunctionComponent, useState } from 'react';
import './Utregningskolonne.less';
import { Element } from 'nav-frontend-typografi';

import { AllePermitteringerOgFraværesPerioder, PermitteringsperiodeInfo } from '../kalkulator';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';
import { regnUtDatoAGP2, regnUtTotalAntallDager } from '../utregninger';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';

interface UtregningskolonneProps  {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const Utregningskolonne:FunctionComponent<UtregningskolonneProps> = props => {
    const [dagerTilsammen, setDagerTilsammen] = useState(0)

    const enkeltUtregninger = props.allePermitteringerOgFraværesPerioder.permitteringer.map( (permitteringsperiode, indeks) => {
        return (
            <UtregningAvEnkelPeriode
                dagerTilsammen={dagerTilsammen}
                permitteringsperiode={permitteringsperiode}
                indeks={indeks}
                allePermitteringerOgFraværesPerioder={props.allePermitteringerOgFraværesPerioder}
                setDagerTilsammen = {setDagerTilsammen}
            />

        );
    })


    return (
        <div className={'utregningskolonne'}>
            {enkeltUtregninger}
            <div className={'utregningskolonne__total-alle-perioder'}>
                <Element>totalt antall dager</Element>
                <Element className={'utregningskolonne__svar'}>
                    {dagerTilsammen}
                </Element>
            </div>
            {dagerTilsammen>0 && <Element>Arbeidsgiverperiode 2 starter: {skrivOmDato(regnUtDatoAGP2(dagerTilsammen))}</Element>}
        </div>
    );
};

export default Utregningskolonne;