import React, { FunctionComponent, useEffect, useState } from 'react';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder } from '../typer';
import Permitteringsperiode from '../Permitteringsperiode/Permitteringsperiode';
import './permitteringsperioder.less';
import kalenderSvg from './kalender.svg';
import { Infotekst } from '../Infotekst/Infotekst';
import { finnUtOmDefinnesOverlappendePerioder } from '../utils/dato-utils';

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
        beskjedOverlappendePermittering,
        setBeskjedOverlappendePermittering,
    ] = useState('');

    useEffect(() => {
        if (
            finnUtOmDefinnesOverlappendePerioder(
                allePermitteringerOgFraværesPerioder.permitteringer
            )
        ) {
            setBeskjedOverlappendePermittering(
                'Du kan ikke ha overlappende permitteringsperioder'
            );
        } else {
            setBeskjedOverlappendePermittering('');
        }
    }, [allePermitteringerOgFraværesPerioder, beskjedOverlappendePermittering]);

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

    return (
        <div className="permitteringsperioder">
            <Undertittel tag="h2">
                1. Legg til periodene den ansatte har vært permittert
            </Undertittel>
            <Infotekst
                className="permitteringsperioder__infotekst"
                imgSrc={kalenderSvg}
                imgAlt="Kalender"
            >
                <Normaltekst>
                    Hvis den ansatte har fått lønnskompensasjon, skal dette være
                    med i periodene. <br />
                    Periodene skal <strong>ikke</strong> inneholde dagene du har
                    lønnsplikt, eller permitteringer grunnet streik.
                </Normaltekst>
            </Infotekst>
            {permitteringsobjekter}
            <Element className={'kalkulator__feilmelding'}>
                {beskjedOverlappendePermittering}
            </Element>
        </div>
    );
};
