import React, { useContext, useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Fraværsperioder from './Fraværsperioder/Fraværsperioder';
import { AllePermitteringerOgFraværesPerioder, DatoMedKategori } from './typer';
import {
    datoIntervallErDefinert,
    finnInitialgrenserForTidslinjedatoer,
    konstruerTidslinje,
    regnUtHvaSisteDatoPåTidslinjenSkalVære,
} from './utregninger';
import Tidslinje from './Tidslinje/Tidslinje';
import { fraPixelTilProsent } from './Tidslinje/tidslinjefunksjoner';
import Topp from './Topp/Topp';
import { PermitteringContext } from '../ContextProvider';
import { Dayjs } from 'dayjs';
import { Permitteringsperioder } from './Permitteringsperioder/Permitteringsperioder';

const Kalkulator = () => {
    const { dagensDato, innføringsdatoAGP2 } = useContext(PermitteringContext);

    const [
        allePermitteringerOgFraværesPerioder,
        setAllePermitteringerOgFraværesPerioder,
    ] = useState<AllePermitteringerOgFraværesPerioder>({
        permitteringer: [{ datoFra: undefined, datoTil: undefined }],
        andreFraværsperioder: [],
    });

    const [
        sisteDagI18mndsPeriodeEndretAv,
        setsteDagI18mndsPeriodeEndretAv,
    ] = useState<'datovelger' | 'tidslinje' | 'ingen'>('ingen');

    const [sisteDagI18mndsPeriode, setSisteDagI18mndsPeriode] = useState<Dayjs>(
        innføringsdatoAGP2
    );
    const [tidslinje, setTidslinje] = useState<DatoMedKategori[]>([]);
    const [sisteDatoVistPåTidslinje, setSisteDatoVistPåTidslinje] = useState(
        finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil
    );

    useEffect(() => {
        setTidslinje(
            konstruerTidslinje(
                allePermitteringerOgFraværesPerioder,
                dagensDato,
                sisteDatoVistPåTidslinje!
            )
        );
    }, [allePermitteringerOgFraværesPerioder, sisteDatoVistPåTidslinje]);

    useEffect(() => {
        const nySisteDatoPåTidslinjen = regnUtHvaSisteDatoPåTidslinjenSkalVære(
            allePermitteringerOgFraværesPerioder,
            dagensDato
        );
        if (nySisteDatoPåTidslinjen?.isAfter(sisteDatoVistPåTidslinje!)) {
            setSisteDatoVistPåTidslinje(nySisteDatoPåTidslinjen);
        }
    }, [allePermitteringerOgFraværesPerioder]);

    return (
        <div className={'kalkulator__bakgrunn'}>
            <Banner classname={'banner'}>
                <span aria-label="Permitteringskalkulator">
                    Permitterings&shy;kalkulator
                </span>
            </Banner>
            <div className={'kalkulator'}>
                <Innholdstittel>
                    Lurer du på når du skal utbetale lønn under permittering?
                </Innholdstittel>
                <Topp />
                <Permitteringsperioder
                    allePermitteringerOgFraværesPerioder={
                        allePermitteringerOgFraværesPerioder
                    }
                    setAllePermitteringerOgFraværesPerioder={
                        setAllePermitteringerOgFraværesPerioder
                    }
                />
                <Fraværsperioder
                    setAllePermitteringerOgFraværesPerioder={
                        setAllePermitteringerOgFraværesPerioder
                    }
                    allePermitteringerOgFraværesPerioder={
                        allePermitteringerOgFraværesPerioder
                    }
                />
                <div id={'kalkulator-tidslinje-wrapper'}>
                    {datoIntervallErDefinert(
                        allePermitteringerOgFraværesPerioder.permitteringer[0]
                    ) && (
                        <>
                            <Undertittel>
                                4. Beregningen vises i tidslinje
                            </Undertittel>
                            <Tidslinje
                                setEndringAv={setsteDagI18mndsPeriodeEndretAv}
                                tidslinje={tidslinje}
                                endringAv={sisteDagI18mndsPeriodeEndretAv}
                                breddeAvDatoObjektIProsent={fraPixelTilProsent(
                                    'kalkulator-tidslinje-wrapper',
                                    tidslinje.length
                                )}
                                sisteDagIPeriode={sisteDagI18mndsPeriode}
                                set18mndsPeriode={setSisteDagI18mndsPeriode}
                                allePermitteringerOgFraværesPerioder={
                                    allePermitteringerOgFraværesPerioder
                                }
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Kalkulator;
