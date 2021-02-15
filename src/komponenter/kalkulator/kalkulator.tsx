import React, { useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Element, Ingress, Normaltekst } from 'nav-frontend-typografi';
import Permitteringsperiode from './Permitteringsperiode/Permitteringsperiode';
import Utregningskolonne from './Uregningskolonne/Utregningskolonne';
import Fraværsperioder from './Permitteringsperiode/Fraværsperioder/Fraværsperioder';
import {
    finnTidligstePermitteringsdato,
    finnUtOmDefinnesOverlappendePerioder,
} from './utregninger';
import Tidslinje from './Tidslinje/Tidslinje';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import KalkulatorInfoTekst from './KalkulatorInfoTekst';

export const ARBEIDSGIVERPERIODE2DATO = new Date('2021-03-01');

export interface DatoIntervall {
    datoFra: Date | undefined;
    datoTil: Date | undefined;
}

export interface AllePermitteringerOgFravaerPerioder {
    permitteringer: DatoIntervall[];
    andreFraværsperioder: DatoIntervall[];
}

const Kalkulator = () => {
    const [
        allePermitteringerOgFraværesPerioder,
        setAllePermitteringerOgFraværesPerioder,
    ] = useState<AllePermitteringerOgFravaerPerioder>({
        permitteringer: [{ datoFra: undefined, datoTil: undefined }],
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
        beskjedOverlappendePermittering,
        setBeskjedOverlappendePermittering,
    ] = useState('');
    const [beskjedOverlappendeFravær, setBeskjedOverlappendeFravær] = useState(
        ''
    );

    const [førsteDagI18mndsPeriode, setFørsteDagI18mndsPeriode] = useState<
        undefined | Date
    >(undefined);

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

    useEffect(() => {
        const førstepermitteringsDag = finnTidligstePermitteringsdato(
            allePermitteringerOgFraværesPerioder.permitteringer
        );
        if (førstepermitteringsDag) {
            setFørsteDagI18mndsPeriode(førstepermitteringsDag);
        }
    }, [allePermitteringerOgFraværesPerioder]);

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
                <div className={'kalkulator__utfyllingskolonne'}>
                    <KalkulatorInfoTekst
                        førsteDagI18mndsPeriode={førsteDagI18mndsPeriode}
                    />
                    <div className={'kalkulator__permitteringsobjekter'}>
                        <Ingress>Legg inn dato fra første permittering</Ingress>
                        <div
                            className={'kalkulator__overskrift-med-hjelpetekst'}
                        >
                            <Normaltekst>
                                Fra første dag etter lønnsplikt
                            </Normaltekst>
                            <Hjelpetekst>
                                Som arbeidsgiver skal du betale lønn til dine
                                permitterte i lønnspliktperioden. Disse dagene
                                telles ikke med i beregningen.
                            </Hjelpetekst>
                        </div>
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
                        <Tidslinje
                            allePermitteringerOgFraværesPerioder={
                                allePermitteringerOgFraværesPerioder
                            }
                        />
                    </div>
                </div>
                <div className={'kalkulator__utregningskolonne'}>
                    <Utregningskolonne
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
