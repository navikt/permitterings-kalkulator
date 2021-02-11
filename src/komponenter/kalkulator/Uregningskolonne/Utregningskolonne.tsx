import React, { FunctionComponent } from 'react';
import './Utregningskolonne.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { AllePermitteringerOgFraværesPerioder } from '../kalkulator';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';
import {
    antallUkerRundetOpp,
    OversiktOverBrukteOgGjenværendeDager,
    sumPermitteringerOgFravær,
} from '../utregninger';

interface UtregningskolonneProps {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const Utregningskolonne: FunctionComponent<UtregningskolonneProps> = (
    props
) => {
    const oversiktOverDager: OversiktOverBrukteOgGjenværendeDager = sumPermitteringerOgFravær(
        props.allePermitteringerOgFraværesPerioder
    );

    const enkeltUtregninger = props.allePermitteringerOgFraværesPerioder.permitteringer.map(
        (permitteringsperiode, indeks) => {
            return (
                <UtregningAvEnkelPeriode
                    permitteringsperiode={permitteringsperiode}
                    indeks={indeks}
                    allePermitteringerOgFraværesPerioder={
                        props.allePermitteringerOgFraværesPerioder
                    }
                    key={indeks}
                />
            );
        }
    );

    const heleUkerPermittert = Math.floor(
        oversiktOverDager.dagerPermittert / 7
    );
    const restIDager = oversiktOverDager.dagerPermittert % 7;

    return (
        <div className={'utregningskolonne'}>
            {enkeltUtregninger}
            <div className={'utregningskolonne__total-alle-perioder'}>
                <Normaltekst>Permittert i</Normaltekst>
                <Element>
                    {`${heleUkerPermittert} uker og ${restIDager} dager`}
                </Element>
                {oversiktOverDager.dagerPermittert > 0 && (
                    <>
                        {oversiktOverDager.dagerPermittert > 49 * 7 && (
                            <Element>
                                {`Du har permittert i ${antallUkerRundetOpp(
                                    oversiktOverDager.dagerPermittert
                                )} uker.
                    Lønnsplikten har inntraff den (sett inn dato permitteringen ble overskredt)`}
                            </Element>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Utregningskolonne;
