import React, { FunctionComponent, useContext, useEffect } from 'react';
import './Utregningstekst.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../../typer';
import Lenke from 'nav-frontend-lenker';
import { lagResultatTekstForPermitteringsStartFør1Juli } from './utregningstekst-avvikling-av-koronaregler-utils';
import { lagResultatTekstNormaltRegelverk } from './utregningstekst-normalt-regelverk';
import { lagNyListeHvisPermitteringFør1Juli } from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';

import { loggKnappTrykketPå } from '../../../utils/amplitudeEvents';
import { Permitteringssregelverk } from '../SeResultat';
import {
    dagensDato,
    regelEndring1Juli,
    regelEndringsDato1April,
} from '../../../konstanterKnyttetTilRegelverk';

interface Props {
    tidslinje: DatoMedKategori[];
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    gjeldendeRegelverk: Permitteringssregelverk;
}

const Utregningstekst: FunctionComponent<Props> = (props) => {
    //Denne funksjonen kan slettes 18 måneder etter 1. juli 2021 (30.12.2022), da vil den ikke lenger vil være relevant. props.tidslinje kan alltid brukes etter dette.
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
