import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useState,
} from 'react';
import './Tidslinje.less';
import {
    AllePermitteringerOgFraværesPerioder,
    DatointervallKategori,
    DatoMedKategori,
} from '../typer';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Draggable from 'react-draggable';

import { Fargeforklaringer } from './Fargeforklaringer';
import {
    lagHTMLObjektForAlleDatoer,
    lagHTMLObjektForPeriodeMedFarge,
    lagObjektForRepresentasjonAvPerioderMedFarge,
    regnUtHorisontalAvstandMellomToElement,
    regnUtPosisjonFraVenstreGittSluttdato,
} from './tidslinjefunksjoner';
import { PermitteringContext } from '../../ContextProvider';
import { Dayjs } from 'dayjs';
import {
    antallDagerGått,
    finnDato18MndFram,
    finnDato18MndTilbake,
    formaterDatoIntervall,
} from '../utils/dato-utils';
import Tekstforklaring from './Årsmarkør/Tekstforklaring/Tekstforklaring';
import { Permitteringssregelverk } from '../SeResultat/SeResultat';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnDatoForMaksPermittering,
} from '../utils/beregningerForSluttPåDagpengeforlengelse';
import { finnFørsteDatoMedPermitteringUtenFravær } from '../utils/tidslinje-utils';
import { finnDatoForMaksPermitteringNormaltRegelverk } from '../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    set18mndsPeriode: (dato: Dayjs) => void;
    sisteDagIPeriode: Dayjs;
    breddeAvDatoObjektIProsent: number;
    endringAv: 'datovelger' | 'tidslinje' | 'ingen';
    setEndringAv: (endringAv: 'datovelger' | 'tidslinje') => void;
    tidslinje: DatoMedKategori[];
    gjeldendeRegelverk: Permitteringssregelverk;
}

const Tidslinje: FunctionComponent<Props> = (props) => {
    const [datoOnDrag, setDatoOnDrag] = useState<Dayjs | undefined>(undefined);
    const [tidslinjeSomSkalVises, setTidslinjeSomSkalVises] = useState<
        DatoMedKategori[]
    >(props.tidslinje);
    const {
        dagensDato,
        regelEndringsDato1April,
        regelEndring1Juli,
    } = useContext(PermitteringContext);
    const [
        absoluttPosisjonFraVenstreDragElement,
        setAbsoluttPosisjonFraVenstreDragElement,
    ] = useState(
        regnUtPosisjonFraVenstreGittSluttdato(
            tidslinjeSomSkalVises,
            props.breddeAvDatoObjektIProsent,
            props.sisteDagIPeriode
        )
    );

    const datoMaksPermitteringNås =
        props.gjeldendeRegelverk === Permitteringssregelverk.NORMALT_REGELVERK
            ? finnDatoForMaksPermitteringNormaltRegelverk(
                  tidslinjeSomSkalVises,
                  regelEndringsDato1April,
                  26 * 7
              )
            : finnDatoForMaksPermitteringNormaltRegelverk(
                  tidslinjeSomSkalVises,
                  regelEndringsDato1April,
                  49 * 7
              );

    const [
        posisjonsStylingDragElement,
        setPosisjonsStylingDragElement,
    ] = useState<
        | '-moz-initial'
        | 'inherit'
        | 'initial'
        | 'revert'
        | 'unset'
        | '-webkit-sticky'
        | 'absolute'
        | 'fixed'
        | 'relative'
        | 'static'
        | 'sticky'
        | undefined
    >('absolute');

    useEffect(() => {
        if (
            props.gjeldendeRegelverk ===
            Permitteringssregelverk.NORMALT_REGELVERK
        ) {
            const nyTidslinje: DatoMedKategori[] = [];
            props.tidslinje.forEach((datoMedKategori, index) => {
                if (
                    datoMedKategori.kategori !==
                        DatointervallKategori.IKKE_PERMITTERT &&
                    datoMedKategori.dato.isBefore(regelEndring1Juli)
                ) {
                    const nyDatoMedKategori: DatoMedKategori = {
                        dato: datoMedKategori.dato,
                        kategori:
                            DatointervallKategori.SLETTET_PERMITTERING_FØR_1_JULI,
                    };
                    nyTidslinje.push(nyDatoMedKategori);
                } else {
                    nyTidslinje.push({ ...datoMedKategori });
                }
            });
            setTidslinjeSomSkalVises(nyTidslinje);
        }
    }, [props.tidslinje, regelEndring1Juli, props.gjeldendeRegelverk]);

    useEffect(() => {
        if (props.endringAv === 'datovelger') {
            setPosisjonsStylingDragElement('absolute');
        }
    }, [props.endringAv]);

    useEffect(() => {
        const antallDagerFørLønnsplikt =
            props.gjeldendeRegelverk ===
            Permitteringssregelverk.NORMALT_REGELVERK
                ? 26 * 7
                : 49 * 7;
        const maksAntallPermitteringsdagerNådd = finnDatoForMaksPermittering(
            tidslinjeSomSkalVises,
            regelEndringsDato1April,
            antallDagerFørLønnsplikt
        );
        if (maksAntallPermitteringsdagerNådd) {
            const forstePermitteringI18mndsIntervall = finnFørsteDatoMedPermitteringUtenFravær(
                tidslinjeSomSkalVises,
                finnDato18MndTilbake(maksAntallPermitteringsdagerNådd)
            );
            props.set18mndsPeriode(
                finnDato18MndFram(forstePermitteringI18mndsIntervall!!.dato)
            );
        } else {
            const intervallDerMaksKanNås = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinjeSomSkalVises,
                regelEndringsDato1April,
                dagensDato,
                antallDagerFørLønnsplikt
            );
            props.set18mndsPeriode(intervallDerMaksKanNås!!.datoTil);
        }
    }, [tidslinjeSomSkalVises, props.gjeldendeRegelverk]);

    useEffect(() => {
        const nyPosisjonFraVenstre = regnUtPosisjonFraVenstreGittSluttdato(
            tidslinjeSomSkalVises,
            props.breddeAvDatoObjektIProsent,
            props.sisteDagIPeriode
        );
        if (datoOnDrag && !datoOnDrag.isSame(props.sisteDagIPeriode, 'day')) {
            const posisjonDragElement = regnUtPosisjonFraVenstreGittSluttdato(
                tidslinjeSomSkalVises,
                props.breddeAvDatoObjektIProsent,
                datoOnDrag
            );
            setAbsoluttPosisjonFraVenstreDragElement(
                nyPosisjonFraVenstre - posisjonDragElement
            );
        } else {
            setAbsoluttPosisjonFraVenstreDragElement(nyPosisjonFraVenstre);
        }
    }, [
        datoOnDrag,
        props.sisteDagIPeriode,
        props.breddeAvDatoObjektIProsent,
        tidslinjeSomSkalVises,
    ]);

    const htmlElementerForHverDato = lagHTMLObjektForAlleDatoer(
        tidslinjeSomSkalVises,
        props.breddeAvDatoObjektIProsent,
        dagensDato,
        datoMaksPermitteringNås
    );
    const htmlFargeObjekt = lagHTMLObjektForPeriodeMedFarge(
        lagObjektForRepresentasjonAvPerioderMedFarge(tidslinjeSomSkalVises),
        props.breddeAvDatoObjektIProsent
    );

    const OnTidslinjeDrag = () => {
        props.setEndringAv('tidslinje');
        setPosisjonsStylingDragElement('static');
        let indeksStartDato = 0;
        let minimumAvstand = 1000;
        htmlElementerForHverDato.forEach((objekt, indeks) => {
            const avstand = regnUtHorisontalAvstandMellomToElement(
                'draggable-periode',
                'kalkulator-tidslinjeobjekt-' + indeks
            );
            if (avstand < minimumAvstand) {
                minimumAvstand = avstand;
                indeksStartDato = indeks;
            }
        });
        setDatoOnDrag(tidslinjeSomSkalVises[indeksStartDato].dato);
    };

    const datoVisesPaDragElement =
        props.endringAv === 'tidslinje' && datoOnDrag
            ? datoOnDrag
            : props.sisteDagIPeriode;

    const skalVæreAnimasjonPåTidslinje = datoOnDrag
        ? 'ingen-animasjon'
        : 'animasjon';

    const get18mndsperiode = () => (
        <div
            style={{
                position: posisjonsStylingDragElement,
                left: absoluttPosisjonFraVenstreDragElement.toString() + '%',
                width:
                    (
                        props.breddeAvDatoObjektIProsent *
                        antallDagerGått(
                            finnDato18MndTilbake(datoVisesPaDragElement),
                            datoVisesPaDragElement
                        )
                    ).toString() + '%',
            }}
            id={'draggable-periode'}
            className={
                'kalkulator__draggable-periode ' + skalVæreAnimasjonPåTidslinje
            }
        >
            <div className={'kalkulator__draggable-kant venstre'} />
            <div className={'kalkulator__draggable-tekst-container'}>
                <Normaltekst>
                    {formaterDatoIntervall({
                        datoFra: finnDato18MndTilbake(datoVisesPaDragElement),
                        datoTil: datoVisesPaDragElement,
                    })}
                </Normaltekst>
                <Element className={'kalkulator__draggable-tekst'}>
                    {' '}
                    18 måneder{' '}
                </Element>
            </div>
            <div className={'kalkulator__draggable-kant høyre'} />
        </div>
    );

    const finnesSlettetPermittering =
        props.gjeldendeRegelverk ===
            Permitteringssregelverk.NORMALT_REGELVERK &&
        !!tidslinjeSomSkalVises.find(
            (objekt) =>
                objekt.kategori ===
                DatointervallKategori.SLETTET_PERMITTERING_FØR_1_JULI
        );

    return (
        <div className={'tidslinje'}>
            {
                <>
                    <Tekstforklaring
                        tidslinje={tidslinjeSomSkalVises}
                        sisteDagIPeriode={props.sisteDagIPeriode}
                        datoVisesPaDragElement={datoVisesPaDragElement}
                    />

                    <div
                        role="img"
                        aria-label="Visualisering av en tidslinje som inneholder permitterings- og fraværsperiodene, og den aktuelle 18-månedersperioden"
                    >
                        <div
                            aria-hidden
                            className={'kalkulator__tidslinje-container start'}
                            id={'kalkulator-tidslinje-container'}
                        >
                            <Draggable
                                axis={'x'}
                                bounds={'parent'}
                                onDrag={() => OnTidslinjeDrag()}
                            >
                                {get18mndsperiode()}
                            </Draggable>
                            <div
                                className={'kalkulator__tidslinje-underlag'}
                                id={'kalkulator__tidslinje'}
                            >
                                <div
                                    className={
                                        'kalkulator__tidslinje-fargeperioder'
                                    }
                                >
                                    {htmlFargeObjekt}
                                </div>
                                {htmlElementerForHverDato}
                            </div>
                        </div>
                        {Fargeforklaringer(finnesSlettetPermittering)}
                    </div>
                </>
            }
        </div>
    );
};

export default Tidslinje;
