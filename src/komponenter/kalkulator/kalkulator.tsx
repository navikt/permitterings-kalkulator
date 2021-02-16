import React, { useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Element, Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Permitteringsperiode from './Permitteringsperiode/Permitteringsperiode';
import Utregningskolonne from './Uregningskolonne/Utregningskolonne';
import Fraværsperioder from './Permitteringsperiode/Fraværsperioder/Fraværsperioder';
import {
    finnDato18MndTilbake,
    finnUtOmDefinnesOverlappendePerioder
} from './utregninger';
import Tidslinje from './Tidslinje/Tidslinje';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import Topp from './Topp/Topp';

export const ARBEIDSGIVERPERIODE2DATO = new Date('2021-03-01')

export interface DatoIntervall {
    datoFra: Date | undefined
    datoTil: Date | undefined
}

export interface AllePermitteringerOgFraværesPerioder {
    permitteringer: DatoIntervall[],
    andreFraværsperioder: DatoIntervall[];
}

const Kalkulator = () => {
    const [allePermitteringerOgFraværesPerioder, setAllePermitteringerOgFraværesPerioder] = useState<AllePermitteringerOgFraværesPerioder>({permitteringer:[{ datoFra:finnDato18MndTilbake(new Date()),datoTil: undefined}], andreFraværsperioder: []})
    const [enPermitteringAlleredeLøpende, setEnPermitteringAlleredeLøpende] = useState(false)
    const [etFraværAlleredeLøpende, setFraværAlleredeFraværLøpende] = useState(false)

    const [beskjedOverlappendePermittering,setBeskjedOverlappendePermittering] = useState('');
    const [beskjedOverlappendeFravær,setBeskjedOverlappendeFravær] = useState('');
    //const [beskjedPerioderUtenfor18mnd,setBeskjedPerioderUtenfor18mnd] = useState('');

    const [sisteDagI18mndsPeriode, setSisteDagI18mndsPeriode] = useState(new Date())

    useEffect(() => {
        if (finnUtOmDefinnesOverlappendePerioder(allePermitteringerOgFraværesPerioder.permitteringer)) {
            setBeskjedOverlappendePermittering('Du kan ikke ha overlappende permitteringsperioder')
        }
        else {
            setBeskjedOverlappendePermittering('')
        }
        if (finnUtOmDefinnesOverlappendePerioder(allePermitteringerOgFraværesPerioder.andreFraværsperioder)) {
            setBeskjedOverlappendeFravær('Du kan ikke ha overlappende fraværsperioder')
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
                                  key={indeks.toString()}
            />
        );
    })

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'} />
            <div className={'kalkulator'}>
                <div className={'kalkulator__utfyllingskolonne'} id = {'kalkulator-utfyllingskolonne'}>
                    <Systemtittel>Få oversikt over permitteringsperioder</Systemtittel>
                    <Topp sisteDagIPeriode={sisteDagI18mndsPeriode} set18mndsPeriode={setSisteDagI18mndsPeriode}/>
                    <div className={'kalkulator__permitteringsobjekter'}>
                        <Ingress>Legg inn dato fra første permittering</Ingress>
                        <div className={'kalkulator__overskrift-med-hjelpetekst'}>
                        <Normaltekst >
                            Fra første dag etter lønnsplikt
                        </Normaltekst>
                        <Hjelpetekst>
                            Som arbeidsgiver skal du betale lønn til dine permitterte i lønnspliktperioden.
                            Disse dagene telles ikke med i beregningen.
                        </Hjelpetekst>
                            </div>
                        {permitteringsobjekter}
                        <Element className={'kalkulator__feilmelding'}>{beskjedOverlappendePermittering}</Element>
                    </div>
                    <div className={'kalkulator__fraværsperioder'}>
                    <Fraværsperioder
                        etFraværAlleredeLøpende={etFraværAlleredeLøpende}
                        setFraværAlleredeLøpende={setFraværAlleredeFraværLøpende}
                        setAllePermitteringerOgFraværesPerioder={setAllePermitteringerOgFraværesPerioder}
                        allePermitteringerOgFraværesPerioder={allePermitteringerOgFraværesPerioder}
                    />
                    <Element className={'kalkulator__feilmelding'}>{beskjedOverlappendeFravær}</Element>
                        <div className={'kalkulator__tidslinje-wrapper'} id={'kalkulator-idslinje-wrapper'}>
                        <Tidslinje sisteDagIPeriode={sisteDagI18mndsPeriode} set18mndsPeriode={setSisteDagI18mndsPeriode} allePermitteringerOgFraværesPerioder={allePermitteringerOgFraværesPerioder}/>
                        </div>
                    </div>
                </div>
                <div className={'kalkulator__utregningskolonne'} >
                <Utregningskolonne sisteDagIPeriode={sisteDagI18mndsPeriode} allePermitteringerOgFraværesPerioder={allePermitteringerOgFraværesPerioder}/>
            </div>
            </div>
        </div>
    );
};

export default Kalkulator;