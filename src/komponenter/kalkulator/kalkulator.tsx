import React, { useContext, useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import {
    Element,
    Normaltekst,
    Systemtittel,
    Undertittel,
} from 'nav-frontend-typografi';
import Permitteringsperiode from './Permitteringsperiode/Permitteringsperiode';
import Utregningskolonne from './Uregningskolonne/Utregningskolonne';
import Fraværsperioder from './Permitteringsperiode/Fraværsperioder/Fraværsperioder';
import { AllePermitteringerOgFraværesPerioder } from './typer';
import {
    antalldagerGått,
    datoIntervallErDefinert,
    finnUtOmDefinnesOverlappendePerioder,
    getDefaultPermitteringsperiode,
    finnGrenserFor18MNDPeriode,
} from './utregninger';
import Tidslinje from './Tidslinje/Tidslinje';
import { fraPixelTilProsent } from './Tidslinje/tidslinjefunksjoner';
import Topp from './Topp/Topp';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import AlertStripe from 'nav-frontend-alertstriper';
import { PermitteringContext } from '../ContextProvider';

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
        beskjedOverlappendePermittering,
        setBeskjedOverlappendePermittering,
    ] = useState('');
    const [beskjedOverlappendeFravær, setBeskjedOverlappendeFravær] = useState(
        ''
    );

    const [sisteDagI18mndsPeriode, setSisteDagI18mndsPeriode] = useState(
        dagensDato
    );

    useEffect(() => {
        if (
            finnUtOmDefinnesOverlappendePerioder(
                allePermitteringerOgFraværesPerioder.permitteringer
            )
        ) {
            setBeskjedOverlappendePermittering(
                'Du kan ikke ha overlappende permitteringsperioder'
            );
        } else {
            setBeskjedOverlappendePermittering('');
        }
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
    }, [
        allePermitteringerOgFraværesPerioder,
        beskjedOverlappendeFravær,
        beskjedOverlappendePermittering,
    ]);

    const permitteringsobjekter = allePermitteringerOgFraværesPerioder.permitteringer.map(
        (permitteringsperiode, indeks) => {
            return (
                <Permitteringsperiode
                    indeks={indeks}
                    allePermitteringerOgFraværesPerioder={
                        allePermitteringerOgFraværesPerioder
                    }
                    info={permitteringsperiode}
                    setAllePermitteringerOgFraværesPerioder={
                        setAllePermitteringerOgFraværesPerioder
                    }
                    key={indeks.toString()}
                />
            );
        }
    );

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'} />
            <div className={'kalkulator'}>
                <div
                    className={'kalkulator__utfyllingskolonne'}
                    id={'kalkulator-utfyllingskolonne'}
                >
                    <Systemtittel>
                        Få oversikt over permitteringsperioder
                    </Systemtittel>
                    <Topp
                        sisteDagIPeriode={sisteDagI18mndsPeriode}
                        set18mndsPeriode={setSisteDagI18mndsPeriode}
                        setEndringAv={setsteDagI18mndsPeriodeEndretAv}
                        endringAv={sisteDagI18mndsPeriodeEndretAv}
                    />
                    <div className={'kalkulator__permitteringsobjekter'}>
                        <Undertittel>
                            2. Legg inn permitteringsperiode for arbeidstaker
                        </Undertittel>
                        <Normaltekst className={'kalkulator__etter-lønnplikt'}>
                            Fra første dag etter lønnsplikt
                        </Normaltekst>
                        <Ekspanderbartpanel
                            tittel={
                                <Normaltekst>
                                    <strong>
                                        Om permittering og lønnsplikt
                                    </strong>
                                </Normaltekst>
                            }
                        >
                            <Normaltekst>
                                Dette skal du{' '}
                                <strong>
                                    {' '}
                                    ikke legge inn som permitteringsperiode
                                </strong>
                                <ul>
                                    <li>
                                        Arbeidsperioder i full stilling i mer
                                        enn 6 uker sammenhengende
                                    </li>
                                    <li>Permittering grunnet streik</li>
                                    <li>
                                        Perioder du betale permitteringslønn
                                    </li>
                                    <li>
                                        Klikk på lenken “- be om tilgang“ på
                                        tjenesten du trenger. Du kommer nå til
                                        Altinn.
                                    </li>
                                </ul>
                                <strong> Om lønnsplikt</strong>
                                <br />
                                Som arbeidsgiver skal du betale lønn til dine
                                permitterte i lønnspliktperioden. Disse dagene
                                telles ikke med i beregningen.
                            </Normaltekst>
                        </Ekspanderbartpanel>
                        {permitteringsobjekter}
                        <Element className={'kalkulator__feilmelding'}>
                            {beskjedOverlappendePermittering}
                        </Element>
                    </div>
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
                                            antalldagerGått(
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
