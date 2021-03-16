import React, { useContext, useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Element, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import Utregningskolonne from './Uregningskolonne/Utregningskolonne';
import Fraværsperioder from './Permitteringsperiode/Fraværsperioder/Fraværsperioder';
import { AllePermitteringerOgFraværesPerioder } from './typer';
import {
    antallDagerGått,
    datoIntervallErDefinert,
    finnGrenserFor18MNDPeriode,
    finnUtOmDefinnesOverlappendePerioder,
    getDefaultPermitteringsperiode,
} from './utregninger';
import Tidslinje from './Tidslinje/Tidslinje';
import { fraPixelTilProsent } from './Tidslinje/tidslinjefunksjoner';
import Topp from './Topp/Topp';
import AlertStripe from 'nav-frontend-alertstriper';
import { PermitteringContext } from '../ContextProvider';
import { Dayjs } from 'dayjs';
import { Permitteringsperioder } from './Permitteringsperioder/Permitteringsperioder';

const Kalkulator = () => {
    const { dagensDato } = useContext(PermitteringContext);

    const [
        allePermitteringerOgFraværesPerioder,
        setAllePermitteringerOgFraværesPerioder,
    ] = useState<AllePermitteringerOgFraværesPerioder>({
        permitteringer: [getDefaultPermitteringsperiode(dagensDato)],
        andreFraværsperioder: [],
    });

    const [
        sisteDagI18mndsPeriodeEndretAv,
        setsteDagI18mndsPeriodeEndretAv,
    ] = useState<'datovelger' | 'tidslinje' | 'ingen'>('ingen');

    const [
        beskjedOverlappendeFravær,
        setBeskjedOverlappendeFravær,
    ] = useState<string>('');

    const [sisteDagI18mndsPeriode, setSisteDagI18mndsPeriode] = useState<Dayjs>(
        dagensDato
    );

    useEffect(() => {
        if (
            finnUtOmDefinnesOverlappendePerioder(
                allePermitteringerOgFraværesPerioder.andreFraværsperioder
            )
        ) {
            setBeskjedOverlappendeFravær(
                'Du kan ikke ha overlappende fraværsperioder'
            );
        } else {
            setBeskjedOverlappendeFravær('');
        }
    }, [allePermitteringerOgFraværesPerioder, beskjedOverlappendeFravær]);

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'}>Permitteringskalkulator</Banner>
            <div className={'kalkulator'}>
                <div
                    className={'kalkulator__utfyllingskolonne'}
                    id={'kalkulator-utfyllingskolonne'}
                >
                    <Systemtittel>
                        Lurer du på når du skal utbetale lønn under
                        permittering?
                    </Systemtittel>
                    <Topp />
                    <Permitteringsperioder
                        allePermitteringerOgFraværesPerioder={
                            allePermitteringerOgFraværesPerioder
                        }
                        setAllePermitteringerOgFraværesPerioder={
                            setAllePermitteringerOgFraværesPerioder
                        }
                    />
                    <div className={'kalkulator__fraværsperioder'}>
                        <Fraværsperioder
                            setAllePermitteringerOgFraværesPerioder={
                                setAllePermitteringerOgFraværesPerioder
                            }
                            allePermitteringerOgFraværesPerioder={
                                allePermitteringerOgFraværesPerioder
                            }
                        />
                        <Element className={'kalkulator__feilmelding'}>
                            {beskjedOverlappendeFravær}
                        </Element>
                        <div
                            className={'kalkulator__tidslinje-wrapper'}
                            id={'kalkulator-tidslinje-wrapper'}
                        >
                            {datoIntervallErDefinert(
                                allePermitteringerOgFraværesPerioder
                                    .permitteringer[0]
                            ) && (
                                <>
                                    <Undertittel>
                                        4. Beregningen vises i tidslinje
                                    </Undertittel>
                                    <Tidslinje
                                        setEndringAv={
                                            setsteDagI18mndsPeriodeEndretAv
                                        }
                                        endringAv={
                                            sisteDagI18mndsPeriodeEndretAv
                                        }
                                        breddeAvDatoObjektIProsent={fraPixelTilProsent(
                                            'kalkulator-tidslinje-wrapper',
                                            antallDagerGått(
                                                finnGrenserFor18MNDPeriode(
                                                    dagensDato
                                                ).datoFra,
                                                finnGrenserFor18MNDPeriode(
                                                    dagensDato
                                                ).datoTil
                                            )
                                        )}
                                        sisteDagIPeriode={
                                            sisteDagI18mndsPeriode
                                        }
                                        set18mndsPeriode={
                                            setSisteDagI18mndsPeriode
                                        }
                                        allePermitteringerOgFraværesPerioder={
                                            allePermitteringerOgFraværesPerioder
                                        }
                                    />
                                </>
                            )}
                        </div>
                        <AlertStripe type="info">
                            <strong>Forklaringer</strong>
                            <br />
                            <strong>Permitteringsdager:</strong>
                            <br />
                            kalenderdager arbeidstakeren har vært permittert
                            (ikke kun dagene arbeidstakeren ikke var på jobb)
                            <br />
                            <strong>Lønnspliktperiode:</strong>
                            <br />
                            Perioden arbeidsgiver har plikt til å betale ut
                            lønn, selv om arbeidstakeren er permittert.
                            Lønnspliktperiode omtales også som
                            arbeidsgiverperiode.
                        </AlertStripe>
                    </div>
                </div>
                <div className={'kalkulator__utregningskolonne'}>
                    <Utregningskolonne
                        sisteDagIPeriode={sisteDagI18mndsPeriode}
                        allePermitteringerOgFraværesPerioder={
                            allePermitteringerOgFraværesPerioder
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Kalkulator;
