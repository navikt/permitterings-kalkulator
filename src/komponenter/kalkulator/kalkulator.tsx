import React, { useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Element, Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Permitteringsperiode from './Permitteringsperiode/Permittertingsperiode';
import Utregningskolonne from './Uregningskolonne/Uregningskolonne';
import Fraværsperioder from './Permitteringsperiode/Fraværsperioder/Fraværsperioder';
import { finnUtOmDefinnesOverlappendePerioder } from './utregninger';

export const ARBEIDSGIVERPERIODE2DATO = new Date('2021-03-01')

export interface DatoIntervall {
    datoFra: Date | undefined
    datoTil: Date | undefined
}

export interface PermitteringsperiodeInfo {
    permitteringsIntervall: DatoIntervall;
    andreFraværsIntervall: DatoIntervall[];
}

export interface AllePermitteringerOgFraværesPerioder {
    permitteringer: DatoIntervall[],
    andreFraværsperioder: DatoIntervall[];
}

const Kalkulator = () => {
    const [allePermitteringerOgFraværesPerioder, setAllePermitteringerOgFraværesPerioder] = useState<AllePermitteringerOgFraværesPerioder>({permitteringer:[{ datoFra:undefined,datoTil: undefined}], andreFraværsperioder: []})
    const [enPermitteringAlleredeLøpende, setEnPermitteringAlleredeLøpende] = useState(false)
    const [etFraværAlleredeLøpende, setFraværAlleredeFraværLøpende] = useState(false)

    const [beskjedOverlappendePermittering,setBeskjedOverlappendePermittering] = useState('');
    const [beskjedOverlappendeFravær,setBeskjedOverlappendeFravær] = useState('');

    useEffect(() => {
        if (finnUtOmDefinnesOverlappendePerioder(allePermitteringerOgFraværesPerioder.permitteringer)) {
            setBeskjedOverlappendePermittering('Du kan ikke ha overlappende permitteringsperioder')
        }
        else {
            setBeskjedOverlappendePermittering('')
        }
        if (finnUtOmDefinnesOverlappendePerioder(allePermitteringerOgFraværesPerioder.andreFraværsperioder)) {
            setBeskjedOverlappendePermittering('Du kan ikke ha overlappende fraværsperioder')
        }
        else {
            setBeskjedOverlappendeFravær('')
        }

    },[allePermitteringerOgFraværesPerioder, beskjedOverlappendeFravær, beskjedOverlappendePermittering] );

    const permitteringsobjekter = allePermitteringerOgFraværesPerioder.permitteringer.map((permitteringsperiode, indeks) => {
        return (
            <Permitteringsperiode enPermitteringAlleredeLøpende={enPermitteringAlleredeLøpende} indeks={indeks}
                                  setEnPermitteringAlleredeLøpende={setEnPermitteringAlleredeLøpende}
                                  allePermitteringerOgFraværesPerioder={allePermitteringerOgFraværesPerioder} info={permitteringsperiode}
                                  setAllePermitteringerOgFraværesPerioder={setAllePermitteringerOgFraværesPerioder}
            />
        );
    })

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'} />
            <div className={'kalkulator'}>
                <div className={'kalkulator__utfyllingskolonne'}>
                    <Systemtittel>Når treffer arbeidsgiver 2 dine ansatte?</Systemtittel>
                    <div className={'kalkulator__permitteringsobjekter'}>
                        <Ingress>Legg inn dato fra første permittering</Ingress>
                        <Normaltekst>Fra første dag etter lønnsplikt</Normaltekst>
                        {permitteringsobjekter}
                        <Element className={'kalkulator__feilmelding'}>{beskjedOverlappendePermittering}</Element>
                    </div>
                    <Fraværsperioder
                        etFraværAlleredeLøpende={etFraværAlleredeLøpende}
                        setFraværAlleredeLøpende={setFraværAlleredeFraværLøpende}
                        setAllePermitteringerOgFraværesPerioder={setAllePermitteringerOgFraværesPerioder}
                        allePermitteringerOgFraværesPerioder={allePermitteringerOgFraværesPerioder}
                    />
                    <Element className={'kalkulator__feilmelding'}>{beskjedOverlappendeFravær}</Element>
                </div>
                <div className={'kalkulator__utregningskolonne'} >
                <Utregningskolonne allePermitteringerOgFraværesPerioder={allePermitteringerOgFraværesPerioder}/>
            </div>
            </div>
        </div>
    );
};

export default Kalkulator;