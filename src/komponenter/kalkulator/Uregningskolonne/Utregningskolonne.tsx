import React, { FunctionComponent, useEffect, useState } from 'react';
import './Utregningskolonne.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    DatoMedKategori,
    OversiktOverBrukteOgGjenværendeDager,
} from '../typer';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';
import {
    finnDato18MndTilbake,
    kuttAvDatoIntervallInnefor18mnd,
} from '../utregninger';
import { Dayjs } from 'dayjs';
import { finnOversiktOverPermitteringOgFraværGitt18mnd } from '../beregningerForAGP2';

interface UtregningskolonneProps {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    sisteDagIPeriode: Dayjs;
    tidslinje: DatoMedKategori[];
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

    const [
        resultatUtregningAv18mndsPeriode,
        setResultatUtregningAv18mndsPeriode,
    ] = useState<OversiktOverBrukteOgGjenværendeDager>({
        dagerPermittert: 0,
        dagerAnnetFravær: 0,
        dagerGjenstående: 0,
        dagerBrukt: 0,
    });

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
    }, [props.allePermitteringerOgFraværesPerioder, props.sisteDagIPeriode]);

    useEffect(() => {
        setResultatUtregningAv18mndsPeriode(
            finnOversiktOverPermitteringOgFraværGitt18mnd(
                props.sisteDagIPeriode,
                props.tidslinje
            )
        );
    }, [
        oversiktOverPerioderInnenfor18mnd,
        props.sisteDagIPeriode,
        props.tidslinje,
    ]);

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
        resultatUtregningAv18mndsPeriode.dagerPermittert / 7
    );
    const restIDager = resultatUtregningAv18mndsPeriode.dagerPermittert % 7;

    return (
        <div className={'utregningskolonne'}>
            {enkeltUtregninger}
            <div className={'utregningskolonne__total-alle-perioder'}>
                <Normaltekst>Permittert i</Normaltekst>
                <Element>
                    {`${heleUkerPermittert} uker og ${restIDager} dager`}
                </Element>
                {resultatUtregningAv18mndsPeriode.dagerPermittert > 0 && (
                    <>
                        {resultatUtregningAv18mndsPeriode.dagerPermittert >
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
