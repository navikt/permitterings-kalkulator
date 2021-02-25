import React, { FunctionComponent } from 'react';
import '../kalkulator.less';
import './Permitteringsperiode.less';

import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    getDefaultPermitteringsperiode,
} from '../kalkulator';

import DatoIntervallInput from '../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';
import { finn1DagFram, finnSisteDato } from '../utregninger';

interface Props {
    info: DatoIntervall;
    indeks: number;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
}

const Permitteringsperiode: FunctionComponent<Props> = (props) => {
    const leggTilNyPermitteringsperiode = () => {
        const sistRegistrerteDag = finnSisteDato(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        )
            ? finnSisteDato(
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
    const slettPeriode = () => {
        const kopiAvPermitterinsperioder = {
            ...props.allePermitteringerOgFraværesPerioder,
        };
        if (kopiAvPermitterinsperioder.permitteringer.length > 1) {
            kopiAvPermitterinsperioder.permitteringer.splice(props.indeks, 1);
        } else {
            kopiAvPermitterinsperioder.permitteringer = [
                getDefaultPermitteringsperiode(),
            ];
        }
        props.setAllePermitteringerOgFraværesPerioder(
            kopiAvPermitterinsperioder
        );
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
                slettPeriode={slettPeriode}
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
