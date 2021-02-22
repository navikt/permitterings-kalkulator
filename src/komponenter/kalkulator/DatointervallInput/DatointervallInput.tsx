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

interface Props {
    indeksPermitteringsperioder?: number;
    indeksFraværsperioder?: number;
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
    type: string;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setIndeksLøpendeperiode: (indeks: number) => void;
    indeksLøpendeperiode: undefined | number;
}

const finnAktueltDatoIntervall = (
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder,
    indeksPermitteringsperioder?: number,
    indeksFraværsperioder?: number
) => {
    if (indeksPermitteringsperioder) {
        return allePermitteringerOgFraværesPerioder.permitteringer[
            indeksPermitteringsperioder
        ];
    }
    if (indeksFraværsperioder) {
        return allePermitteringerOgFraværesPerioder.andreFraværsperioder[
            indeksFraværsperioder
        ];
    }
    return allePermitteringerOgFraværesPerioder.permitteringer[0];
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
        props.indeksPermitteringsperioder,
        props.indeksFraværsperioder
    );

    useEffect(() => {
        if (props.indeksLøpendeperiode !== indeks) {
            setErLøpende(false);
        } else {
            setErLøpende(true);
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
                checked={erLøpende}
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
                }}
            />
        </div>
    );
};

export default DatoIntervallInput;
