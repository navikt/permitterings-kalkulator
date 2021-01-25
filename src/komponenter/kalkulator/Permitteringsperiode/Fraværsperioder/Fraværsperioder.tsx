import React, { FunctionComponent, useState } from 'react';
import './Fraværsperioder.less';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder, PermitteringsperiodeInfo } from '../../kalkulator';
import DatoIntervallInput from '../DatointervallInput/DatointervallInput';


interface Props {
    setAllePermitteringerOgFraværesPerioder: (allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder) => void;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const Fraværsperioder:FunctionComponent<Props> = props => {
    const [antallFraværsperioder, setAntallFraværsperioder] = useState(0);

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

    const leggTilNyFraVærsPeriode = (svar: string) => {
        if (svar === 'Ja') {
            setAntallFraværsperioder(antallFraværsperioder+1);
            const kopiAvAllPermitteringsInfo = {...props.allePermitteringerOgFraværesPerioder}
            kopiAvAllPermitteringsInfo.andreFraværsperioder.push({datoFra: undefined, datoTil: undefined})
        }
    }

    const fraVærsperiodeElementer = props.allePermitteringerOgFraværesPerioder.andreFraværsperioder
        .map ( (fraværsintervall, indeks) => {
        return (
            <DatoIntervallInput
                setAllePermitteringerOgFraværesPerioder={props.setAllePermitteringerOgFraværesPerioder}
                allePermitteringerOgFraværesPerioder={props.allePermitteringerOgFraværesPerioder}
                indeksFraværsperioder={indeks}
                type={'FRAVÆRSINTERVALL'}

            />

        );

    })

    return (
        <div className={'fraværsperioder__radioknapper-med-pop-up'}>
            <Element>Andre fraværsperioder</Element>
            {fraVærsperiodeElementer}
            <RadioPanelGruppe onChange={(event, value) => leggTilNyFraVærsPeriode(value)} radios={radios} name={'Har du hatt annet fravær grunnet permisjoner eller 100 % sykmelding?'}/>
        </div>
    );
};

export default Fraværsperioder;