import React, { FunctionComponent, useContext } from 'react';
import './Utregningstekst.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../../typer';
import Lenke from 'nav-frontend-lenker';
import lampeikon from './lampeikon.svg';
import { PermitteringContext } from '../../../ContextProvider';
import { DetaljertUtregning } from '../DetaljertUtregning/DetaljertUtregning';
import { filtrerBortUdefinerteDatoIntervaller } from '../../utils/dato-utils';
import { finnDenAktuelle18mndsperiodenSomSkalBeskrives } from '../../utils/beregningerForAGP2';
import { lagResultatTekstForPermitteringsStartFør1Juli } from './utregningstekst-avvikling-av-koronaregler-utils';
import { harLøpendePermitteringMedOppstartFørRegelendring } from '../../utils/beregningerForRegelverksendring1Okt';
import { lagResultatTekstNormaltRegelverk } from './utregningstekst-normalt-regelverk';
import dayjs from 'dayjs';

interface Props {
    tidslinje: DatoMedKategori[];
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const Utregningstekst: FunctionComponent<Props> = (props) => {
    const { dagensDato, regelEndringsDato1Oktober } = useContext(
        PermitteringContext
    );

    const oppstartFørRegelendring = harLøpendePermitteringMedOppstartFørRegelendring(
        props.allePermitteringerOgFraværesPerioder,
        regelEndringsDato1Oktober
    );

    const resultatTekst = oppstartFørRegelendring
        ? lagResultatTekstForPermitteringsStartFør1Juli(
              props.tidslinje,
              props.allePermitteringerOgFraværesPerioder,
              dagensDato,
              regelEndringsDato1Oktober
          )
        : lagResultatTekstNormaltRegelverk(
              props.tidslinje,
              props.allePermitteringerOgFraværesPerioder,
              dagensDato,
              dayjs('2021-07-01')
          );

    //denne brukes bare i tabellen
    const aktuell18mndsperiode = finnDenAktuelle18mndsperiodenSomSkalBeskrives(
        props.tidslinje,
        dagensDato,
        regelEndringsDato1Oktober,
        210
    );

    return (
        <div className="utregningstekst">
            <img
                className="utregningstekst__lampeikon"
                src={lampeikon}
                alt=""
            />
            <Element>{resultatTekst.konklusjon}</Element>
            {resultatTekst.beskrivelse}
            {aktuell18mndsperiode && (
                <DetaljertUtregning
                    tidslinje={props.tidslinje}
                    permitteringsperioder={filtrerBortUdefinerteDatoIntervaller(
                        props.allePermitteringerOgFraværesPerioder
                            .permitteringer
                    )}
                    aktuell18mndsperiode={aktuell18mndsperiode}
                />
            )}
            <Normaltekst className="utregningstekst__informasjonslenker">
                <Lenke href="https://arbeidsgiver.nav.no/arbeidsgiver-permittering/#narSkalJegUtbetale">
                    Les mer om arbeidsgiverperiode 2
                </Lenke>
                <Lenke href="/arbeidsgiver-permittering">
                    Tilbake til permitteringsveiviseren
                </Lenke>
            </Normaltekst>
        </div>
    );
};

export default Utregningstekst;
