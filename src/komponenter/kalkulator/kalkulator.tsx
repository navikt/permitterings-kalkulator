import React from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Undertittel } from 'nav-frontend-typografi';
import Permitteringsperiode from './Permitteringsperiode/Permittertingsperiode';


const Kalkulator = () => {

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'} />
            <div className={'kalkulator-container'}>
                <Undertittel>Beregning av arbeidsgiverperiode 2 </Undertittel>
                <div className={'kalkulator__datovelgere'}>
                    <Permitteringsperiode/>
                </div>
            </div>
        </div>
    );
};

export default Kalkulator;
