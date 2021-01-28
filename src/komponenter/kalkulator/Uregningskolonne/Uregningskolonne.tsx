import React, { FunctionComponent, useState } from 'react';
import './Utregningskolonne.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { AllePermitteringerOgFraværesPerioder } from '../kalkulator';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';
import { antallUkerRundetOpp, regnUtDatoAGP2 } from '../utregninger';
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
                <Normaltekst>Permittert i</Normaltekst>
                <Element>
                    {`${dagerTilsammen} dager (${antallUkerRundetOpp(dagerTilsammen)} uker)`}
                </Element>
                {dagerTilsammen>0 &&
                <>
                    {dagerTilsammen>49*7 &&
                    <Element>{`Du har hatt permittertie i ${antallUkerRundetOpp(dagerTilsammen)} uker.
                    Du har lønnsplikt etter 49, så du må betale ut lønn`
                    }
                    </Element>
                    }
                    <Normaltekst>Arbeidsgiverperiode 2 inntreffer</Normaltekst>
                    <Element>{skrivOmDato(regnUtDatoAGP2(dagerTilsammen))}</Element>
                </>}
            </div>
        </div>
    );
};

export default Utregningskolonne;