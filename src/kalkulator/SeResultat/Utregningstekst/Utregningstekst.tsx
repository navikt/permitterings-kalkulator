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
        harNåddMaksKoronaRegelverk,
        setHarNåddMaksKoronaRegelverk,
    ] = useState(false);

    useEffect(() => {
        const oppstartFørRegelendring = harLøpendePermitteringMedOppstartFørRegelendring(
            props.allePermitteringerOgFraværesPerioder.permitteringer,
            regelEndring1Juli
        );
        const harNåddMaksPåKoronaRegelverkAvsluttetPermittering = !!finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli(
            props.tidslinje,
            regelEndringsDato1November,
            regelEndring1Juli
        );
        setHarNåddMaksKoronaRegelverk(
            oppstartFørRegelendring ||
                harNåddMaksPåKoronaRegelverkAvsluttetPermittering
        );
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
        if (!harNåddMaksKoronaRegelverk) {
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

    const gjeldendeRegelverk = harNåddMaksKoronaRegelverk
        ? Permitteringssregelverk.KORONA_ORDNING
        : Permitteringssregelverk.NORMALT_REGELVERK;
    const nyListeHvisPermitteringsdagerErSlettet = harNåddMaksKoronaRegelverk
        ? undefined
        : lagNyListeHvisPermitteringFør1Juli(
              props.tidslinje,
              regelEndring1Juli
          );

    const gjeldendeTidslinje = nyListeHvisPermitteringsdagerErSlettet
        ? nyListeHvisPermitteringsdagerErSlettet
        : props.tidslinje;

    const resultatTekst = harNåddMaksKoronaRegelverk
        ? lagResultatTekstForPermitteringsStartFør1Juli(
              gjeldendeTidslinje,
              props.allePermitteringerOgFraværesPerioder,
              dagensDato,
              regelEndringsDato1November,
              regelEndring1Juli
          )
        : lagResultatTekstNormaltRegelverk(
              gjeldendeTidslinje,
              props.allePermitteringerOgFraværesPerioder,
              dagensDato,
              regelEndring1Juli
          );

    const maksDagerUtenLønnsplikt = harNåddMaksKoronaRegelverk
        ? 49 * 7
        : 26 * 7;
    const datoRegelEndring = harNåddMaksKoronaRegelverk
        ? regelEndringsDato1November
        : regelEndring1Juli;
    const aktuell18mndsperiode = finnDenAktuelle18mndsperiodenSomSkalBeskrives(
        gjeldendeRegelverk,
        gjeldendeTidslinje,
        dagensDato,
        regelEndringsDato1November,
        regelEndring1Juli,
        maksDagerUtenLønnsplikt
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
