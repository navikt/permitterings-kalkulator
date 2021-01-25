import React, { FunctionComponent, useState } from 'react';
import '../kalkulator.less';
import { Input, RadioPanelGruppe } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { PermitteringsperiodeInfo } from '../kalkulator';
import Permitteringsperiode from './Permittertingsperiode';
import DatoIntervallInput from './DatointervallInput/DatointervallInput';


interface Props {
    indeks: number
    setAllePermitteringer: (permitteringer: PermitteringsperiodeInfo[]) => void;
    allePermitteringer: PermitteringsperiodeInfo[];
    type:string
}

const Fraværsperioder:FunctionComponent<Props> = props => {
    const [antallFraværsperioder, setAntallFraværsperioder] = useState(0);

    const radios = [
        {
            label: 'Ja',
            value: 'Ja',
            id: props.type+'-Ja-'+props.indeks,
        },
        {
            label: 'Nei',
            value: 'Nei',
            id: props.type+'-Nei-'+props.indeks,
        },
    ];

    const leggTilNyFraVærsPeriode = (svar: string) => {
        if (svar === 'Ja') {
            setAntallFraværsperioder(antallFraværsperioder+1);
            const kopiAvAllPermitteringsInfo = [...props.allePermitteringer]
            kopiAvAllPermitteringsInfo[props.indeks].andreFraværsIntervall.push({datoFra: undefined, datoTil: undefined})
        }
    }

    const fraVærsperiodeElementer = props.allePermitteringer[props.indeks].andreFraværsIntervall
        .map ( (fraværsintervall, sublisteindeks) => {
        return (
            <DatoIntervallInput
                setAllePermitteringer={props.setAllePermitteringer}
                allePermitteringer={props.allePermitteringer}
                indeksPermitteringsperioder={props.indeks}
                indeksFraværsperioderIPermitteringsperiode={sublisteindeks}
                type={'FRAVÆRSINTERVALL'}

            />

        );

    })

    return (
        <div className={'permitteringsperiode__radioknapper-med-pop-up'}>
            <Element>Andre fraværsperioder</Element>
            {fraVærsperiodeElementer}
            <RadioPanelGruppe onChange={(event, value) => leggTilNyFraVærsPeriode(value)} radios={radios} name={'Har du hatt annet fravær grunnet permisjoner eller 100 % sykmelding?'}/>
        </div>
    );
};

export default Fraværsperioder;