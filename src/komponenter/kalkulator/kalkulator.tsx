import React, { useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Undertittel } from 'nav-frontend-typografi';
import Permitteringsperiode from './Permitteringsperiode/Permittertingsperiode';
import { antalldagerGått, datoErFørMars } from './utregninger';

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

    console.log(permitteringer[0]);

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'} />
            <div className={'kalkulator-container'}>
                <Undertittel>Beregning av arbeidsgiverperiode 2 </Undertittel>
                <div className={'kalkulator__datovelgere'}>
                    {permitteringsobjekter}
                </div>
            </div>
        </div>
    );
};

export default Kalkulator;
