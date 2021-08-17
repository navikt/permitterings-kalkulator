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
import { lagNyListeHvisPermitteringFør1Juli } from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';

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
        harLøpendePermitteringFør1Juli,
        setHarLøpendePermitteringFør1Juli,
    ] = useState(false);

    useEffect(() => {
        const oppstartFørRegelendring = harLøpendePermitteringMedOppstartFørRegelendring(
            props.allePermitteringerOgFraværesPerioder.permitteringer,
            regelEndring1Juli
        );
        setHarLøpendePermitteringFør1Juli(oppstartFørRegelendring);
    }, [
        props.allePermitteringerOgFraværesPerioder.permitteringer,
        regelEndring1Juli,
    ]);

    const gjeldendeRegelverk = harLøpendePermitteringFør1Juli
        ? Permitteringssregelverk.KORONA_ORDNING
        : Permitteringssregelverk.NORMALT_REGELVERK;
    const nyListeHvisPermitteringsdagerErSlettet = harLøpendePermitteringFør1Juli
        ? undefined
        : lagNyListeHvisPermitteringFør1Juli(
              props.tidslinje,
              regelEndring1Juli
          );

    const gjeldendeTidslinje = nyListeHvisPermitteringsdagerErSlettet
        ? nyListeHvisPermitteringsdagerErSlettet
        : props.tidslinje;

    const resultatTekst = harLøpendePermitteringFør1Juli
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

    const maksDagerUtenLønnsplikt = harLøpendePermitteringFør1Juli
        ? 49 * 7
        : 26 * 7;
    const datoRegelEndring = harLøpendePermitteringFør1Juli
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
                    permitteringsDagerFør1JuliSlettet={
                        !!nyListeHvisPermitteringsdagerErSlettet
                    }
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
