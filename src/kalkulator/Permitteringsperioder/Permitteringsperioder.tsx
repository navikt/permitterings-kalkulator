import React, { FunctionComponent, useEffect, useState } from 'react';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder, DatoIntervall } from '../typer';
import Permitteringsperiode from './Permitteringsperiode/Permitteringsperiode';
import './permitteringsperioder.less';
import {
    finnSisteTilDato,
    perioderOverlapper,
    permitteringErForTettAndrePermitteringer,
} from '../utils/dato-utils';
import { Knapp } from 'nav-frontend-knapper';
import AlertStripe from 'nav-frontend-alertstriper';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
}

export const Permitteringsperioder: FunctionComponent<Props> = ({
    allePermitteringerOgFraværesPerioder,
    setAllePermitteringerOgFraværesPerioder,
}) => {
    const [
        feilmeldingPermitteringerErForTett,
        setFeilmeldingPermitteringerErForTett,
    ] = useState('');
    const permitteringsobjekter = allePermitteringerOgFraværesPerioder.permitteringer.map(
        (permitteringsperiode, indeks) => (
            <Permitteringsperiode
                indeks={indeks}
                allePermitteringerOgFraværesPerioder={
                    allePermitteringerOgFraværesPerioder
                }
                setAllePermitteringerOgFraværesPerioder={
                    setAllePermitteringerOgFraværesPerioder
                }
                key={indeks.toString()}
            />
        )
    );

    const leggTilNyPermitteringsperiode = () => {
        const sisteUtfyltePermitteringsdag = finnSisteTilDato(
            allePermitteringerOgFraværesPerioder.permitteringer
        );
        const startdatoForNyPeriode = sisteUtfyltePermitteringsdag
            ? sisteUtfyltePermitteringsdag.add(21, 'day')
            : undefined;
        const nyPeriode: Partial<DatoIntervall> = {
            datoFra: startdatoForNyPeriode,
            datoTil: undefined,
        };

        const kopiAvPermitterinsperioder = {
            ...allePermitteringerOgFraværesPerioder,
        };
        kopiAvPermitterinsperioder.permitteringer.push(nyPeriode);
        setAllePermitteringerOgFraværesPerioder(kopiAvPermitterinsperioder);
    };

    useEffect(() => {
        let finnesForTette = false;
        allePermitteringerOgFraværesPerioder.permitteringer.forEach(
            (periode, indeks) => {
                if (
                    permitteringErForTettAndrePermitteringer(
                        allePermitteringerOgFraværesPerioder.permitteringer,
                        periode
                    )
                ) {
                    finnesForTette = true;
                    setFeilmeldingPermitteringerErForTett(
                        'Du har fylt inn permitteringsperioder med mindre enn 20 dagers mellomrom. Har du husket å fylle inn fra første dag etter lønnsplikt?'
                    );
                }
            }
        );
    }, [allePermitteringerOgFraværesPerioder.permitteringer]);

    const feilmeldingPerioderOverlapper = perioderOverlapper(
        allePermitteringerOgFraværesPerioder.permitteringer
    )
        ? 'Du kan ikke ha overlappende permitteringsperioder'
        : '';

    return (
        <div className="permitteringsperioder">
            <Undertittel tag="h2" className="permitteringsperioder__tittel">
                1. Legg til periodene den ansatte har vært permittert
            </Undertittel>
            <Element>Du skal fylle inn</Element>
            <Normaltekst tag="ul" className="topp__liste">
                <li>
                    permittering uavhengig av permitteringsprosent og
                    stillingsprosent
                </li>
                <li>
                    permittering fra første permitteringsdag{' '}
                    <b>etter lønnsplikt</b>
                </li>
            </Normaltekst>
            {permitteringsobjekter}
            {feilmeldingPerioderOverlapper.length > 0 && (
                <AlertStripe
                    type={'feil'}
                    className="permitteringsperioder__feilmelding"
                    aria-live="polite"
                    aria-label="Feilmelding"
                >
                    {feilmeldingPerioderOverlapper}
                </AlertStripe>
            )}
            {feilmeldingPermitteringerErForTett.length > 0 && (
                <AlertStripe
                    type={'feil'}
                    className="permitteringsperioder__feilmelding"
                    aria-live="polite"
                    aria-label="Feilmelding"
                >
                    {feilmeldingPermitteringerErForTett}
                </AlertStripe>
            )}
            <Knapp
                className={'permitteringsperioder__legg-til-knapp'}
                onClick={leggTilNyPermitteringsperiode}
            >
                + Legg til permittering
            </Knapp>
        </div>
    );
};
