import React, { FunctionComponent, useState } from 'react';
import './Fraværsperioder.less';
import { Ingress } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder } from '../../kalkulator';
import DatoIntervallInput from '../../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import {
    finn1DagFram,
    finnSistePermitteringsdato,
    finnTidligstePermitteringsdato,
} from '../../utregninger';

interface Props {
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    etFraværAlleredeLøpende: boolean;
    setFraværAlleredeLøpende: (finnesLøpendeFravær: boolean) => void;
}

const Fraværsperioder: FunctionComponent<Props> = (props) => {
    const [antallFraværsperioder, setAntallFraværsperioder] = useState(0);

    const leggTilNyFraVærsPeriode = () => {
        setAntallFraværsperioder(antallFraværsperioder + 1);
        const kopiAvAllPermitteringsInfo = {
            ...props.allePermitteringerOgFraværesPerioder,
        };
        let startDatoIntervall: Date | undefined;
        if (antallFraværsperioder === 0) {
            startDatoIntervall = finnTidligstePermitteringsdato(
                props.allePermitteringerOgFraværesPerioder.permitteringer
            );
        } else {
            startDatoIntervall = finnSistePermitteringsdato(
                props.allePermitteringerOgFraværesPerioder.andreFraværsperioder
            );
        }
        kopiAvAllPermitteringsInfo.andreFraværsperioder.push({
            datoFra: finn1DagFram(startDatoIntervall),
            datoTil: undefined,
        });
    };

    const fraVærsperiodeElementer = props.allePermitteringerOgFraværesPerioder.andreFraværsperioder.map(
        (fraværsintervall, indeks) => {
            return (
                <DatoIntervallInput
                    setEnPeriodeAlleredeLøpende={props.setFraværAlleredeLøpende}
                    enPeriodeAlleredeLøpende={props.etFraværAlleredeLøpende}
                    setAllePermitteringerOgFraværesPerioder={
                        props.setAllePermitteringerOgFraværesPerioder
                    }
                    allePermitteringerOgFraværesPerioder={
                        props.allePermitteringerOgFraværesPerioder
                    }
                    indeksFraværsperioder={indeks}
                    type={'FRAVÆRSINTERVALL'}
                    key={indeks}
                />
            );
        }
    );

    return (
        <div>
            <div className={'kalkulator__ingress-med-hjelpetekst'}>
                <Ingress className={'kalkulator__fraværsperioder__ingress'}>
                    Har den ansatte hatt annet fravær i disse periodene?
                </Ingress>
                <Hjelpetekst>
                    Fravær på heltid grunnet ferie, permisjon eller sykmelding
                    telles ikke med i beregningen. Dette gjelder uavhengig av
                    stillingens størrelse og permitteringsgrad. Hvis
                    arbeidstakeren er 100 prosent sykmeldt fra en
                    deltidsstilling er dette et heltidsfravær
                </Hjelpetekst>
            </div>
            {fraVærsperiodeElementer}
            <Knapp
                className={'kalkulator__legg-til-knapp'}
                onClick={() => leggTilNyFraVærsPeriode()}
            >
                + legg til ny fraværsperiode
            </Knapp>
        </div>
    );
};

export default Fraværsperioder;
