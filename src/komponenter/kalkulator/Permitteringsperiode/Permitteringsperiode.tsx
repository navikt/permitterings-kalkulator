import React, { FunctionComponent } from 'react';
import '../kalkulator.less';
import './Permitteringsperiode.less';

import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
} from '../kalkulator';

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
    setIndeksLøpendePermitteringsperiode: (indeks: number) => void;
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

    /*const slettPeriode = () => {
        const kopiAvPermitterinsperioder = {...props.allePermitteringerOgFraværesPerioder};
        kopiAvPermitterinsperioder.permitteringer.splice(props.indeks, 1)
        props.setAllePermitteringerOgFraværesPerioder(kopiAvPermitterinsperioder);
    }

     */

    return (
        <div className={'permitteringsperiode'}>
            <DatoIntervallInput
                setIndeksLøpendeperiode={
                    props.setIndeksLøpendePermitteringsperiode
                }
                indeksLøpendeperiode={props.indeksLøpendePermitteringsperiode}
                indeksPermitteringsperioder={props.indeks}
                allePermitteringerOgFraværesPerioder={
                    props.allePermitteringerOgFraværesPerioder
                }
                setAllePermitteringerOgFraværesPerioder={
                    props.setAllePermitteringerOgFraværesPerioder
                }
                type={'PERMITTERINGSINTERVALL'}
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
