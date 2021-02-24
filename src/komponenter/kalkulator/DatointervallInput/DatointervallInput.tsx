import React, { FunctionComponent, useEffect, useState } from 'react';
import './DatointervallInput.less';
import {
    AllePermitteringerOgFraværesPerioder,
    ARBEIDSGIVERPERIODE2DATO,
    DatoIntervall,
} from '../kalkulator';
import Datovelger from '../../Datovelger/Datovelger';
import { Radio } from 'nav-frontend-skjema';
import { finn1DagFram } from '../utregninger';
import { Knapp } from 'nav-frontend-knapper';
import { Sletteknapp } from '../Sletteknapp/Sletteknapp';

interface Props {
    indeksPermitteringsperioder?: number;
    indeksFraværsperioder?: number;
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
    type: string;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setIndeksLøpendeperiode: (indeks: number | undefined) => void;
    indeksLøpendeperiode: undefined | number;
    slettPeriode: () => void;
}

const finnAktueltDatoIntervall = (
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder,
    type: string,
    indeksPermitteringsperioder?: number,
    indeksFraværsperioder?: number
) => {
    let indeks = 0;
    if (type === 'FRAVÆRSINTERVALL') {
        indeks = indeksFraværsperioder ? indeksFraværsperioder : 0;
        return allePermitteringerOgFraværesPerioder.andreFraværsperioder[
            indeks
        ];
    }
    indeks = indeksPermitteringsperioder ? indeksPermitteringsperioder : 0;
    return allePermitteringerOgFraværesPerioder.permitteringer[indeks];
};

const finnIndeks = (
    indeksPermitteringsperioder?: number,
    indeksFraværsperioder?: number
) => {
    if (indeksPermitteringsperioder) {
        return indeksPermitteringsperioder;
    }
    if (indeksFraværsperioder) {
        return indeksFraværsperioder;
    }
    return 0;
};

const checkbokstekst = (typeCheckboks: string) => {
    if (typeCheckboks === 'FRAVÆRSINTERVALL') {
        return 'Fraværet er fortsatt aktivt';
    }
    return 'Permitteringen er fortsatt aktiv';
};

const DatoIntervallInput: FunctionComponent<Props> = (props) => {
    const [erLøpende, setErLøpende] = useState(false);

    const indeks = finnIndeks(
        props.indeksPermitteringsperioder,
        props.indeksFraværsperioder
    );
    let datoIntervall: DatoIntervall = finnAktueltDatoIntervall(
        props.allePermitteringerOgFraværesPerioder,
        props.type,
        props.indeksPermitteringsperioder,
        props.indeksFraværsperioder
    );

    useEffect(() => {
        if (props.indeksLøpendeperiode !== indeks) {
            setErLøpende(false);
        }
    }, [props.indeksLøpendeperiode, indeks]);

    const oppdaterPermitteringsListe = (
        typeIntervall: string,
        fra?: Date,
        til?: Date
    ) => {
        if (typeIntervall === 'PERMITTERINGSINTERVALL') {
            oppdaterPermitteringsdatoer(fra, til);
        } else {
            oppdaterFraværsdatoer(fra, til);
        }
        // sette default til-dato
        if (fra && !datoIntervall.datoTil) {
            oppdaterPermitteringsListe(
                typeIntervall,
                undefined,
                finn1DagFram(fra)
            );
        }
    };

    const oppdaterFraværsdatoer = (fra?: Date, til?: Date) => {
        const kopiAvPermitterinsperioder = {
            ...props.allePermitteringerOgFraværesPerioder,
        };
        if (fra) {
            kopiAvPermitterinsperioder.andreFraværsperioder[
                props.indeksFraværsperioder!!
            ].datoFra = fra;
        } else {
            kopiAvPermitterinsperioder.andreFraværsperioder[
                props.indeksFraværsperioder!!
            ].datoTil = til;
        }
        props.setAllePermitteringerOgFraværesPerioder(
            kopiAvPermitterinsperioder
        );
    };

    const oppdaterPermitteringsdatoer = (fra?: Date, til?: Date) => {
        const kopiAvPermitterinsperioder: AllePermitteringerOgFraværesPerioder = {
            permitteringer: [
                ...props.allePermitteringerOgFraværesPerioder.permitteringer,
            ],
            andreFraværsperioder: [
                ...props.allePermitteringerOgFraværesPerioder
                    .andreFraværsperioder,
            ],
        };
        if (fra) {
            kopiAvPermitterinsperioder.permitteringer[
                props.indeksPermitteringsperioder!!
            ].datoFra = fra;
        } else {
            kopiAvPermitterinsperioder.permitteringer[
                props.indeksPermitteringsperioder!!
            ].datoTil = til;
        }
        props.setAllePermitteringerOgFraværesPerioder(
            kopiAvPermitterinsperioder
        );
    };

    return (
        <div className={'kalkulator__datovelgere'}>
            <Datovelger
                value={datoIntervall.datoFra}
                onChange={(event) => {
                    oppdaterPermitteringsListe(
                        props.type,
                        event.currentTarget.value
                    );
                }}
                skalVareFoer={datoIntervall.datoTil}
                overtekst="Første dag"
            />
            <div className="skjema-innhold__dato-velger-til">
                <Datovelger
                    value={datoIntervall.datoTil}
                    onChange={(event) => {
                        oppdaterPermitteringsListe(
                            props.type,
                            undefined,
                            event.currentTarget.value
                        );
                    }}
                    disabled={erLøpende}
                    overtekst="Siste dag"
                    skalVareEtter={datoIntervall.datoFra}
                />
            </div>

            <Radio
                className={'kalkulator__datovelgere-checkbox'}
                label={checkbokstekst(props.type)}
                checked={indeks === props.indeksLøpendeperiode}
                name={checkbokstekst(props.type)}
                onChange={() => {
                    const nyStatus = !erLøpende;
                    setErLøpende(!erLøpende);
                    if (nyStatus) {
                        props.setIndeksLøpendeperiode(indeks);
                        oppdaterPermitteringsListe(
                            props.type,
                            undefined,
                            ARBEIDSGIVERPERIODE2DATO
                        );
                    }
                    if (props.indeksLøpendeperiode === indeks && nyStatus) {
                        props.setIndeksLøpendeperiode(undefined);
                        setErLøpende(false);
                    }
                }}
            />
            <Sletteknapp onClick={props.slettPeriode} />
        </div>
    );
};

export default DatoIntervallInput;
