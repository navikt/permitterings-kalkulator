import React, { FunctionComponent, useEffect, useState } from 'react';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder } from '../typer';
import Permitteringsperiode from '../Permitteringsperiode/Permitteringsperiode';
import { finnUtOmDefinnesOverlappendePerioder } from '../utregninger';
import './permitteringsperioder.less';

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
                info={permitteringsperiode}
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
                2. Legg inn permitteringsperiode for arbeidstaker
            </Undertittel>
            <Normaltekst>
                Periodene skal <strong>ikke</strong> inneholde dagene du har
                lønnsplikt, eller permitteringer grunnet streik.
            </Normaltekst>
            {permitteringsobjekter}
            <Element className={'kalkulator__feilmelding'}>
                {beskjedOverlappendePermittering}
            </Element>
        </div>
    );
};
