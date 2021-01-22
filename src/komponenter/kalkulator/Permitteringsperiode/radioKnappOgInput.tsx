import React, { FunctionComponent, useState } from 'react';
import '../kalkulator.less';
import { Input, RadioPanelGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
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
    const [svar, setSvar] = useState('');

    const leggTilNyFraVærsPeriode = () => {

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



    /*const oppdaterInfoOgListe = (value: string) => {
        const kopiAvInfo: PermitteringsperiodeInfo[] = [...props.allePermitteringer]
        if (props.type === 'SYKMELDING') {
            kopiAvInfo[props.indeks].antallDagerSykmeldt = parseInt(value)
        }
        else {
            kopiAvInfo[props.indeks].antallDagerPErmisjonOgFerie = parseInt(value)
        }
        props.setAllePermitteringer(kopiAvInfo);
    }

     */

    return (
        <div className={'permitteringsperiode__radioknapper-med-pop-up'}>
            {fraVærsperiodeElementer}
        </div>
    );
};

export default Fraværsperioder;