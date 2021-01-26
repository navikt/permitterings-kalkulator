import React, { FunctionComponent, useState } from 'react';
import './Fraværsperioder.less';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { Element, Ingress } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder, PermitteringsperiodeInfo } from '../../kalkulator';
import DatoIntervallInput from '../../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';


interface Props {
    setAllePermitteringerOgFraværesPerioder: (allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder) => void;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const Fraværsperioder:FunctionComponent<Props> = props => {
    const [antallFraværsperioder, setAntallFraværsperioder] = useState(0);
    const [erLøpendeFraværsperiode, setErLøpendeFravæesperiode] = useState(true)

    const radios = [
        {
            label: 'Ja',
            value: 'Ja',
            id: '-Ja'
        },
        {
            label: 'Nei',
            value: 'Nei',
            id: '-Nei'
        },
    ];

    const leggTilNyFraVærsPeriode = () => {
        setAntallFraværsperioder(antallFraværsperioder+1);
        const kopiAvAllPermitteringsInfo = {...props.allePermitteringerOgFraværesPerioder}
        kopiAvAllPermitteringsInfo.andreFraværsperioder.push({datoFra: undefined, datoTil: undefined})
    }

    const fraVærsperiodeElementer = props.allePermitteringerOgFraværesPerioder.andreFraværsperioder
        .map ( (fraværsintervall, indeks) => {
        return (
            <DatoIntervallInput
                setAllePermitteringerOgFraværesPerioder={props.setAllePermitteringerOgFraværesPerioder}
                allePermitteringerOgFraværesPerioder={props.allePermitteringerOgFraværesPerioder}
                indeksFraværsperioder={indeks}
                type={'FRAVÆRSINTERVALL'}
                erLøpende={erLøpendeFraværsperiode}
                setErLøpende={setErLøpendeFravæesperiode}

            />

        );

    })

    return (
        <div className={'kalkulator__fraværsperioder'}>
            <Ingress className={'kalkulator__fraværsperioder__ingress'}>Har den ansatte hatt annet fravær i disse periodene?</Ingress>
            {fraVærsperiodeElementer}
            <Knapp className={'kalkulator__legg-til-knapp'} onClick={()=>leggTilNyFraVærsPeriode()}>+ legg til ny fraværsperiode</Knapp>
        </div>
    );
};

export default Fraværsperioder;