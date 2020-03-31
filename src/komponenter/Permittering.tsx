import React from 'react';
import BEMHelper from '../utils/bem';
import Banner from './banner/Banner';
import Oversikt from './oversikt/Oversikt';
import Infoseksjon from './infoseksjon/Infoseksjon';
import './permittering.less';
import PermittereAnsatte from './info-ark/infoark-permittere-ansatte/PermittereAnsatte';
import Ipermitteringsperioden from './info-ark/infoark-ipermitteringsperioden/Ipermitteringsperioden';
import VanligeSporsmal from './info-ark/infoark-vanlige-sporsmaal/VanligeSporsmal';

export const permitteringClassName = 'permittering';
const permittering = BEMHelper('permittering');

const Permittering = () => {
    return (
        <div className={permittering.className}>
            <Banner classname="banner" />
            <div className={permittering.element('wrapper')}>
                <Oversikt className={permittering.className} />
                <div className={permittering.element('info-container')}>
                    <Infoseksjon
                        className={permittering.className}
                        overskrift="Hvordan permittere ansatte?"
                        id="hvordanPermittere"
                    >
                        <PermittereAnsatte className={permittering.className} />
                    </Infoseksjon>
                    <Infoseksjon
                        className={permittering.className}
                        overskrift="I permitteringsperioden"
                        id="permitteringsperioden"
                    >
                        <Ipermitteringsperioden className={permittering.className} />
                    </Infoseksjon>
                    <Infoseksjon className={permittering.className} overskrift="Vanlige spørsmål" id="vanligSpr">
                        <VanligeSporsmal className={permittering.className} />
                    </Infoseksjon>
                </div>
            </div>
        </div>
    );
};

export default Permittering;
