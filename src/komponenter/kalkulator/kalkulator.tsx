import React, { useEffect, useState } from 'react';
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
import {
    antalldagerGått,
    datoIntervallErDefinert,
    finnDato18MndTilbake,
    finnUtOmDefinnesOverlappendePerioder,
} from './utregninger';
import Tidslinje, { fraPixelTilProsent } from './Tidslinje/Tidslinje';
import Topp from './Topp/Topp';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import AlertStripe from 'nav-frontend-alertstriper';
import { skrivOmDato } from '../Datovelger/datofunksjoner';

export const ARBEIDSGIVERPERIODE2DATO = new Date('2021-03-01');

export interface DatoIntervall {
    datoFra: Date | undefined;
    datoTil: Date | undefined;
}

export interface AllePermitteringerOgFraværesPerioder {
    permitteringer: DatoIntervall[];
    andreFraværsperioder: DatoIntervall[];
}

const dagensDato = new Date();
const bakover18mnd = finnDato18MndTilbake(dagensDato);
const maksGrenseIBakoverITid = new Date(bakover18mnd);
maksGrenseIBakoverITid.setDate(maksGrenseIBakoverITid.getDate() - 56);
const maksGrenseFramoverITid = new Date(dagensDato);
maksGrenseFramoverITid.setDate(maksGrenseFramoverITid.getDate() + 56);
export const GRENSERFOR18MNDPERIODE: DatoIntervall = {
    datoFra: maksGrenseIBakoverITid,
    datoTil: maksGrenseFramoverITid,
};

const Kalkulator = () => {
    const [
        allePermitteringerOgFraværesPerioder,
        setAllePermitteringerOgFraværesPerioder,
    ] = useState<AllePermitteringerOgFraværesPerioder>({
        permitteringer: [
            { datoFra: finnDato18MndTilbake(new Date()), datoTil: undefined },
        ],
        andreFraværsperioder: [],
    });
    const [
        enPermitteringAlleredeLøpende,
        setEnPermitteringAlleredeLøpende,
    ] = useState(false);
    const [etFraværAlleredeLøpende, setFraværAlleredeFraværLøpende] = useState(
        false
    );

    const [
        sisteDagI18mndsPeriodeEndretAv,
        setsteDagI18mndsPeriodeEndretAv,
    ] = useState<'datovelger' | 'tidslinje'>('datovelger');
    const [
        beskjedOverlappendePermittering,
        setBeskjedOverlappendePermittering,
    ] = useState('');
    const [beskjedOverlappendeFravær, setBeskjedOverlappendeFravær] = useState(
        ''
    );

    const [sisteDagI18mndsPeriode, setSisteDagI18mndsPeriode] = useState(
        new Date()
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
                    enPermitteringAlleredeLøpende={
                        enPermitteringAlleredeLøpende
                    }
                    indeks={indeks}
                    setEnPermitteringAlleredeLøpende={
                        setEnPermitteringAlleredeLøpende
                    }
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
                                        Perioder du betalr permitteringslønn
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
                            etFraværAlleredeLøpende={etFraværAlleredeLøpende}
                            setFraværAlleredeLøpende={
                                setFraværAlleredeFraværLøpende
                            }
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
                                <Tidslinje
                                    setEndringAv={
                                        setsteDagI18mndsPeriodeEndretAv
                                    }
                                    endringAv={sisteDagI18mndsPeriodeEndretAv}
                                    breddeAvDatoObjektIProsent={fraPixelTilProsent(
                                        'kalkulator-tidslinje-wrapper',
                                        antalldagerGått(
                                            GRENSERFOR18MNDPERIODE.datoFra,
                                            GRENSERFOR18MNDPERIODE.datoTil
                                        )
                                    )}
                                    sisteDagIPeriode={sisteDagI18mndsPeriode}
                                    set18mndsPeriode={setSisteDagI18mndsPeriode}
                                    allePermitteringerOgFraværesPerioder={
                                        allePermitteringerOgFraværesPerioder
                                    }
                                />
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
