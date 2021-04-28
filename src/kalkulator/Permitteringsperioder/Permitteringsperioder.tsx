import React, { FunctionComponent } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder, DatoIntervall } from '../typer';
import Permitteringsperiode from './Permitteringsperiode/Permitteringsperiode';
import './permitteringsperioder.less';
import kalenderSvg from './kalender.svg';
import { Infotekst } from '../Infotekst/Infotekst';
import { finnSisteTilDato, perioderOverlapper } from '../utils/dato-utils';
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
            ? sisteUtfyltePermitteringsdag.add(1, 'day')
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

    const feilmelding = perioderOverlapper(
        allePermitteringerOgFraværesPerioder.permitteringer
    )
        ? 'Du kan ikke ha overlappende permitteringsperioder'
        : '';

    return (
        <div className="permitteringsperioder">
            <Undertittel tag="h2" className="permitteringsperioder__tittel">
                1. Legg til periodene den ansatte har vært permittert
            </Undertittel>
            <Infotekst imgSrc={kalenderSvg} imgAlt="Kalender">
                <Normaltekst tag="ul" className="permitteringsperioder__liste">
                    <li>
                        Fyll inn permitteringsperiodene uavhengig av
                        perimitteringsprosent og stillingsprosent.
                    </li>
                    <li>
                        Hvis den ansatte har fått lønnskompensasjon, skal dette
                        være med i periodene.
                    </li>
                    <li>
                        Ikke fyll inn dagene du har lønnsplikt eller
                        permitteringer grunnet streik.
                    </li>
                    <li>Ikke fyll inn permitteringer eldre enn 18 måneder.</li>
                </Normaltekst>
            </Infotekst>
            {permitteringsobjekter}
            {feilmelding.length > 0 && (
                <AlertStripe
                    type={'feil'}
                    className="permitteringsperioder__feilmelding"
                    aria-live="polite"
                    aria-label="Feilmelding"
                >
                    {feilmelding}
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
