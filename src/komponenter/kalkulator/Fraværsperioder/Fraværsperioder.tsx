import React, { FunctionComponent } from 'react';
import './Fraværsperioder.less';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AllePermitteringerOgFraværesPerioder, DatoIntervall } from '../typer';
import { Knapp } from 'nav-frontend-knapper';
import { Dayjs } from 'dayjs';
import { Infotekst } from '../Infotekst/Infotekst';
import timeglassSvg from './timeglass.svg';
import {
    finnSisteTilDato,
    finnTidligsteFraDato,
    datoIntervallOverlapperMedPerioder,
    perioderOverlapper,
    tilGyldigDatoIntervall,
} from '../utils/dato-utils';
import Fraværsperiode from './Fraværsperiode';
import AlertStripe from 'nav-frontend-alertstriper';

interface Props {
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const Fraværsperioder: FunctionComponent<Props> = (props) => {
    const antallFraværsperioder =
        props.allePermitteringerOgFraværesPerioder.andreFraværsperioder.length;

    const leggTilNyFraværsperiode = () => {
        const kopiAvAllPermitteringsInfo = {
            ...props.allePermitteringerOgFraværesPerioder,
        };
        let startDatoIntervall: Dayjs | undefined;
        const tidligstePermitteringsdato = finnTidligsteFraDato(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        );
        if (antallFraværsperioder === 0) {
            startDatoIntervall = tidligstePermitteringsdato;
        } else {
            startDatoIntervall =
                finnSisteTilDato(
                    props.allePermitteringerOgFraværesPerioder
                        .andreFraværsperioder
                ) || tidligstePermitteringsdato;
        }
        kopiAvAllPermitteringsInfo.andreFraværsperioder.push({
            datoFra: startDatoIntervall?.add(1, 'day'),
            datoTil: undefined,
        });
        props.setAllePermitteringerOgFraværesPerioder(
            kopiAvAllPermitteringsInfo
        );
    };

    const feilmelding = perioderOverlapper(
        props.allePermitteringerOgFraværesPerioder.andreFraværsperioder
    )
        ? 'Du kan ikke ha overlappende fraværsperioder'
        : '';

    const setFraværsperiode = (
        datoIntervall: Partial<DatoIntervall>,
        indeks: number
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

    const slettFraværsperiode = (indeks: number) => {
        const kopiAvAllPermitteringsInfo = {
            ...props.allePermitteringerOgFraværesPerioder,
        };
        if (kopiAvAllPermitteringsInfo.andreFraværsperioder.length > 0) {
            kopiAvAllPermitteringsInfo.andreFraværsperioder.splice(indeks, 1);
        }
        props.setAllePermitteringerOgFraværesPerioder(
            kopiAvAllPermitteringsInfo
        );
    };

    const fraVærsperiodeElementer = props.allePermitteringerOgFraværesPerioder.andreFraværsperioder.map(
        (fraværsintervall, indeks) => {
            const inngårIPermitteringsperiode =
                !tilGyldigDatoIntervall(fraværsintervall) ||
                datoIntervallOverlapperMedPerioder(
                    props.allePermitteringerOgFraværesPerioder.permitteringer,
                    fraværsintervall
                );
            return (
                <Fraværsperiode
                    fraværsperiode={fraværsintervall}
                    setFraværsperiode={(intervall) =>
                        setFraværsperiode(intervall, indeks)
                    }
                    slettFraværsperiode={() => slettFraværsperiode(indeks)}
                    inngårIPermitteringsperiode={inngårIPermitteringsperiode}
                />
            );
        }
    );

    return (
        <div className="fraværsperioder">
            <Undertittel tag="h2" className="fraværsperioder__tittel">
                2. Legg inn eventuelle fravær under permitteringen
            </Undertittel>
            <Infotekst imgSrc={timeglassSvg} imgAlt="Timeglass">
                <Normaltekst>Følgende fravær skal legges inn:</Normaltekst>
                <ul className="fraværsperioder__infotekst-liste">
                    <Normaltekst tag="li">
                        100&nbsp;% sykmelding (gjelder også deltidsstillinger)
                    </Normaltekst>
                    <Normaltekst tag="li">
                        100&nbsp;% permisjon (gjelder også deltidsstillinger)
                    </Normaltekst>
                    <Normaltekst tag="li">Ferieavvikling</Normaltekst>
                </ul>
            </Infotekst>
            {fraVærsperiodeElementer}
            {feilmelding.length > 0 && (
                <AlertStripe
                    type={'feil'}
                    className="fraværsperioder__feilmelding"
                    aria-live="polite"
                    aria-label="Feilmelding"
                >
                    {feilmelding}
                </AlertStripe>
            )}
            <Knapp
                className="fraværsperioder__legg-til-knapp"
                onClick={leggTilNyFraværsperiode}
            >
                + Legg til fravær
            </Knapp>
        </div>
    );
};

export default Fraværsperioder;
