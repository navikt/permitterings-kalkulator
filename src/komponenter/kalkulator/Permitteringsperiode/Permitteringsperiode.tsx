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
    setEnPermitteringAlleredeLøpende: (finnesløpende: boolean) => void;
    enPermitteringAlleredeLøpende: boolean;
}

const Permitteringsperiode: FunctionComponent<Props> = (props) => {
    const leggTilNyPermitteringsperiode = () => {
        const sistRegistrerteDag = finnSistePermitteringsdato(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        );
        const nyPeriode: DatoIntervall = {
            datoFra: finn1DagFram(sistRegistrerteDag),
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

    return (
        <div className={'permitteringsperiode'}>
            <DatoIntervallInput
                setEnPeriodeAlleredeLøpende={
                    props.setEnPermitteringAlleredeLøpende
                }
                enPeriodeAlleredeLøpende={props.enPermitteringAlleredeLøpende}
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
                    onClick={() => leggTilNyPermitteringsperiode()}
                >
                    + legg til ny permitteringsperiode
                </Knapp>
            )}
        </div>
    );
};

export default Permitteringsperiode;
