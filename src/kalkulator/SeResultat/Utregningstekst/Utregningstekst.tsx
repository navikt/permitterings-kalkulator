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
import {
    finnPotensiellLøpendePermittering,
    formaterDato,
} from '../../utils/dato-utils';
import { lagResultatTekstForPermitteringsStartFør1Juli } from './utregningstekst-avvikling-av-koronaregler-utils';
import {
    finnDatoForMaksPermittering,
    finnDenAktuelle18mndsperiodenSomSkalBeskrives,
    finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli,
    harLøpendePermitteringMedOppstartFørRegelendring,
} from '../../utils/beregningerForRegelverksendring1Nov';
import { lagResultatTekstNormaltRegelverk } from './utregningstekst-normalt-regelverk';
import dayjs from 'dayjs';
import { lagNyListeHvisPermitteringFør1Juli } from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';
import {
    erPermittertVedDato,
    finnFørsteDatoMedPermitteringUtenFravær,
    finnSisteDatoMedPermitteringUtenFravær,
} from '../../utils/tidslinje-utils';
import {
    loggKnappTrykketPå,
    loggPermitteringsSituasjon,
} from '../../../utils/amplitudeEvents';

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
        regelEndringsDato1November,
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
        if (!harLøpendePermitteringFør1Juli) {
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
        }
    }, [props.tidslinje]);

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
              regelEndringsDato1November
          )
        : lagResultatTekstNormaltRegelverk(
              gjeldendeTidslinje,
              props.allePermitteringerOgFraværesPerioder,
              dagensDato,
              regelEndring1Juli
          );

    const maksDagerUtenLønnsplikt = harLøpendePermitteringFør1Juli
        ? 49 * 7
        : 26 * 7;
    const datoRegelEndring = harLøpendePermitteringFør1Juli
        ? regelEndringsDato1November
        : regelEndring1Juli;
    const aktuell18mndsperiode = finnDenAktuelle18mndsperiodenSomSkalBeskrives(
        gjeldendeRegelverk,
        gjeldendeTidslinje,
        dagensDato,
        datoRegelEndring,
        maksDagerUtenLønnsplikt
    );

    const beskjedOmMaksPermitteringNåddIFortiden =
        Permitteringssregelverk.NORMALT_REGELVERK &&
        finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli(
            props.tidslinje,
            regelEndringsDato1November,
            regelEndring1Juli
        )
            ? 'OBS Du bryter reglene den: ' +
              formaterDato(
                  finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli(
                      props.tidslinje,
                      regelEndringsDato1November,
                      regelEndring1Juli
                  )!!
              )
            : '';

    /*
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
     */

    return (
        <div className="utregningstekst">
            <img
                className="utregningstekst__lampeikon"
                src={lampeikon}
                alt=""
            />
            <Element>{resultatTekst.konklusjon}</Element>
            {resultatTekst.beskrivelse}
            <Element>{beskjedOmMaksPermitteringNåddIFortiden}</Element>

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
