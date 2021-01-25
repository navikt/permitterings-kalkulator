import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    ARBEIDSGIVERPERIODE2DATO,
    DatoIntervall,
    PermitteringsperiodeInfo,
} from '../../kalkulator';
import Datovelger from '../../../Datovelger/Datovelger';

interface Props {
    indeksPermitteringsperioder?: number
    indeksFraværsperioder?: number
    setAllePermitteringerOgFraværesPerioder: (allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder) => void;
    type: string
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const DatoIntervallInput:FunctionComponent<Props> = props => {
    const [indeks, setIndeks] = useState(0)
    const [datoIntervall, setDatoIntervall] = useState<DatoIntervall>({datoFra:undefined, datoTil: undefined})

    useEffect(() => {
        if (props.type === 'FRAVÆRSINTERVALL') {
            const indeks = props.indeksFraværsperioder? props.indeksFraværsperioder : 0;
            setIndeks(indeks)
            setDatoIntervall(props.allePermitteringerOgFraværesPerioder.andreFraværsperioder[indeks])
        }
        else {
            setIndeks(props.indeksPermitteringsperioder!!)
            setDatoIntervall(props.allePermitteringerOgFraværesPerioder.permitteringer[indeks])
        }
    }, [props.indeksFraværsperioder, props.indeksPermitteringsperioder, indeks]);

    const oppdaterPermitteringsListe = ( typeIntervall: string, fra?: Date, til?: Date) => {
        if (typeIntervall === 'PERMITTERINGSINTERVALL') {
            oppdaterPermitteringsdatoer(fra, til);
        }
        else {
            oppdaterFraværsdatoer(fra, til)
        }
    }

    const oppdaterFraværsdatoer = (fra?: Date, til?: Date) => {
        const kopiAvPermitterinsperioder = {...props.allePermitteringerOgFraværesPerioder};
        if (fra) {
            kopiAvPermitterinsperioder.andreFraværsperioder[props.indeksFraværsperioder!!].datoFra = fra
        }
        else {
            kopiAvPermitterinsperioder.andreFraværsperioder[props.indeksFraværsperioder!!].datoTil = til
        }
        props.setAllePermitteringerOgFraværesPerioder(kopiAvPermitterinsperioder)
    }

    const oppdaterPermitteringsdatoer = (fra?: Date, til?: Date) => {
        const kopiAvPermitterinsperioder: AllePermitteringerOgFraværesPerioder = {
            permitteringer: [...props.allePermitteringerOgFraværesPerioder.permitteringer],
            andreFraværsperioder: [...props.allePermitteringerOgFraværesPerioder.andreFraværsperioder]

        };
        if (fra) {
            kopiAvPermitterinsperioder.permitteringer[props.indeksPermitteringsperioder!!].datoFra = fra
        }
        else {
            kopiAvPermitterinsperioder.permitteringer[props.indeksPermitteringsperioder!!].datoTil = til
        }
        props.setAllePermitteringerOgFraværesPerioder(kopiAvPermitterinsperioder)
    }

    return (
        <div className={'kalkulator__datovelgere'}>
            <Datovelger
                value={datoIntervall.datoFra}
                onChange={event => {
                    oppdaterPermitteringsListe(props.type, event.currentTarget.value)
                }}
                skalVareFoer={datoIntervall.datoTil}
                overtekst="Fra:"
            />
            <div className="skjema-innhold__dato-velger-til">
                <Datovelger
                    value={datoIntervall.datoTil}
                    onChange={event => {
                        oppdaterPermitteringsListe(props.type, undefined ,event.currentTarget.value)
                    }}
                    disabled={false}
                    overtekst="Til:"
                    skalVareEtter={datoIntervall.datoFra}
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