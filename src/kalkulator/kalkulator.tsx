import React, { useContext, useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Element, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Fraværsperioder from './Fraværsperioder/Fraværsperioder';
import { AllePermitteringerOgFraværesPerioder, DatoMedKategori } from './typer';
import Topp from './Topp/Topp';
import dayjs, { Dayjs } from 'dayjs';
import { Permitteringsperioder } from './Permitteringsperioder/Permitteringsperioder';
import {
    finnFørsteDatoMedPermitteringUtenFravær,
    konstruerTidslinje,
} from './utils/tidslinje-utils';
import { SeResultat } from './SeResultat/SeResultat';
import {
    loggSidevinsing,
    logSekunderBruktFørBrukerFyllerInn,
} from '../utils/amplitudeEvents';
import {
    dagensDato,
    regelEndringsDato1April,
} from '../konstanterKnyttetTilRegelverk';

const Kalkulator = () => {
    const [
        sekunderFørPermitteringFyllesInn,
        setSekunderFørPermitteringFyllesInn,
    ] = useState<undefined | number>(undefined);

    const [
        allePermitteringerOgFraværesPerioder,
        setAllePermitteringerOgFraværesPerioder,
    ] = useState<AllePermitteringerOgFraværesPerioder>({
        permitteringer: [{ datoFra: undefined, datoTil: undefined }],
        andreFraværsperioder: [],
    });

    const [sisteDagI18mndsPeriode, setSisteDagI18mndsPeriode] = useState<Dayjs>(
        regelEndringsDato1April
    );
    const [tidslinje, setTidslinje] = useState<DatoMedKategori[]>([]);

    useEffect(() => {
        loggSidevinsing();
        setSekunderFørPermitteringFyllesInn(dayjs().valueOf());
    }, []);

    useEffect(() => {
        const navigererBortFraSidenEvent = () => {
            //logger at bruker ikke har fyllt inn noe
            if (sekunderFørPermitteringFyllesInn) {
                logSekunderBruktFørBrukerFyllerInn(undefined);
            }
        };
        window.addEventListener('beforeunload', navigererBortFraSidenEvent);
        return () =>
            window.removeEventListener(
                'beforeunload',
                navigererBortFraSidenEvent
            );
    }, []);

    useEffect(() => {
        if (
            allePermitteringerOgFraværesPerioder.permitteringer[0].datoFra &&
            sekunderFørPermitteringFyllesInn
        ) {
            const tidNå = dayjs().valueOf();
            logSekunderBruktFørBrukerFyllerInn(
                (tidNå - sekunderFørPermitteringFyllesInn) / 1000
            );
            //settes til undefined så logging ikke skal skje ved hver datoendring
            setSekunderFørPermitteringFyllesInn(undefined);
        }
        setTidslinje(
            konstruerTidslinje(allePermitteringerOgFraværesPerioder, dagensDato)
        );
    }, [allePermitteringerOgFraværesPerioder]);

    return (
        <div className={'kalkulator__bakgrunn'}>
            <Banner />
            <div className={'kalkulator'}>
                <Innholdstittel tag="h2">
                    Hvor lenge kan du ha ansatte permittert?
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
                {!!finnFørsteDatoMedPermitteringUtenFravær(tidslinje) && (
                    <SeResultat
                        tidslinje={tidslinje}
                        sisteDagIPeriode={sisteDagI18mndsPeriode}
                        set18mndsPeriode={setSisteDagI18mndsPeriode}
                        allePermitteringerOgFraværesPerioder={
                            allePermitteringerOgFraværesPerioder
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default Kalkulator;
