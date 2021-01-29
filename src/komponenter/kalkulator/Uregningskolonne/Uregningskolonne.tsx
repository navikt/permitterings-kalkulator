import React, { FunctionComponent } from 'react';
import './Utregningskolonne.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { AllePermitteringerOgFraværesPerioder } from '../kalkulator';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';
import {
    antallUkerRundetOpp,
    OversiktOverBrukteOgGjenværendeDager,
    regnUtDatoAGP2,
    sumPermitteringerOgFravær,
} from '../utregninger';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';

interface UtregningskolonneProps  {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const Utregningskolonne:FunctionComponent<UtregningskolonneProps> = props => {
    const oversiktOverDager: OversiktOverBrukteOgGjenværendeDager = sumPermitteringerOgFravær(props.allePermitteringerOgFraværesPerioder)

    const enkeltUtregninger = props.allePermitteringerOgFraværesPerioder.permitteringer.map( (permitteringsperiode, indeks) => {
        return (
            <UtregningAvEnkelPeriode
                permitteringsperiode={permitteringsperiode}
                indeks={indeks}
                allePermitteringerOgFraværesPerioder={props.allePermitteringerOgFraværesPerioder}
            />

        );
    })


    return (
        <div className={'utregningskolonne'}>
            {enkeltUtregninger}
            <div className={'utregningskolonne__total-alle-perioder'}>
                <Normaltekst>Permittert i</Normaltekst>
                <Element>
                    {`${oversiktOverDager.dagerPermittert} dager (${antallUkerRundetOpp(oversiktOverDager.dagerPermittert)} uker)`}
                </Element>
                {oversiktOverDager.dagerPermittert>0 &&
                <>
                    {oversiktOverDager.dagerPermittert>49*7 &&
                    <Element>{`Du har hatt permittertie i ${antallUkerRundetOpp(oversiktOverDager.dagerPermittert)} uker.
                    Du har lønnsplikt etter 49, så du må betale ut lønn`
                    }
                    </Element>
                    }
                    <Normaltekst>Arbeidsgiverperiode 2 inntreffer</Normaltekst>
                    <Element>{skrivOmDato(regnUtDatoAGP2(oversiktOverDager.dagerPermittert))}</Element>
                </>}
            </div>
        </div>
    );
};

export default Utregningskolonne;