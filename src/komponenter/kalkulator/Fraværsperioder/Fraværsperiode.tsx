import React, { FunctionComponent, useState } from 'react';
import { AllePermitteringerOgFraværesPerioder, DatoIntervall } from '../typer';
import DatoIntervallInput from '../DatointervallInput/DatointervallInput';
import {
    datoIntervallErGyldig,
    fraværInngårIPermitteringsperioder,
} from '../utils/dato-utils';

interface Props {
    indeks: number;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
}

const Fraværsperiode: FunctionComponent<Props> = ({
    indeks,
    allePermitteringerOgFraværesPerioder,
    setAllePermitteringerOgFraværesPerioder,
}) => {
    const [
        advarselFraværsperiodeUtenforPermittering,
        setAdvarselFraværsperiodeUtenforPermittering,
    ] = useState<string>('');

    const oppdaterDatoIntervall = (datoIntervall: Partial<DatoIntervall>) => {
        if (
            datoIntervall.datoFra &&
            !fraværInngårIPermitteringsperioder(
                allePermitteringerOgFraværesPerioder.permitteringer,
                datoIntervall
            )
        ) {
            setAdvarselFraværsperiodeUtenforPermittering(
                'Fravær som ikke inngår i permitteringsperioder telles ikke med i beregningen'
            );
        } else {
            setAdvarselFraværsperiodeUtenforPermittering('');
        }
        const kopiAvFraværsperioder = [
            ...allePermitteringerOgFraværesPerioder.andreFraværsperioder,
        ];
        kopiAvFraværsperioder[indeks] = datoIntervall;
        setAllePermitteringerOgFraværesPerioder({
            ...allePermitteringerOgFraværesPerioder,
            andreFraværsperioder: kopiAvFraværsperioder,
        });
    };

    const slettFraværsperiode = () => {
        const kopiAvAllPermitteringsInfo = {
            ...allePermitteringerOgFraværesPerioder,
        };
        if (kopiAvAllPermitteringsInfo.andreFraværsperioder.length > 0) {
            kopiAvAllPermitteringsInfo.andreFraværsperioder.splice(indeks, 1);
        }
        setAllePermitteringerOgFraværesPerioder(kopiAvAllPermitteringsInfo);
    };

    return (
        <DatoIntervallInput
            advarsel={advarselFraværsperiodeUtenforPermittering}
            key={indeks}
            datoIntervall={allePermitteringerOgFraværesPerioder.andreFraværsperioder[indeks]}
            setDatoIntervall={(datoIntervall) =>
                oppdaterDatoIntervall(datoIntervall)
            }
            slettPeriode={() => slettFraværsperiode()}
        />
    );
};

export default Fraværsperiode;
