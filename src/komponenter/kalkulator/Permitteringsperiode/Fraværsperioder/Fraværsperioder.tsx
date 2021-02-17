import React, { FunctionComponent, useState } from 'react';
import './Fraværsperioder.less';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder } from '../../kalkulator';
import DatoIntervallInput from '../../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';
import { finn1DagFram, finnSistePermitteringsdato, finnTidligstePermitteringsdato } from '../../utregninger';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

interface Props {
    setAllePermitteringerOgFraværesPerioder: (allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder) => void;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    etFraværAlleredeLøpende: boolean;
    setFraværAlleredeLøpende: (finnesLøpendeFravær: boolean) => void;
}

const Fraværsperioder:FunctionComponent<Props> = props => {
    const [antallFraværsperioder, setAntallFraværsperioder] = useState(0);

    const leggTilNyFraVærsPeriode = () => {
        setAntallFraværsperioder(antallFraværsperioder+1);
        const kopiAvAllPermitteringsInfo = {...props.allePermitteringerOgFraværesPerioder}
        let startDatoIntervall: Date | undefined;
        if (antallFraværsperioder === 0) {
            startDatoIntervall = finnTidligstePermitteringsdato(props.allePermitteringerOgFraværesPerioder.permitteringer)
        }
        else {
            startDatoIntervall = finnSistePermitteringsdato(props.allePermitteringerOgFraværesPerioder.andreFraværsperioder)!!
        }
        kopiAvAllPermitteringsInfo.andreFraværsperioder.push(
            {datoFra: finn1DagFram(startDatoIntervall), datoTil: undefined})
    }

    const fraVærsperiodeElementer = props.allePermitteringerOgFraværesPerioder.andreFraværsperioder
        .map ( (fraværsintervall, indeks) => {
        return (
            <DatoIntervallInput
                setEnPeriodeAlleredeLøpende={props.setFraværAlleredeLøpende}
                enPeriodeAlleredeLøpende={props.etFraværAlleredeLøpende}
                setAllePermitteringerOgFraværesPerioder={props.setAllePermitteringerOgFraværesPerioder}
                allePermitteringerOgFraværesPerioder={props.allePermitteringerOgFraværesPerioder}
                indeksFraværsperioder={indeks}
                type={'FRAVÆRSINTERVALL'}
                key={indeks}
            />

        );

    })

    return (
        <div>
                <Undertittel className={'kalkulator__fraværsperioder__tittel'}>3. Legg inn eventuelle fravær den permitterte har hatt</Undertittel>
                <Ekspanderbartpanel
                    tittel={<Normaltekst><strong>Om fraværsperioder</strong></Normaltekst>}
                >
                    <Normaltekst>
                        Følgende fravær trekkes fra i beregningen av antall uker permittert
                        <ul>
                            <li>100% sykmelding</li>
                            <li>Ferieavvikling</li>
                            <li>Permisjon</li>
                        </ul>
                        <br/>

                        <strong> Følgende fravær påvirker ikke beregningen og skal ikke fylles inn</strong>
                        <ul>
                            <li>Gradert sykmelding</li>
                            <li>Gradert permisjon</li>
                        </ul>
                        <br/>
                        Dette gjelder uavhengig av stillingenes størrelse og permitteringsgrad. Hvis en arbeidstaker er 100% sykmeldt fra en deltidsstilling er dette et heldtidsfravær.
                    </Normaltekst>
                </Ekspanderbartpanel>
            {fraVærsperiodeElementer}
            <Knapp className={'kalkulator__legg-til-knapp'} onClick={()=>leggTilNyFraVærsPeriode()}>+ legg til ny fraværsperiode</Knapp>
        </div>
    );
};

export default Fraværsperioder;