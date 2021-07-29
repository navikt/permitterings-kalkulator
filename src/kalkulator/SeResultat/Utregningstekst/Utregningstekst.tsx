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
import { lagResultatTekstForPermitteringsStartFør1Juli } from './utregningstekst-avvikling-av-koronaregler-utils';
import {
    finnDenAktuelle18mndsperiodenSomSkalBeskrives,
    harLøpendePermitteringMedOppstartFørRegelendring,
} from '../../utils/beregningerForRegelverksendring1Okt';
import { lagResultatTekstNormaltRegelverk } from './utregningstekst-normalt-regelverk';
import dayjs from 'dayjs';

interface Props {
    tidslinje: DatoMedKategori[];
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

export enum Permitteringssregelverk {
    KORONA_ORDNING = 'KORONA_ORDNING',
    NORMALT_REGELVERK = 'NORMALT_REGELVERK',
}

const Utregningstekst: FunctionComponent<Props> = (props) => {
    const {
        dagensDato,
        regelEndring1Juli,
        regelEndringsDato1Oktober,
    } = useContext(PermitteringContext);

    const oppstartFørRegelendring = harLøpendePermitteringMedOppstartFørRegelendring(
        props.allePermitteringerOgFraværesPerioder.permitteringer,
        regelEndring1Juli
    );

    const gjeldendeRegelverk = oppstartFørRegelendring
        ? Permitteringssregelverk.KORONA_ORDNING
        : Permitteringssregelverk.NORMALT_REGELVERK;

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

    const maksDagerUtenLønnsplikt = oppstartFørRegelendring ? 49 * 7 : 26 * 7;
    const datoRegelEndring = oppstartFørRegelendring
        ? regelEndringsDato1Oktober
        : regelEndring1Juli;
    const aktuell18mndsperiode = finnDenAktuelle18mndsperiodenSomSkalBeskrives(
        gjeldendeRegelverk,
        props.tidslinje,
        dagensDato,
        datoRegelEndring,
        maksDagerUtenLønnsplikt
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
                <Lenke href="/arbeidsgiver-permittering">
                    Tilbake til permitteringsveiviseren
                </Lenke>
            </Normaltekst>
        </div>
    );
};

export default Utregningstekst;
