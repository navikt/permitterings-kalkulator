import React, { useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Systemtittel } from 'nav-frontend-typografi';
import Permitteringsperiode from './Permitteringsperiode/Permittertingsperiode';
import { Knapp } from 'nav-frontend-knapper';
import Utregningskolonne from './Uregningskolonne/Uregningskolonne';

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

    const permitteringsobjekter = allePermitteringerOgFraværesPerioder.permitteringer.map((permitteringsperiode, indeks) => {
        return (
            <Permitteringsperiode indeks={indeks} allePermitteringerOgFraværesPerioder={allePermitteringerOgFraværesPerioder} info={permitteringsperiode} setAllePermitteringerOgFraværesPerioder={setAllePermitteringerOgFraværesPerioder} />
        );
    })

    const leggTilNyPermitteringsperiode = () => {
        const nyPeriode: DatoIntervall = {
                datoFra: undefined,
                datoTil: undefined
            }

        const kopiAvPermitterinsperioder = {...allePermitteringerOgFraværesPerioder};
        kopiAvPermitterinsperioder.permitteringer.push(nyPeriode)
        setAllePermitteringerOgFraværesPerioder(kopiAvPermitterinsperioder)
    }

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'} />
            <div className={'kalkulator'}>
                <div className={'kalkulator__utfyllingskolonne'}>
                    <Systemtittel>Beregning av arbeidsgiverperiode II </Systemtittel>
                    <div className={'kalkulator__permitteringsobjekter'}>
                        {permitteringsobjekter}
                    </div>
                    <Knapp className={'kalkulator__legg-til-knapp'} onClick={()=>leggTilNyPermitteringsperiode()}>+ legg til ny permitteringsperiode</Knapp>
                </div>
            </div>
        </div>
    );
};

export default Kalkulator;

/*<div className={'kalkulator__utregningskolonne'} >
                   <Utregningskolonne listeMedPermitteringsinfo={permitteringer}/>
                </div>

 */
