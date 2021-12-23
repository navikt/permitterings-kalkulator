import React, { FunctionComponent, useContext, useEffect } from 'react';
import './Utregningstekst.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../../typer';
import Lenke from 'nav-frontend-lenker';
import lampeikon from './lampeikon.svg';
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
import {
    finnDenAktuelle18mndsperiodenSomSkalBeskrives,
    harLøpendePermitteringMedOppstartFørRegelendring,
} from '../../utils/beregningerForRegelverksendring1Jan';
import { Permitteringssregelverk } from '../SeResultat';

interface Props {
    tidslinje: DatoMedKategori[];
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    harNåddMaksKoronaRegelverk: Boolean;
    gjeldendeRegelverk: Permitteringssregelverk;
}

const Utregningstekst: FunctionComponent<Props> = (props) => {
    const {
        dagensDato,
        regelEndring1Juli,
        regelEndringsDato1Mars,
    } = useContext(PermitteringContext);

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
        if (!props.harNåddMaksKoronaRegelverk) {
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
                  regelEndringsDato1Mars,
                  regelEndring1Juli
              )
            : lagResultatTekstNormaltRegelverk(
                  gjeldendeTidslinje,
                  props.allePermitteringerOgFraværesPerioder,
                  dagensDato,
                  regelEndring1Juli,
                  regelEndringsDato1Mars
              );

    const maksDagerUtenLønnsplikt = props.harNåddMaksKoronaRegelverk
        ? 49 * 7
        : 26 * 7;
    const datoRegelEndring = props.harNåddMaksKoronaRegelverk
        ? regelEndringsDato1Mars
        : regelEndring1Juli;
    const aktuell18mndsperiode = finnDenAktuelle18mndsperiodenSomSkalBeskrives(
        props.gjeldendeRegelverk,
        gjeldendeTidslinje,
        dagensDato,
        regelEndringsDato1Mars,
        regelEndring1Juli,
        maksDagerUtenLønnsplikt,
        harLøpendePermitteringMedOppstartFørRegelendring(
            props.allePermitteringerOgFraværesPerioder.permitteringer,
            regelEndring1Juli
        )
    );

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
