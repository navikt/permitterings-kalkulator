import React, { useContext } from 'react';
import BEMHelper from '../utils/bem';
import Banner from './banner/Banner';
import Oversikt from './oversikt/Oversikt';
import PermittereAnsatte from './info-ark/infoark-permittere-ansatte/PermittereAnsatte';
import Ipermitteringsperioden from './info-ark/infoark-ipermitteringsperioden/Ipermitteringsperioden';
import VanligeSporsmal from './info-ark/infoark-vanlige-sporsmaal/VanligeSporsmal';
import './permittering.less';
import SistOppdatertInfo from './SistOppdatertInfo';
import NarSkalJegUtbetaleLonn from './info-ark/infoark-utbetale-lonn/NarSkalJegUtbetaleLonn';
import { PermitteringContext } from './Context';

export const permitteringClassName = 'permittering';
const permittering = BEMHelper('permittering');

const Permittering = () => {
    const {
        hvordanPermittere,
        narSkalJegUtbetale,
        iPermitteringsperioden,
        vanligeSpr,
    } = useContext(PermitteringContext);

    return (
        <div className={permittering.className}>
            <Banner classname="banner" />
            <div className={permittering.element('container')}>
                <div className={permittering.element('wrapper')}>
                    <Oversikt className={permittering.className} />

                    <div className={permittering.element('info-container')}>
                        <SistOppdatertInfo className={permitteringClassName} />

                        <PermittereAnsatte
                            className={permittering.className}
                            content={hvordanPermittere}
                        />

                        <NarSkalJegUtbetaleLonn
                            className={permittering.className}
                            content={narSkalJegUtbetale}
                        />

                        <Ipermitteringsperioden
                            className={permittering.className}
                            content={iPermitteringsperioden}
                        />

                        <VanligeSporsmal
                            className={permittering.className}
                            content={vanligeSpr}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permittering;
