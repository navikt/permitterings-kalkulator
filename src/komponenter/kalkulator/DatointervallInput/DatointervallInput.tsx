import React, { FunctionComponent, useEffect, useState } from 'react';
import './DatointervallInput.less';
import {
    AllePermitteringerOgFraværesPerioder,
    ARBEIDSGIVERPERIODE2DATO,
    DatoIntervall,
} from '../kalkulator';
import Datovelger from '../../Datovelger/Datovelger';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { finn1DagFram } from '../utregninger';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';

interface Props {
    indeksPermitteringsperioder?: number
    indeksFraværsperioder?: number
    setAllePermitteringerOgFraværesPerioder: (allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder) => void;
    type: string
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setEnPeriodeAlleredeLøpende: (finnesløpendePermitterintb: boolean) => void
    enPeriodeAlleredeLøpende: boolean
}

const DatoIntervallInput:FunctionComponent<Props> = props => {
    const [feilMelding, setFeilmelding] = useState('')
    const [erLøpende, setErLøpende] = useState(false)

    const finnDatoIntervall = () => {
        let indeks;
        let datoIntervall: DatoIntervall;
        if (props.type === 'FRAVÆRSINTERVALL') {
            indeks = props.indeksFraværsperioder? props.indeksFraværsperioder : 0;
            datoIntervall = props.allePermitteringerOgFraværesPerioder.andreFraværsperioder[indeks]
        }
        else {
            indeks = props.indeksPermitteringsperioder ? props.indeksPermitteringsperioder : 0
            datoIntervall = props.allePermitteringerOgFraværesPerioder.permitteringer[indeks]
        }
        return datoIntervall
    }

    const [datoIntervall, setDatoInterval] = useState(finnDatoIntervall())

    const checkbokstekst = props.type === 'FRAVÆRSINTERVALL' ? 'Fraværet er fortsatt aktivt' :
        'Permitteringen er fortsatt aktiv'

    useEffect(() => {
        if (!props.enPeriodeAlleredeLøpende) {
            setFeilmelding('')
        }

    }, [props.enPeriodeAlleredeLøpende]);

    const oppdaterPermitteringsListe = ( typeIntervall: string, fra?: Date, til?: Date) => {
        if (typeIntervall === 'PERMITTERINGSINTERVALL') {
            oppdaterPermitteringsdatoer(fra, til);
        }
        else {
            oppdaterFraværsdatoer(fra, til)
        }
        //setter default til-dato til neste dag etter fra-datoen
        if (fra && !datoIntervall.datoTil) {
            //oppdaterPermitteringsListe(typeIntervall,undefined, finn1DagFram(fra))
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
        console.log('prøver å ende verdi', skrivOmDato(fra))
        if (fra) {
            kopiAvPermitterinsperioder.permitteringer[props.indeksPermitteringsperioder!!].datoFra = fra
            console.log('Klarer endre verdi', skrivOmDato(fra))
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
                    setDatoInterval({datoFra: event.currentTarget.value, datoTil: datoIntervall.datoTil})
                }}
                skalVareFoer={datoIntervall.datoTil}
                overtekst="Første dag"
            />
            <div className="skjema-innhold__dato-velger-til">
                <Datovelger
                    value={datoIntervall.datoTil}
                    onChange={event => {
                        oppdaterPermitteringsListe(props.type, undefined ,event.currentTarget.value)
                        setDatoInterval({datoFra: datoIntervall.datoTil, datoTil: event.currentTarget.value})
                    }}
                    disabled={erLøpende}
                    overtekst="Siste dag"
                    skalVareEtter={datoIntervall.datoFra}
                />
            </div>

            <Checkbox
                label={checkbokstekst}
                checked={erLøpende}
                onChange={() => {
                    const nyStatus = !erLøpende
                    if (nyStatus && props.enPeriodeAlleredeLøpende) {
                        setFeilmelding('Kun en periode kan være løpende')
                    }
                    else if (!nyStatus && props.enPeriodeAlleredeLøpende) {
                        props.setEnPeriodeAlleredeLøpende(false);
                        setErLøpende(nyStatus)
                        setFeilmelding('');
                    }
                    else {
                        if (nyStatus) {
                            props.setEnPeriodeAlleredeLøpende(true)
                            oppdaterPermitteringsListe(props.type, undefined, ARBEIDSGIVERPERIODE2DATO);
                        }
                        setErLøpende(nyStatus)
                    }
                }
                }
            />
            <Element className={'kalkulator__feilmelding'}>{feilMelding}</Element>
        </div>
    );
};

export default DatoIntervallInput;