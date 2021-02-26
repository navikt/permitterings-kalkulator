import React, { FunctionComponent, useState } from 'react';
import './Fraværsperioder.less';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
} from '../../kalkulator';
import DatoIntervallInput from '../../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';
import {
    finn1DagFram,
    finnSisteDato,
    finnTidligsteDato,
} from '../../utregninger';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

interface Props {
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const Fraværsperioder: FunctionComponent<Props> = (props) => {
    const antallFraværsperioder =
        props.allePermitteringerOgFraværesPerioder.andreFraværsperioder.length;

    const leggTilNyFraVærsPeriode = () => {
        const kopiAvAllPermitteringsInfo = {
            ...props.allePermitteringerOgFraværesPerioder,
        };
        let startDatoIntervall: Date | undefined;
        const tidligstePermitteringsdato = finnTidligsteDato(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        );
        if (antallFraværsperioder === 0) {
            startDatoIntervall = tidligstePermitteringsdato;
        } else {
            startDatoIntervall =
                finnSisteDato(
                    props.allePermitteringerOgFraværesPerioder
                        .andreFraværsperioder
                ) || tidligstePermitteringsdato;
        }
        kopiAvAllPermitteringsInfo.andreFraværsperioder.push({
            datoFra: finn1DagFram(startDatoIntervall),
            datoTil: undefined,
        });
        props.setAllePermitteringerOgFraværesPerioder(
            kopiAvAllPermitteringsInfo
        );
    };

    const oppdaterDatoIntervall = (
        indeks: number,
        datoIntervall: DatoIntervall
    ) => {
        const kopiAvFraværsperioder = [
            ...props.allePermitteringerOgFraværesPerioder.andreFraværsperioder,
        ];
        kopiAvFraværsperioder[indeks] = datoIntervall;
        props.setAllePermitteringerOgFraværesPerioder({
            ...props.allePermitteringerOgFraværesPerioder,
            andreFraværsperioder: kopiAvFraværsperioder,
        });
    };

    const fraVærsperiodeElementer = props.allePermitteringerOgFraværesPerioder.andreFraværsperioder.map(
        (fraværsintervall, indeks) => {
            return (
                <DatoIntervallInput
                    erLøpendeLabel="Fraværet er fortsatt aktivt"
                    key={indeks}
                    datoIntervall={
                        props.allePermitteringerOgFraværesPerioder
                            .andreFraværsperioder[indeks]
                    }
                    setDatoIntervall={(datoIntervall) =>
                        oppdaterDatoIntervall(indeks, datoIntervall)
                    }
                    slettPeriode={() => slettFraværsperiode(indeks)}
                />
            );
        }
    );

    const slettFraværsperiode = (indeks: number) => {
        const kopiAvAllPermitteringsInfo = {
            ...props.allePermitteringerOgFraværesPerioder,
        };
        if (kopiAvAllPermitteringsInfo.andreFraværsperioder.length > 1) {
            kopiAvAllPermitteringsInfo.andreFraværsperioder.splice(indeks, 1);
        }
        props.setAllePermitteringerOgFraværesPerioder(
            kopiAvAllPermitteringsInfo
        );
    };

    return (
        <div>
            <Undertittel className={'kalkulator__fraværsperioder__tittel'}>
                3. Legg inn eventuelle fravær den permitterte har hatt
            </Undertittel>
            <Ekspanderbartpanel
                tittel={
                    <Normaltekst>
                        <strong>Om fraværsperioder</strong>
                    </Normaltekst>
                }
            >
                <Normaltekst>
                    Følgende fravær trekkes fra i beregningen av antall uker
                    permittert
                    <ul>
                        <li>100% sykmelding</li>
                        <li>Ferieavvikling</li>
                        <li>Permisjon</li>
                    </ul>
                    <br />
                    <strong>
                        {' '}
                        Følgende fravær påvirker ikke beregningen og skal ikke
                        fylles inn
                    </strong>
                    <ul>
                        <li>Gradert sykmelding</li>
                        <li>Gradert permisjon</li>
                    </ul>
                    <br />
                    Dette gjelder uavhengig av stillingenes størrelse og
                    permitteringsgrad. Hvis en arbeidstaker er 100% sykmeldt fra
                    en deltidsstilling er dette et heldtidsfravær.
                </Normaltekst>
            </Ekspanderbartpanel>
            {fraVærsperiodeElementer}
            <Knapp
                className={'kalkulator__legg-til-knapp'}
                onClick={() => leggTilNyFraVærsPeriode()}
            >
                + Legg til ny periode
            </Knapp>
        </div>
    );
};

export default Fraværsperioder;
