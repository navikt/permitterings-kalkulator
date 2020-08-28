import React, { useContext } from 'react';
import BEMHelper from '../utils/bem';
import Banner from './banner/Banner';
import Meny from './meny/Meny';
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
        narSkalJegUtbetaleIllustrasjon,
        narSkalJegUtbetale,
        narSkalJegUtbetaleEtter31aug,
        iPermitteringsperioden,
        vanligeSpr,
    } = useContext(PermitteringContext);

    return (
        <div className={permittering.className}>
            <Banner classname="banner" />
            <div className={permittering.element('container')}>
                <div
                    className={permittering.element('wrapper')}
                    id={permittering.element('wrapper')}
                >
                    <Meny />
                    <div className={permittering.element('info-container')}>
                        <SistOppdatertInfo className={permitteringClassName} />

                        <PermittereAnsatte
                            className={permittering.className}
                            content={hvordanPermittere}
                            overskrift="Hvordan permittere ansatte?"
                            id="hvordanPermittere"
                        />
                        <NarSkalJegUtbetaleLonn
                            className={permittering.className}
                            illustrasjon={narSkalJegUtbetaleIllustrasjon}
                            content={narSkalJegUtbetale}
                            contentEtter={narSkalJegUtbetaleEtter31aug}
                            overskrift="Når skal jeg utbetale lønn?"
                            id="narSkalJegUtbetaleLonn"
                        />

                        <Ipermitteringsperioden
                            className={permittering.className}
                            content={iPermitteringsperioden}
                            overskrift="I permitteringsperioden"
                            id="permitteringsperioden"
                        />

                        <VanligeSporsmal
                            className={permittering.className}
                            content={vanligeSpr}
                            overskrift="Vanlige spørsmål"
                            id="vanligSpr"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permittering;
