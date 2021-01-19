import React, { useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Systemtittel } from 'nav-frontend-typografi';
import Permitteringsperiode from './Permitteringsperiode/Permittertingsperiode';
import { Knapp } from 'nav-frontend-knapper';
import Utregningskolonne from './Uregningskolonne/Uregningskolonne';

export interface PermitteringsperiodeInfo {
    datoFra: Date|undefined,
    datoTil: Date|undefined,
    antallDagerSykmeldt: number,
    antallDagerPErmisjonOgFerie: number,
}

const defaulPermitteringsobjekt: PermitteringsperiodeInfo = {
    datoTil: undefined,
    datoFra: undefined,
    antallDagerSykmeldt: 0,
    antallDagerPErmisjonOgFerie: 0
}


const Kalkulator = () => {
    const [permitteringer, setPermitteringer] = useState<PermitteringsperiodeInfo[]>([{...defaulPermitteringsobjekt}])

    const permitteringsobjekter = permitteringer.map((info, indeks) => {
        return (
            <Permitteringsperiode indeks={indeks} allePermitteringer={permitteringer} info={info} setAllePermitteringer={setPermitteringer} />
        );
    })

    const leggTilNyPermitteringsperiode = () => {
        const nyPeriode = {...defaulPermitteringsobjekt};
        const permitteringerKopi = [...permitteringer]
        permitteringerKopi.push(nyPeriode)
        setPermitteringer(permitteringerKopi)
    }

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'} />
            <div className={'kalkulator'}>
                <div className={'kalkulator__utfyllingskolonne'}>
                    <Systemtittel>Beregning av arbeidsgiverperiode 2 </Systemtittel>
                    <div className={'kalkulator__permitteringsobjekter'}>
                        {permitteringsobjekter}
                    </div>
                    <Knapp className={'kalkulator__legg-til-knapp'} onClick={()=>leggTilNyPermitteringsperiode()}>+ legg til ny permitteringsperiode</Knapp>
                </div>
                <div className={'kalkulator__utregningskolonne'} >
                   <Utregningskolonne listeMedPermitteringsinfo={permitteringer}/>
                </div>
            </div>
        </div>
    );
};

export default Kalkulator;
