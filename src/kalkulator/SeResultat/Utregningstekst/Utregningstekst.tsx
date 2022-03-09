import React, { FunctionComponent, useContext, useEffect } from 'react';
import './Utregningstekst.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../../typer';
import Lenke from 'nav-frontend-lenker';
import { PermitteringContext } from '../../../ContextProvider';
import { finnPotensiellLøpendePermittering } from '../../utils/dato-utils';
import { lagResultatTekstForPermitteringsStartFør1Juli } from './utregningstekst-avvikling-av-koronaregler-utils';
import { lagResultatTekstNormaltRegelverk } from './utregningstekst-normalt-regelverk';
import dayjs from 'dayjs';
import { lagNyListeHvisPermitteringFør1Juli } from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';
import {
    finnFørsteDatoMedPermitteringUtenFravær,
    finnSisteDatoMedPermitteringUtenFravær,
} from '../../utils/tidslinje-utils';
import {
    loggKnappTrykketPå,
    loggPermitteringsSituasjon,
} from '../../../utils/amplitudeEvents';
import { Permitteringssregelverk } from '../SeResultat';
import { finnDenAktuelle18mndsperiodenSomSkalBeskrives } from '../../utils/beregningerForSluttPåDagpengeforlengelse';

interface Props {
    tidslinje: DatoMedKategori[];
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    gjeldendeRegelverk: Permitteringssregelverk;
}

const Utregningstekst: FunctionComponent<Props> = (props) => {
    const {
        dagensDato,
        regelEndring1Juli,
        regelEndringsDato1April,
    } = useContext(PermitteringContext);

    //useEffect kun for å logge permitteringssituasjoner
    useEffect(() => {
        const tidligstePermitteringsDato = finnFørsteDatoMedPermitteringUtenFravær(
            props.tidslinje
        );
        const forsteApril2020 = dayjs('2020-04-01');
        if (tidligstePermitteringsDato?.dato.isBefore(forsteApril2020)) {
            loggPermitteringsSituasjon(
                'Har permittering iverksatt før 1. april 2020'
            );
        }
        const sistePermitteringsDato = finnSisteDatoMedPermitteringUtenFravær(
            props.tidslinje
        );
        const løpendePermitteringEtter1Juli = finnPotensiellLøpendePermittering(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        );
        if (
            !løpendePermitteringEtter1Juli &&
            sistePermitteringsDato.isAfter(dagensDato)
        ) {
            loggPermitteringsSituasjon(
                'Arbeidsgiver planlegger ikke-løpende permittering i framtiden'
            );
        }
    }, [props.tidslinje]);

    const nyListeHvisPermitteringsdagerErSlettet =
        props.gjeldendeRegelverk === Permitteringssregelverk.KORONA_ORDNING
            ? undefined
            : lagNyListeHvisPermitteringFør1Juli(
                  props.tidslinje,
                  regelEndring1Juli
              );

    const gjeldendeTidslinje = nyListeHvisPermitteringsdagerErSlettet
        ? nyListeHvisPermitteringsdagerErSlettet
        : props.tidslinje;

    const resultatTekst =
        props.gjeldendeRegelverk === Permitteringssregelverk.KORONA_ORDNING
            ? lagResultatTekstForPermitteringsStartFør1Juli(
                  gjeldendeTidslinje,
                  props.allePermitteringerOgFraværesPerioder,
                  dagensDato,
                  regelEndringsDato1April,
                  regelEndring1Juli
              )
            : lagResultatTekstNormaltRegelverk(
                  gjeldendeTidslinje,
                  props.allePermitteringerOgFraværesPerioder,
                  dagensDato,
                  regelEndring1Juli,
                  regelEndringsDato1April,
                  !!nyListeHvisPermitteringsdagerErSlettet
              );

    return (
        <div className="utregningstekst__tekst">
            <Element>{resultatTekst.konklusjon}</Element>
            {resultatTekst.beskrivelse}
            <Normaltekst className="utregningstekst__informasjonslenker">
                <Lenke
                    href="/arbeidsgiver-permittering"
                    onClick={() =>
                        loggKnappTrykketPå(
                            'Tilbake til permitteringsveiviseren'
                        )
                    }
                >
                    Gå til veiviser for permittering
                </Lenke>
            </Normaltekst>
        </div>
    );
};

export default Utregningstekst;
