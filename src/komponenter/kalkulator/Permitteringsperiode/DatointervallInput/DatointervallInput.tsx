import React, { FunctionComponent } from 'react';
import { PermitteringsperiodeInfo } from '../../kalkulator';
import Datovelger from '../../../Datovelger/Datovelger';

interface Props {
    indeksPermitteringsperioder: number
    indeksFraværsperioderIPermitteringsperiode?: number
    setAllePermitteringer: (permitteringer: PermitteringsperiodeInfo[]) => void;
    type: string
    allePermitteringer: PermitteringsperiodeInfo[];
}

const DatoIntervallInput:FunctionComponent<Props> = props => {
    const indeksFraVærsperiode = props.indeksFraværsperioderIPermitteringsperiode ?
        props.indeksFraværsperioderIPermitteringsperiode :
        0

    const erFraværsintervall = props.type === 'FRAVÆRSINTERVALL'
    const datoFra = erFraværsintervall ?
        props.allePermitteringer[props.indeksPermitteringsperioder].
            andreFraværsIntervall[indeksFraVærsperiode].datoFra :
        props.allePermitteringer[props.indeksPermitteringsperioder].permitteringsIntervall.datoFra

    const datoTil = erFraværsintervall ?
        props.allePermitteringer[props.indeksPermitteringsperioder].
            andreFraværsIntervall[indeksFraVærsperiode].datoTil :
        props.allePermitteringer[props.indeksPermitteringsperioder].permitteringsIntervall.datoTil

    const oppdaterPermitteringsListe = ( typeIntervall: string, fra?: Date, til?: Date) => {
        if (typeIntervall === 'PERMITTERINGSINTERVALL') {
            oppdaterPermitteringsDatoer(fra, til);
        }
        else {
            oppdaterFraVærsDatoer(fra, til)
        }
    }

    const oppdaterFraVærsDatoer = (fra?: Date, til?: Date) => {
        const kopiAvPermitterinsperioder = [...props.allePermitteringer];
        if (fra) {
            const indeks = props.indeksFraværsperioderIPermitteringsperiode ?
                props.indeksFraværsperioderIPermitteringsperiode :
                0
            kopiAvPermitterinsperioder[props.indeksPermitteringsperioder].
                andreFraværsIntervall[indeks].
                datoFra = fra;
        }
        else {
            kopiAvPermitterinsperioder[props.indeksPermitteringsperioder].
                andreFraværsIntervall[props.indeksFraværsperioderIPermitteringsperiode!!].
                datoTil = til;
        }
        props.setAllePermitteringer(kopiAvPermitterinsperioder)
    }

    const oppdaterPermitteringsDatoer = (fra?: Date, til?: Date) => {
        const kopiAvPermitterinsperioder = [...props.allePermitteringer];
        if (fra) {
            kopiAvPermitterinsperioder[props.indeksPermitteringsperioder].permitteringsIntervall.
                datoFra = fra
        }
        else {
            kopiAvPermitterinsperioder[props.indeksPermitteringsperioder].permitteringsIntervall.
                datoTil = til;

        }
        props.setAllePermitteringer(kopiAvPermitterinsperioder)
    }

    return (
        <div className={'kalkulator__datovelgere'}>
            <Datovelger
                value={datoFra}
                onChange={event => {
                    oppdaterPermitteringsListe(props.type, event.currentTarget.value)
                }}
                skalVareFoer={datoTil}
                overtekst="Fra:"
            />
            <div className="skjema-innhold__dato-velger-til">
                <Datovelger
                    value={datoTil}
                    onChange={event => {
                        oppdaterPermitteringsListe(props.type, undefined ,event.currentTarget.value)
                    }}
                    disabled={false}
                    overtekst="Til:"
                    skalVareEtter={datoFra}
                />

            </div>
        </div>
    );
};

export default DatoIntervallInput;

/*<Checkbox
    label="Permittertingen er løpende"
    checked={erLøpendePermittering}
    onChange={() => {
        const oppdaterterLøpendePermittering = !erLøpendePermittering
        if (oppdaterterLøpendePermittering === true) {
            setTilDatoOgOppdaterListe(undefined)
        }
        setErLøpendePermittering(oppdaterterLøpendePermittering)
    } }
/>

 */