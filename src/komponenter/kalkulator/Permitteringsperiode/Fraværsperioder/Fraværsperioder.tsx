import React, { FunctionComponent, useState } from 'react';
import './Fraværsperioder.less';
import { Ingress } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder } from '../../kalkulator';
import DatoIntervallInput from '../../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';

interface Props {
    setAllePermitteringerOgFraværesPerioder: (allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder) => void;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    etFraværAlleredeLøpende: boolean;
    setFraværAlleredeLøpende: (finnesLøpendeFravær: boolean) => void;
}

const Fraværsperioder:FunctionComponent<Props> = props => {
    const [antallFraværsperioder, setAntallFraværsperioder] = useState(0);

    const leggTilNyFraVærsPeriode = () => {
        setAntallFraværsperioder(antallFraværsperioder+1);
        const kopiAvAllPermitteringsInfo = {...props.allePermitteringerOgFraværesPerioder}
        kopiAvAllPermitteringsInfo.andreFraværsperioder.push({datoFra: undefined, datoTil: undefined})
    }

    const fraVærsperiodeElementer = props.allePermitteringerOgFraværesPerioder.andreFraværsperioder
        .map ( (fraværsintervall, indeks) => {
        return (
            <DatoIntervallInput
                setEnPeriodeAlleredeLøpende={props.setFraværAlleredeLøpende}
                enPeriodeAlleredeLøpende={props.etFraværAlleredeLøpende}
                setAllePermitteringerOgFraværesPerioder={props.setAllePermitteringerOgFraværesPerioder}
                allePermitteringerOgFraværesPerioder={props.allePermitteringerOgFraværesPerioder}
                indeksFraværsperioder={indeks}
                type={'FRAVÆRSINTERVALL'}
            />

        );

    })

    return (
        <div>
            <Ingress className={'kalkulator__fraværsperioder__ingress'}>Har den ansatte hatt annet fravær i disse periodene?</Ingress>
            {fraVærsperiodeElementer}
            <Knapp className={'kalkulator__legg-til-knapp'} onClick={()=>leggTilNyFraVærsPeriode()}>+ legg til ny fraværsperiode</Knapp>
        </div>
    );
};

export default Fraværsperioder;