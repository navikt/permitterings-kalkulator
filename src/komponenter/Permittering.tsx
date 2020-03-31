import React from 'react';
import BEMHelper from '../utils/bem';
import Banner from './banner/Banner';
import Oversikt from './oversikt/Oversikt';
import Infoseksjon from './Infoseksjon';
import './permittering.less';

const permittering = BEMHelper('permittering');

const Permittering = () => {
    return (
        <div className={permittering.className}>
            <Banner classname="banner" />
            <div className={permittering.element('wrapper')}>
                <Oversikt className={permittering.className} />
                <Infoseksjon className={permittering.className}>Test</Infoseksjon>
            </div>
        </div>
    );
};

export default Permittering;
