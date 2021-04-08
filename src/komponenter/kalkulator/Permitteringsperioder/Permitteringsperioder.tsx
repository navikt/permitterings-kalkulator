import React, { FunctionComponent } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder } from '../typer';
import Permitteringsperiode from './Permitteringsperiode/Permitteringsperiode';
import './permitteringsperioder.less';
import kalenderSvg from './kalender.svg';
import { Infotekst } from '../Infotekst/Infotekst';

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

    return (
        <div className="permitteringsperioder">
            <Undertittel tag="h2" className="permitteringsperioder__tittel">
                1. Legg til periodene den ansatte har vært permittert
            </Undertittel>
            <Infotekst imgSrc={kalenderSvg} imgAlt="Kalender">
                <Normaltekst tag="ul">
                    <li>
                        Hvis den ansatte har fått lønnskompensasjon, skal dette
                        være med i periodene.
                    </li>
                    <li>
                        Ikke fyll inn dagene du har lønnsplikt eller
                        permitteringer grunnet streik.
                    </li>
                    <li>
                        Ikke fyll inn permitteringer eldre enn 18 måneder.
                    </li>
                </Normaltekst>
            </Infotekst>
            {permitteringsobjekter}
        </div>
    );
};
