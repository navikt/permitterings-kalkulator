import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useState,
} from 'react';
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
import { slettPermitteringsdagerFørDato } from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';

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

    const [
        harOppstartFørRegelEndring,
        setHarOppstartFørRegelEndring,
    ] = useState(false);

    useEffect(() => {
        const oppstartFørRegelendring = harLøpendePermitteringMedOppstartFørRegelendring(
            props.allePermitteringerOgFraværesPerioder.permitteringer,
            regelEndring1Juli
        );
        setHarOppstartFørRegelEndring(oppstartFørRegelendring);
    }, [
        props.allePermitteringerOgFraværesPerioder.permitteringer,
        regelEndring1Juli,
    ]);

    const gjeldendeRegelverk = harOppstartFørRegelEndring
        ? Permitteringssregelverk.KORONA_ORDNING
        : Permitteringssregelverk.NORMALT_REGELVERK;

    const gjeldendeTidslinje = harOppstartFørRegelEndring
        ? props.tidslinje
        : slettPermitteringsdagerFørDato(props.tidslinje, regelEndring1Juli);

    const resultatTekst = harOppstartFørRegelEndring
        ? lagResultatTekstForPermitteringsStartFør1Juli(
              gjeldendeTidslinje,
              props.allePermitteringerOgFraværesPerioder,
              dagensDato,
              regelEndringsDato1Oktober
          )
        : lagResultatTekstNormaltRegelverk(
              gjeldendeTidslinje,
              props.allePermitteringerOgFraværesPerioder,
              dagensDato,
              dayjs('2021-07-01')
          );

    const maksDagerUtenLønnsplikt = harOppstartFørRegelEndring
        ? 49 * 7
        : 26 * 7;
    const datoRegelEndring = harOppstartFørRegelEndring
        ? regelEndringsDato1Oktober
        : regelEndring1Juli;
    const aktuell18mndsperiode = finnDenAktuelle18mndsperiodenSomSkalBeskrives(
        gjeldendeRegelverk,
        gjeldendeTidslinje,
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
                    tidslinje={gjeldendeTidslinje}
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
