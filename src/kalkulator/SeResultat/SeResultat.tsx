import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import { Dayjs } from 'dayjs';
import { Hovedknapp } from 'nav-frontend-knapper';
import { ReactComponent as PekIkon } from './cursor-touch-2.svg';
import Tidslinje from '../Tidslinje/Tidslinje';
import Utregningstekst from './Utregningstekst/Utregningstekst';
import { Undertittel } from 'nav-frontend-typografi';
import { fraPixelTilProsent } from '../Tidslinje/tidslinjefunksjoner';
import './SeResultat.less';
import { formaterDato, perioderOverlapper } from '../utils/dato-utils';
import { loggKnappTrykketPå } from '../../utils/amplitudeEvents';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { arbeidsgiverPotensieltStartetLønnspliktFør1Juli } from './Utregningstekst/spesialCaseForLønnspliktStartetFør1Juli';
import ContextProvider, { PermitteringContext } from '../../ContextProvider';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Checkbox, RadioPanelGruppe } from 'nav-frontend-skjema';
import {
    finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli,
    harLøpendePermitteringMedOppstartFørRegelendring,
} from '../utils/beregningerForRegelverksendring1Jan';
import lampeikon from './lampeikon.svg';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    set18mndsPeriode: (dato: Dayjs) => void;
    sisteDagIPeriode: Dayjs;
    endringAv: 'datovelger' | 'tidslinje' | 'ingen';
    setEndringAv: (endringAv: 'datovelger' | 'tidslinje') => void;
    tidslinje: DatoMedKategori[];
}

export enum Permitteringssregelverk {
    KORONA_ORDNING = 'KORONA_ORDNING',
    NORMALT_REGELVERK = 'NORMALT_REGELVERK',
}

export const SeResultat: FunctionComponent<Props> = (props) => {
    const [resultatVises, setResultatVises] = useState(false);
    const { regelEndring1Juli, regelEndringsDato1Mars } = useContext(
        PermitteringContext
    );
    const [gjeldeneRegelverk, setGjeldendeRegelverk] = useState(
        Permitteringssregelverk.NORMALT_REGELVERK
    );
    const [
        harNåddMaksKoronaRegelverk,
        setHarNåddMaksKoronaRegelverk,
    ] = useState(false);
    const [
        visBeskjedLønnspliktPeriode,
        setVisBeskjedLønnspliktPeriode,
    ] = useState(false);

    useEffect(() => {
        const skalFølgeKoronaOrdning =
            harNåddMaksKoronaRegelverk ||
            harLøpendePermitteringMedOppstartFørRegelendring(
                props.allePermitteringerOgFraværesPerioder.permitteringer,
                regelEndring1Juli
            );
        const gjeldendeRegelverk = skalFølgeKoronaOrdning
            ? Permitteringssregelverk.KORONA_ORDNING
            : Permitteringssregelverk.NORMALT_REGELVERK;
        setGjeldendeRegelverk(gjeldendeRegelverk);
    }, [
        harNåddMaksKoronaRegelverk,
        props.allePermitteringerOgFraværesPerioder,
        regelEndring1Juli,
        props.tidslinje,
    ]);

    console.log(gjeldeneRegelverk);

    useEffect(() => {
        if (resultatVises) {
            const oppstartFørRegelendring = harLøpendePermitteringMedOppstartFørRegelendring(
                props.allePermitteringerOgFraværesPerioder.permitteringer,
                regelEndring1Juli
            );
            const harNåddMaksPåKoronaRegelverkAvsluttetPermittering = !!finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli(
                props.tidslinje,
                regelEndringsDato1Mars,
                regelEndring1Juli
            );
            setHarNåddMaksKoronaRegelverk(
                oppstartFørRegelendring ||
                    harNåddMaksPåKoronaRegelverkAvsluttetPermittering
            );
        }
    }, [
        props.allePermitteringerOgFraværesPerioder.permitteringer,
        regelEndring1Juli,
        resultatVises,
    ]);

    useEffect(() => {
        setResultatVises(false);
        setVisBeskjedLønnspliktPeriode(false);
        if (
            props.tidslinje.length > 0 &&
            !perioderOverlapper(
                props.allePermitteringerOgFraværesPerioder.permitteringer
            )
        ) {
            props.setEndringAv('datovelger');
        }
    }, [props.tidslinje, props.allePermitteringerOgFraværesPerioder]);

    const skalViseTidslinje =
        (window.location.href.includes('labs') ||
            process.env.NODE_ENV === 'development') &&
        props.tidslinje.length;

    useEffect(() => {
        if (
            props.allePermitteringerOgFraværesPerioder.permitteringer.length >
                0 &&
            props.tidslinje.length > 0
        ) {
            const harLønnspliktISpesialtilfelle = arbeidsgiverPotensieltStartetLønnspliktFør1Juli(
                props.tidslinje,
                regelEndringsDato1Mars,
                regelEndring1Juli
            );
            setVisBeskjedLønnspliktPeriode(!!harLønnspliktISpesialtilfelle);
        }
    }, [
        props.tidslinje,
        regelEndring1Juli,
        props.allePermitteringerOgFraværesPerioder,
    ]);

    const endreRegelverk = () => {
        if (gjeldeneRegelverk === Permitteringssregelverk.KORONA_ORDNING) {
            setResultatVises(false);
            setGjeldendeRegelverk(Permitteringssregelverk.NORMALT_REGELVERK);
        } else {
            setGjeldendeRegelverk(Permitteringssregelverk.KORONA_ORDNING);
        }
    };

    return (
        <>
            <Undertittel className="se-resultat__tittel">
                3. Se resultatet av beregningen
            </Undertittel>
            <div className="se-resultat__innhold">
                <Hovedknapp
                    className="se-resultat__knapp"
                    onClick={() => {
                        setResultatVises(true);
                        loggKnappTrykketPå('Se beregningen');
                    }}
                >
                    <PekIkon className="se-resultat__knapp-ikon" />
                    Se beregningen
                </Hovedknapp>

                {resultatVises && (
                    <div className="utregningstekst">
                        <img
                            className="utregningstekst__lampeikon"
                            src={lampeikon}
                            alt=""
                        />
                        {visBeskjedLønnspliktPeriode && (
                            <AlertStripeInfo
                                className={
                                    'utregningstekst_alert-lonnsplit-for-1-juli'
                                }
                            >
                                Begynte lønnspliktperioden før 1. juli?{' '}
                                <Checkbox
                                    label={
                                        'Begynte lønnspliktperioden før 1. juli?'
                                    }
                                    checked={
                                        gjeldeneRegelverk ===
                                        Permitteringssregelverk.KORONA_ORDNING
                                    }
                                    onChange={() => {
                                        endreRegelverk();
                                        setResultatVises(true);
                                    }}
                                />
                            </AlertStripeInfo>
                        )}
                        <Utregningstekst
                            tidslinje={props.tidslinje}
                            allePermitteringerOgFraværesPerioder={
                                props.allePermitteringerOgFraværesPerioder
                            }
                            harNåddMaksKoronaRegelverk={
                                harNåddMaksKoronaRegelverk
                            }
                            gjeldendeRegelverk={gjeldeneRegelverk}
                        />
                        <div
                            className={'se-resultat__tidslinje-wrapper'}
                            id="tidslinje-wrapper"
                        >
                            {skalViseTidslinje && (
                                <Ekspanderbartpanel tittel={'Vis illustrasjon'}>
                                    <Tidslinje
                                        gjeldendeRegelverk={gjeldeneRegelverk}
                                        allePermitteringerOgFraværesPerioder={
                                            props.allePermitteringerOgFraværesPerioder
                                        }
                                        set18mndsPeriode={
                                            props.set18mndsPeriode
                                        }
                                        sisteDagIPeriode={
                                            props.sisteDagIPeriode
                                        }
                                        breddeAvDatoObjektIProsent={fraPixelTilProsent(
                                            'tidslinje-wrapper',
                                            props.tidslinje.length
                                        )}
                                        endringAv={props.endringAv}
                                        setEndringAv={props.setEndringAv}
                                        tidslinje={props.tidslinje}
                                    />
                                </Ekspanderbartpanel>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
