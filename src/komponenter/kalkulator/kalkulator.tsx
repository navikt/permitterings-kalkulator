import React, { useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Systemtittel } from 'nav-frontend-typografi';
import Permitteringsperiode from './Permitteringsperiode/Permittertingsperiode';
import { Knapp } from 'nav-frontend-knapper';

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
    const [permitteringer, setPermitteringer] = useState<PermitteringsperiodeInfo[]>([])

    useEffect(() => {
        const initialPermittering = {
            ...defaulPermitteringsobjekt
        }
        setPermitteringer([initialPermittering])
    }, []);

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

    console.log("rendrer", permitteringsobjekter)

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'} />
            <div className={'kalkulator-container'}>
                <Systemtittel>Beregning av arbeidsgiverperiode 2 </Systemtittel>
                <div className={'kalkulator__permitteringsobjekter'}>
                    {permitteringsobjekter}
                </div>
                <Knapp onClick={()=>leggTilNyPermitteringsperiode()}>legg til ny permitteringsperiode</Knapp>
            </div>
        </div>
    );
};

export default Kalkulator;
