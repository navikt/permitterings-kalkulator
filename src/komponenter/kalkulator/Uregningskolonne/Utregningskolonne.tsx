import React, { FunctionComponent } from 'react';
import './Utregningskolonne.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { AllePermitteringerOgFraværesPerioder } from '../kalkulator';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';
import {
    finnDato18MndTilbake,
    kuttAvDatoIntervallInnefor18mnd,
    OversiktOverBrukteOgGjenværendeDager,
    sumPermitteringerOgFravær,
} from '../utregninger';

interface UtregningskolonneProps {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    sisteDagIPeriode: Date;
}

const Utregningskolonne: FunctionComponent<UtregningskolonneProps> = (
    props
) => {
    const overSiktOverPerioderInnenfor18mnd: AllePermitteringerOgFraværesPerioder = {
        andreFraværsperioder:
            props.allePermitteringerOgFraværesPerioder.andreFraværsperioder,
        permitteringer: [],
    };
    props.allePermitteringerOgFraværesPerioder.permitteringer.forEach(
        (periode) => {
            const kuttetDatoIntervall = kuttAvDatoIntervallInnefor18mnd(
                periode,
                finnDato18MndTilbake(props.sisteDagIPeriode),
                props.sisteDagIPeriode
            );
            overSiktOverPerioderInnenfor18mnd.permitteringer.push(
                kuttetDatoIntervall
            );
        }
    );
    const oversiktOverDager: OversiktOverBrukteOgGjenværendeDager = sumPermitteringerOgFravær(
        overSiktOverPerioderInnenfor18mnd,
        props.sisteDagIPeriode
    );

    const enkeltUtregninger = overSiktOverPerioderInnenfor18mnd.permitteringer.map(
        (permitteringsperiode, indeks) => {
            return (
                <UtregningAvEnkelPeriode
                    permitteringsperiode={permitteringsperiode}
                    indeks={indeks}
                    allePermitteringerOgFraværesPerioder={
                        overSiktOverPerioderInnenfor18mnd
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
                                {'Permitteringen overskrider 49 uker'}
                            </Element>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Utregningskolonne;
