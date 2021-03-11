import React, { FunctionComponent, useContext } from 'react';
import '../kalkulator.less';
import './Permitteringsperiode.less';

import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    tilDatoIntervall,
    tilDatoIntervallDayjs,
} from '../typer';

import DatoIntervallInput from '../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';
import {
    finn1DagFram,
    finnSisteDato,
    getDefaultPermitteringsperiode,
} from '../utregninger';
import { PermitteringContext } from '../../ContextProvider';

interface Props {
    info: DatoIntervall;
    indeks: number;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
}

const Permitteringsperiode: FunctionComponent<Props> = (props) => {
    const { dagensDato } = useContext(PermitteringContext);
    const leggTilNyPermitteringsperiode = () => {
        const sistRegistrerteDag = finnSisteDato(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        )
            ? finnSisteDato(
                  props.allePermitteringerOgFraværesPerioder.permitteringer
              )
            : dagensDato;
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
        let nyePermitteringsperioder = [
            ...props.allePermitteringerOgFraværesPerioder.permitteringer,
        ];
        if (nyePermitteringsperioder.length > 1) {
            nyePermitteringsperioder.splice(props.indeks, 1);
        } else {
            nyePermitteringsperioder = [
                getDefaultPermitteringsperiode(dagensDato),
            ];
        }
        props.setAllePermitteringerOgFraværesPerioder({
            ...props.allePermitteringerOgFraværesPerioder,
            permitteringer: nyePermitteringsperioder,
        });
    };

    return (
        <div className={'permitteringsperiode'}>
            <DatoIntervallInput
                datoIntervall={tilDatoIntervallDayjs(
                    props.allePermitteringerOgFraværesPerioder.permitteringer[
                        props.indeks
                    ]
                )}
                setDatoIntervall={(intervall) =>
                    oppdaterDatoIntervall(tilDatoIntervall(intervall))
                }
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
                    + Legg til ny periode
                </Knapp>
            )}
        </div>
    );
};

export default Permitteringsperiode;
