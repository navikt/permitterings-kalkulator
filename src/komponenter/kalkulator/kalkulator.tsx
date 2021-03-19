import React, { useContext, useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Utregningskolonne from './Uregningskolonne/Utregningskolonne';
import Fraværsperioder from './Fraværsperioder/Fraværsperioder';
import { AllePermitteringerOgFraværesPerioder, DatoMedKategori } from './typer';
import {
    datoIntervallErDefinert,
    finnGrenserFor18MNDPeriode,
    finnSluttDatoPåTidslinje,
    getDefaultPermitteringsperiode,
    konstruerStatiskTidslinje,
} from './utregninger';
import Tidslinje from './Tidslinje/Tidslinje';
import { fraPixelTilProsent } from './Tidslinje/tidslinjefunksjoner';
import Topp from './Topp/Topp';
import { PermitteringContext } from '../ContextProvider';
import { Dayjs } from 'dayjs';
import { Permitteringsperioder } from './Permitteringsperioder/Permitteringsperioder';

const Kalkulator = () => {
    const { dagensDato } = useContext(PermitteringContext);

    const [
        allePermitteringerOgFraværesPerioder,
        setAllePermitteringerOgFraværesPerioder,
    ] = useState<AllePermitteringerOgFraværesPerioder>({
        permitteringer: [getDefaultPermitteringsperiode(dagensDato)],
        andreFraværsperioder: [],
    });

    const [
        sisteDagI18mndsPeriodeEndretAv,
        setsteDagI18mndsPeriodeEndretAv,
    ] = useState<'datovelger' | 'tidslinje' | 'ingen'>('ingen');

    const [sisteDagI18mndsPeriode, setSisteDagI18mndsPeriode] = useState<Dayjs>(
        dagensDato
    );
    const [tidslinjeObjekter, setTidslinjeObjekter] = useState<
        DatoMedKategori[]
    >([]);
    const [sisteDatoVistPåTidslinje, setSisteDatoVistPåTidslinje] = useState(
        finnGrenserFor18MNDPeriode(dagensDato).datoTil
    );

    useEffect(() => {
        setTidslinjeObjekter(
            konstruerStatiskTidslinje(
                allePermitteringerOgFraværesPerioder,
                dagensDato,
                sisteDatoVistPåTidslinje!
            )
        );
    }, [allePermitteringerOgFraværesPerioder, sisteDatoVistPåTidslinje]);

    useEffect(() => {
        const nySisteDatoPåTidslinjen = finnSluttDatoPåTidslinje(
            allePermitteringerOgFraværesPerioder,
            dagensDato
        );
        if (nySisteDatoPåTidslinjen?.isAfter(sisteDatoVistPåTidslinje!)) {
            setSisteDatoVistPåTidslinje(nySisteDatoPåTidslinjen);
        }
    }, [allePermitteringerOgFraværesPerioder]);

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'}>Permitteringskalkulator</Banner>
            <div className={'kalkulator'}>
                <div
                    className={'kalkulator__utfyllingskolonne'}
                    id={'kalkulator-utfyllingskolonne'}
                >
                    <Innholdstittel>
                        Lurer du på når du skal utbetale lønn under
                        permittering?
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
                    <div
                        className={'kalkulator__tidslinje-wrapper'}
                        id={'kalkulator-tidslinje-wrapper'}
                    >
                        {datoIntervallErDefinert(
                            allePermitteringerOgFraværesPerioder
                                .permitteringer[0]
                        ) && (
                            <>
                                <Undertittel>
                                    4. Beregningen vises i tidslinje
                                </Undertittel>
                                <Tidslinje
                                    setEndringAv={
                                        setsteDagI18mndsPeriodeEndretAv
                                    }
                                    tidslinjeObjekter={tidslinjeObjekter}
                                    endringAv={sisteDagI18mndsPeriodeEndretAv}
                                    breddeAvDatoObjektIProsent={fraPixelTilProsent(
                                        'kalkulator-tidslinje-wrapper',
                                        tidslinjeObjekter.length
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
                <div className={'kalkulator__utregningskolonne'}>
                    <Utregningskolonne
                        tidslinjeObjekter={tidslinjeObjekter}
                        sisteDagIPeriode={sisteDagI18mndsPeriode}
                        allePermitteringerOgFraværesPerioder={
                            allePermitteringerOgFraværesPerioder
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Kalkulator;
