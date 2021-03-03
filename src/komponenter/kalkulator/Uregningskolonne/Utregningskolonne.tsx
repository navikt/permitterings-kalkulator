import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import './Utregningskolonne.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    OversiktOverBrukteOgGjenværendeDager,
} from '../typer';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';
import {
    finnDato18MndTilbake,
    kuttAvDatoIntervallInnefor18mnd,
    sumPermitteringerOgFravær,
} from '../utregninger';

interface UtregningskolonneProps {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    sisteDagIPeriode: Date;
}

const Utregningskolonne: FunctionComponent<UtregningskolonneProps> = (
    props
) => {
    const [
        oversiktOverPerioderInnenfor18mnd,
        setOversiktOverPerioderInnenfor18mnd,
    ] = useState<AllePermitteringerOgFraværesPerioder>({
        andreFraværsperioder: [],
        permitteringer: [],
    });

    const resultatUtregningAv18mndsPeriode = useRef<OversiktOverBrukteOgGjenværendeDager>(
        {
            dagerPermittert: 0,
            dagerAnnetFravær: 0,
            dagerGjensående: 0,
        }
    );

    useEffect(() => {
        const avkuttet18mndPerioder: AllePermitteringerOgFraværesPerioder = {
            andreFraværsperioder:
                props.allePermitteringerOgFraværesPerioder.andreFraværsperioder,
            permitteringer: [],
        };
        props.allePermitteringerOgFraværesPerioder.permitteringer.forEach(
            (periode) => {
                const kuttetDatoIntervall: DatoIntervall = kuttAvDatoIntervallInnefor18mnd(
                    periode,
                    finnDato18MndTilbake(props.sisteDagIPeriode),
                    props.sisteDagIPeriode
                );
                avkuttet18mndPerioder.permitteringer.push(kuttetDatoIntervall);
            }
        );
        setOversiktOverPerioderInnenfor18mnd(avkuttet18mndPerioder);
        resultatUtregningAv18mndsPeriode.current = sumPermitteringerOgFravær(
            oversiktOverPerioderInnenfor18mnd
        );
    }, [props.allePermitteringerOgFraværesPerioder, props.sisteDagIPeriode]);

    const enkeltUtregninger = oversiktOverPerioderInnenfor18mnd.permitteringer.map(
        (permitteringsperiode, indeks) => {
            return (
                <UtregningAvEnkelPeriode
                    permitteringsperiode={permitteringsperiode}
                    indeks={indeks}
                    allePermitteringerOgFraværesPerioder={
                        oversiktOverPerioderInnenfor18mnd
                    }
                    key={indeks}
                />
            );
        }
    );

    const heleUkerPermittert = Math.floor(
        resultatUtregningAv18mndsPeriode.current.dagerPermittert / 7
    );
    const restIDager =
        resultatUtregningAv18mndsPeriode.current.dagerPermittert % 7;

    return (
        <div className={'utregningskolonne'}>
            {enkeltUtregninger}
            <div className={'utregningskolonne__total-alle-perioder'}>
                <Normaltekst>Permittert i</Normaltekst>
                <Element>
                    {`${heleUkerPermittert} uker og ${restIDager} dager`}
                </Element>
                {resultatUtregningAv18mndsPeriode.current.dagerPermittert >
                    0 && (
                    <>
                        {resultatUtregningAv18mndsPeriode.current
                            .dagerPermittert >
                            49 * 7 && (
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
