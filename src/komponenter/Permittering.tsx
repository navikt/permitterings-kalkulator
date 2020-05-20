import React, { useEffect, useState } from 'react';
import BEMHelper from '../utils/bem';
import Banner from './banner/Banner';
import Oversikt from './oversikt/Oversikt';
import Infoseksjon from './infoseksjon/Infoseksjon';
import PermittereAnsatte from './info-ark/infoark-permittere-ansatte/PermittereAnsatte';
import Ipermitteringsperioden from './info-ark/infoark-ipermitteringsperioden/Ipermitteringsperioden';
import VanligeSporsmal from './info-ark/infoark-vanlige-sporsmaal/VanligeSporsmal';
import './permittering.less';
import SistOppdatertInfo from './SistOppdatertInfo';
import NarSkalJegUtbetaleLonn from './info-ark/infoark-utbetale-lonn/NarSkalJegUtbetaleLonn';
import { fetchsanityJSON, isProduction } from '../utils/fetch-utils';
import { skrivTilMalingBesokerSide } from '../utils/amplitudeUtils';
import { SanityBlockTypes } from '../sanity-blocks/sanityTypes';

export const permitteringClassName = 'permittering';
const permittering = BEMHelper('permittering');

const Permittering = () => {
    const [hvordanPermittere, setHvordanPermittere] = useState<
        [] | SanityBlockTypes[]
    >([]);
    const [narSkalJegUtbetale, setNarSkalJegUtbetale] = useState<
        [] | SanityBlockTypes[]
    >([]);
    const [iPermitteringsperioden, setIpermitteringsperioden] = useState<
        [] | SanityBlockTypes[]
    >([]);
    const [vanligeSpr, setVanligeSpr] = useState<[] | SanityBlockTypes[]>([]);

    const writeToHook = (item: SanityBlockTypes) => {
        switch (item._type) {
            case 'hvordan-permittere-ansatte':
                return setHvordanPermittere((hvordanPermittere) => [
                    ...hvordanPermittere,
                    item,
                ]);
            case 'i-permitteringsperioden':
                return setIpermitteringsperioden((iPermitteringsperioden) => [
                    ...iPermitteringsperioden,
                    item,
                ]);
            case 'nar-skal-jeg-utbetale-lonn':
                return setNarSkalJegUtbetale((narSkalJegUtbetale) => [
                    ...narSkalJegUtbetale,
                    item,
                ]);
            case 'vanlige-sporsmal':
                return setVanligeSpr((vanligeSpr) => [...vanligeSpr, item]);
        }
    };

    useEffect(() => {
        const url = isProduction();
        fetchsanityJSON(url)
            .then((res) => {
                console.log(res);
                res.forEach((item: SanityBlockTypes) => {
                    writeToHook(item);
                });
            })
            .catch((err) => console.warn(err));
        skrivTilMalingBesokerSide();
    }, []);

    return (
        <div className={permittering.className}>
            <Banner classname="banner" />
            <div className={permittering.element('container')}>
                <div className={permittering.element('wrapper')}>
                    <Oversikt className={permittering.className} />

                    <div className={permittering.element('info-container')}>
                        <SistOppdatertInfo className={permitteringClassName} />
                        <Infoseksjon
                            className={permittering.className}
                            overskrift="Hvordan permittere ansatte?"
                            id="hvordanPermittere"
                        >
                            <PermittereAnsatte
                                className={permittering.className}
                                content={hvordanPermittere}
                            />
                        </Infoseksjon>
                        <Infoseksjon
                            className={permittering.className}
                            overskrift="Når skal jeg utbetale lønn?"
                            id="narSkalJegUtbetaleLonn"
                        >
                            <NarSkalJegUtbetaleLonn
                                className={permittering.className}
                                content={narSkalJegUtbetale}
                            />
                        </Infoseksjon>
                        <Infoseksjon
                            className={permittering.className}
                            overskrift="I permitteringsperioden"
                            id="permitteringsperioden"
                        >
                            <Ipermitteringsperioden
                                className={permittering.className}
                                content={iPermitteringsperioden}
                            />
                        </Infoseksjon>
                        <Infoseksjon
                            className={permittering.className}
                            overskrift="Vanlige spørsmål"
                            id="vanligSpr"
                        >
                            <VanligeSporsmal
                                className={permittering.className}
                                content={vanligeSpr}
                            />
                        </Infoseksjon>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permittering;
