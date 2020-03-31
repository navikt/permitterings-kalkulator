import React from 'react';
import BEMHelper from '../utils/bem';
import Banner from './banner/Banner';
import Oversikt from './oversikt/Oversikt';
import Infoseksjon from './infoseksjon/Infoseksjon';
import './permittering.less';
import InfoarkPermittereAnsatte from './info-ark/infoark-permittere-ansatte/InfoarkPermittereAnsatte';
import Ipermitteringsperioden from './info-ark/infoark-ipermitteringsperioden/Ipermitteringsperioden';

export const permitteringClassName = 'permittering';
const permittering = BEMHelper('permittering');

const Permittering = () => {
    return (
        <div className={permittering.className}>
            <Banner classname="banner" />
            <div className={permittering.element('wrapper')}>
                <Oversikt className={permittering.className} />
                <div className={permittering.element('info-container')}>
                    <Infoseksjon className={permittering.className} overskrift="Hvordan permittere ansatte?">
                        <InfoarkPermittereAnsatte className={permittering.className} />
                    </Infoseksjon>
                    <Infoseksjon className={permittering.className} overskrift="I permitteringsperioden">
                        <Ipermitteringsperioden className={permittering.className} />
                    </Infoseksjon>
                </div>
            </div>
        </div>
    );
};

export default Permittering;
