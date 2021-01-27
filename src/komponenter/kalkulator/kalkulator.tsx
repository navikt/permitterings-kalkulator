import React, { useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Element, Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Permitteringsperiode from './Permitteringsperiode/Permittertingsperiode';
import Utregningskolonne from './Uregningskolonne/Uregningskolonne';
import Fraværsperioder from './Permitteringsperiode/Fraværsperioder/Fraværsperioder';
import {
    finnDato18MndFram,
    finnDato18MndSiden,
    finnTidligstePermitteringsdato,
    finnUtOmDefinnesOverlappendePerioder, settDatoerInnenforRiktigIntervall,
} from './utregninger';
import { skrivOmDato } from '../Datovelger/datofunksjoner';

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
    const [beskjedPerioderUtenfor18mnd,setBeskjedPerioderUtenfor18mnd] = useState('');

    const [førsteDagI18mndsPeriode, setFørsteDagI18mndsPeriode] = useState<undefined|Date>(undefined)

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

    useEffect(() => {
        if (førsteDagI18mndsPeriode && allePermitteringerOgFraværesPerioder.permitteringer.length) {
            const oppdatertPermitteringsListe = settDatoerInnenforRiktigIntervall(allePermitteringerOgFraværesPerioder.permitteringer, førsteDagI18mndsPeriode)
            if (oppdatertPermitteringsListe.length) {
                const kopiAvAllePermitteringerOgFraværesPerioder = {...allePermitteringerOgFraværesPerioder}
                kopiAvAllePermitteringerOgFraværesPerioder.permitteringer = oppdatertPermitteringsListe
                setAllePermitteringerOgFraværesPerioder(kopiAvAllePermitteringerOgFraværesPerioder);
                setBeskjedPerioderUtenfor18mnd('Du har perioder utenfor 18 mnd')
            }
        }
    },[allePermitteringerOgFraværesPerioder, førsteDagI18mndsPeriode] );

    useEffect(() => {
       const førstepermitteringsDag = finnTidligstePermitteringsdato(allePermitteringerOgFraværesPerioder.permitteringer)
        if (førstepermitteringsDag) {
            setFørsteDagI18mndsPeriode(førstepermitteringsDag)
        }

    },[allePermitteringerOgFraværesPerioder] );

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
                    <Normaltekst>
                        Fra 1. november 2020 økte maksperioden en arbeidsgiver kan fritas fra sin
                        lønnsplikt innenfor en periode på 18 måneder, fra 26 til 49 uker.
                        Her kan du regne ut hvor mange uker du har permittert dine ansatte, og hvor mye du har igjen. Hvilken tidsperiode som gjelder
                        for deg finner du ved å fylle inn startdato fra din første permittering.
                    </Normaltekst>
                    { førsteDagI18mndsPeriode &&
                    <Element>Din 18 måneders periode begynte {skrivOmDato(førsteDagI18mndsPeriode)} og slutter {skrivOmDato(finnDato18MndFram(førsteDagI18mndsPeriode))}</Element>}
                    <div className={'kalkulator__permitteringsobjekter'}>
                        <Ingress>Legg inn dato fra første permittering</Ingress>
                        <Normaltekst>Fra første dag etter lønnsplikt</Normaltekst>
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
                    </div>
                    {beskjedPerioderUtenfor18mnd}
                </div>
                <div className={'kalkulator__utregningskolonne'} >
                <Utregningskolonne allePermitteringerOgFraværesPerioder={allePermitteringerOgFraværesPerioder}/>
            </div>
            </div>
        </div>
    );
};

export default Kalkulator;