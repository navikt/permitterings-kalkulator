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
import { PermitteringContext } from './ContextProvider';
import InformasjonTilAnsatte from './info-ark/infoark-informasjon-til-ansatte/InformasjonTilAnsatte';

export const permitteringClassName = 'permittering';
const permittering = BEMHelper('permittering');

const Permittering = () => {
    const { permitteringInnhold, sistOppdatert } = useContext(
        PermitteringContext
    );

    const {
        hvordanPermittere,
        narSkalJegUtbetale,
        iPermitteringsperioden,
        informasjonTilAnsatte,
        vanligeSpr,
    } = permitteringInnhold;

    return (
        <div className={permittering.className}>
            <Banner classname="banner" center={true}>
                Veiviser for permittering
            </Banner>
            <div className={permittering.element('container')}>
                <div
                    className={permittering.element('wrapper')}
                    id={permittering.element('wrapper')}
                >
                    <Meny />
                    <div className={permittering.element('info-container')}>
                        <SistOppdatertInfo
                            className={permitteringClassName}
                            content={sistOppdatert}
                        />

                        <PermittereAnsatte
                            className={permittering.className}
                            content={hvordanPermittere}
                            overskrift="Hvordan permittere ansatte?"
                            id="hvordanPermittere"
                        />

                        <NarSkalJegUtbetaleLonn
                            className={permittering.className}
                            content={narSkalJegUtbetale}
                            overskrift="Lønnsplikt ved permittering"
                            id="narSkalJegUtbetaleLonn"
                        />

                        <Ipermitteringsperioden
                            className={permittering.className}
                            content={iPermitteringsperioden}
                            overskrift="I permitteringsperioden"
                            id="permitteringsperioden"
                        />

                        <InformasjonTilAnsatte
                            className={permittering.className}
                            content={informasjonTilAnsatte}
                            overskrift="Informasjon til ansatte"
                            id="infotilansatte"
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
