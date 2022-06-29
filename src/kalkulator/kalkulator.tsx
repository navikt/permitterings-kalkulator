import React, { useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { datoIntervallErGyldig } from './utils/dato-utils';
import { Innholdstittel } from 'nav-frontend-typografi';
import Fraværsperioder from './Fraværsperioder/Fraværsperioder';
import { AllePermitteringerOgFraværesPerioder } from './typer';
import Topp from './Topp/Topp';
import dayjs from 'dayjs';
import { Permitteringsperioder } from './Permitteringsperioder/Permitteringsperioder';
import { SeResultat } from './SeResultat/SeResultat';
import {
    loggSidevinsing,
    logSekunderBruktFørBrukerFyllerInn,
} from '../utils/amplitudeEvents';

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
            setSekunderFørPermitteringFyllesInn(undefined);
        }
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
                {datoIntervallErGyldig(
                    allePermitteringerOgFraværesPerioder.permitteringer[0]
                ) && (
                    <SeResultat
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
