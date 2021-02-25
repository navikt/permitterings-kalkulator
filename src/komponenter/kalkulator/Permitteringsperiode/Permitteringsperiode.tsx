import React, { FunctionComponent } from 'react';
import '../kalkulator.less';
import './Permitteringsperiode.less';

import { AllePermitteringerOgFraværesPerioder, DatoIntervall } from '../typer';

import DatoIntervallInput from '../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';
import { finn1DagFram, finnSistePermitteringsdato } from '../utregninger';

interface Props {
    info: DatoIntervall;
    indeks: number;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
    setIndeksLøpendePermitteringsperiode: (indeks: number | undefined) => void;
    indeksLøpendePermitteringsperiode: undefined | number;
}

const Permitteringsperiode: FunctionComponent<Props> = (props) => {
    const leggTilNyPermitteringsperiode = () => {
        const sistRegistrerteDag = finnSistePermitteringsdato(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        )
            ? finnSistePermitteringsdato(
                  props.allePermitteringerOgFraværesPerioder.permitteringer
              )
            : new Date();
        const nyPeriode: DatoIntervall = {
            datoFra: finn1DagFram(sistRegistrerteDag!!),
            datoTil: undefined,
        };

        const kopiAvPermitterinsperioder = {
            ...props.allePermitteringerOgFraværesPerioder,
        };
        kopiAvPermitterinsperioder.permitteringer.push(nyPeriode);
        props.setAllePermitteringerOgFraværesPerioder(
            kopiAvPermitterinsperioder
        );
    };

    const oppdaterDatoIntervall = (datoIntervall: DatoIntervall) => {
        const kopiAvPermitteringsperioder = [
            ...props.allePermitteringerOgFraværesPerioder.permitteringer,
        ];
        kopiAvPermitteringsperioder[props.indeks] = datoIntervall;
        props.setAllePermitteringerOgFraværesPerioder({
            ...props.allePermitteringerOgFraværesPerioder,
            permitteringer: kopiAvPermitteringsperioder,
        });
    };

    return (
        <div className={'permitteringsperiode'}>
            <DatoIntervallInput
                datoIntervall={
                    props.allePermitteringerOgFraværesPerioder.permitteringer[
                        props.indeks
                    ]
                }
                setDatoIntervall={oppdaterDatoIntervall}
                erLøpendeLabel="Permitteringen er fortsatt aktiv"
            />
            {props.indeks ===
                props.allePermitteringerOgFraværesPerioder.permitteringer
                    .length -
                    1 && (
                <Knapp
                    className={'permitteringsperiode__legg-til-knapp'}
                    onClick={() => {
                        leggTilNyPermitteringsperiode();
                    }}
                >
                    + legg til ny permitteringsperiode
                </Knapp>
            )}
        </div>
    );
};

export default Permitteringsperiode;
