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
import { Undertittel, Element } from 'nav-frontend-typografi';
import { fraPixelTilProsent } from '../Tidslinje/tidslinjefunksjoner';
import './SeResultat.less';
import { formaterDato } from '../utils/dato-utils';
import { loggKnappTrykketPå } from '../../utils/amplitudeEvents';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { arbeidsgiverPotensieltStartetLønnspliktFør1Juli } from './Utregningstekst/spesialCaseForLønnspliktStartetFør1Juli';
import { PermitteringContext } from '../../ContextProvider';
import {
    finnDatoForMaksPermittering,
    harLøpendePermitteringFørDatoSluttPaDagepengeForlengelse,
    nåddMaksAntallDagerKoronaordningIkkeLøpendePermittering,
} from '../utils/beregningerForSluttPåDagpengeforlengelse';
import lampeikon from './lampeikon.svg';
import { erPermittertVedDato } from '../utils/tidslinje-utils';
import { Checkbox } from '@navikt/ds-react';
import { finnDatoForMaksPermitteringNormaltRegelverk } from '../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';

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
    const { regelEndring1Juli, regelEndringsDato1April } = useContext(
        PermitteringContext
    );
    const [gjeldeneRegelverk, setGjeldendeRegelverk] = useState<
        Permitteringssregelverk | undefined
    >(Permitteringssregelverk.NORMALT_REGELVERK);
    const [
        harNåddMaksKoronaRegelverk,
        setHarNåddMaksKoronaRegelverk,
    ] = useState(false);
    const [
        visBeskjedLønnspliktPeriode,
        setVisBeskjedLønnspliktPeriode,
    ] = useState(false);

    useEffect(() => {
        setResultatVises(false);
        setVisBeskjedLønnspliktPeriode(false);
        setGjeldendeRegelverk(Permitteringssregelverk.NORMALT_REGELVERK);
        setHarNåddMaksKoronaRegelverk(false);
    }, [props.tidslinje, props.allePermitteringerOgFraværesPerioder]);

    useEffect(() => {
        const erPermittertPåSluttPåDagpengeForlengelse = erPermittertVedDato(
            props.tidslinje,
            regelEndringsDato1April
        );
        if (erPermittertPåSluttPåDagpengeForlengelse) {
            if (
                harLøpendePermitteringFørDatoSluttPaDagepengeForlengelse(
                    props.allePermitteringerOgFraværesPerioder.permitteringer,
                    regelEndring1Juli
                )
            ) {
                setHarNåddMaksKoronaRegelverk(true);
            } else {
                const nåddMaksMedKoronaRegelverk = !!nåddMaksAntallDagerKoronaordningIkkeLøpendePermittering(
                    props.tidslinje,
                    regelEndringsDato1April,
                    regelEndring1Juli
                );
                if (nåddMaksMedKoronaRegelverk) {
                    setHarNåddMaksKoronaRegelverk(nåddMaksMedKoronaRegelverk);
                }
            }
        }
    }, [props.tidslinje]);

    useEffect(() => {
        if (harNåddMaksKoronaRegelverk) {
            setGjeldendeRegelverk(Permitteringssregelverk.KORONA_ORDNING);
        }
    }, [harNåddMaksKoronaRegelverk]);

    //tidslinja er deaktivert i prod
    const skalViseTidslinje = true;

    useEffect(() => {
        if (
            props.allePermitteringerOgFraværesPerioder.permitteringer.length &&
            props.tidslinje.length
        ) {
            const kanHaLønnspliktFør1JuliSpesialtilfelle = arbeidsgiverPotensieltStartetLønnspliktFør1Juli(
                props.tidslinje,
                regelEndringsDato1April,
                regelEndring1Juli
            );
            setVisBeskjedLønnspliktPeriode(
                !!kanHaLønnspliktFør1JuliSpesialtilfelle
            );
            if (!!kanHaLønnspliktFør1JuliSpesialtilfelle) {
                setGjeldendeRegelverk(undefined);
            }
        }
    }, [
        props.tidslinje,
        regelEndring1Juli,
        regelEndringsDato1April,
        props.allePermitteringerOgFraværesPerioder,
    ]);

    const endreRegelverk = (regelverk: Permitteringssregelverk) => {
        if (gjeldeneRegelverk === regelverk) {
            setGjeldendeRegelverk(undefined);
        } else {
            setGjeldendeRegelverk(regelverk);
        }
        setResultatVises(true);
    };

    return (
        <>
            <Undertittel className="se-resultat__tittel">
                3. Se resultatet av beregningen
            </Undertittel>
            <div className="se-resultat__innhold">
                {!!props.allePermitteringerOgFraværesPerioder.permitteringer[0]
                    .datoFra && (
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
                )}

                {resultatVises && (
                    <div className="utregningstekst">
                        <img
                            className="utregningstekst__lampeikon"
                            src={lampeikon}
                            alt=""
                        />
                        {visBeskjedLønnspliktPeriode && (
                            <>
                                <Element>
                                    Begynte lønnspliktperioden før 1. juli for
                                    permitteringen fylt inn fra {''}
                                    {formaterDato(
                                        arbeidsgiverPotensieltStartetLønnspliktFør1Juli(
                                            props.tidslinje,
                                            regelEndringsDato1April,
                                            regelEndring1Juli
                                        )!!
                                    )}
                                    ?
                                </Element>
                                <div
                                    className={
                                        'utregningstekst__checkbokscontainer'
                                    }
                                >
                                    <Checkbox
                                        className={'utregningstekst__checkboks'}
                                        value="Ja"
                                        checked={
                                            gjeldeneRegelverk ===
                                            Permitteringssregelverk.KORONA_ORDNING
                                        }
                                        onChange={() => {
                                            endreRegelverk(
                                                Permitteringssregelverk.KORONA_ORDNING
                                            );
                                        }}
                                    >
                                        Ja
                                    </Checkbox>
                                    <Checkbox
                                        className={'utregningstekst__checkboks'}
                                        value="Nei"
                                        checked={
                                            gjeldeneRegelverk ===
                                            Permitteringssregelverk.NORMALT_REGELVERK
                                        }
                                        onChange={() => {
                                            endreRegelverk(
                                                Permitteringssregelverk.NORMALT_REGELVERK
                                            );
                                        }}
                                    >
                                        Nei
                                    </Checkbox>
                                </div>
                            </>
                        )}
                        {gjeldeneRegelverk && (
                            <Utregningstekst
                                tidslinje={props.tidslinje}
                                allePermitteringerOgFraværesPerioder={
                                    props.allePermitteringerOgFraværesPerioder
                                }
                                harNåddMaksKoronaRegelverk={
                                    harNåddMaksKoronaRegelverk
                                }
                                gjeldendeRegelverk={
                                    gjeldeneRegelverk
                                        ? gjeldeneRegelverk
                                        : Permitteringssregelverk.NORMALT_REGELVERK
                                }
                            />
                        )}
                        <div
                            className={'se-resultat__tidslinje-wrapper'}
                            id="tidslinje-wrapper"
                        >
                            {skalViseTidslinje && (
                                <Ekspanderbartpanel tittel={'Vis illustrasjon'}>
                                    <Tidslinje
                                        gjeldendeRegelverk={
                                            gjeldeneRegelverk
                                                ? gjeldeneRegelverk
                                                : Permitteringssregelverk.NORMALT_REGELVERK
                                        }
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
