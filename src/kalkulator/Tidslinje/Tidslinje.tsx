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
import { Normaltekst, Element } from 'nav-frontend-typografi';
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
    finnDato18MndTilbake,
    finnPotensiellLøpendePermittering,
    formaterDato,
    formaterDatoIntervall,
} from '../utils/dato-utils';
import {
    finnDatoForMaksPermittering,
    finnDenAktuelle18mndsperiodenSomSkalBeskrives,
    finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli,
    finnPermitteringssituasjon1Januar,
    harLøpendePermitteringMedOppstartFørRegelendring,
    Permitteringssituasjon1Januar,
} from '../utils/beregningerForRegelverksendring1Jan';
import { Permitteringssregelverk } from '../SeResultat/Utregningstekst/Utregningstekst';
import Tekstforklaring from './Årsmarkør/Tekstforklaring/Tekstforklaring';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    set18mndsPeriode: (dato: Dayjs) => void;
    sisteDagIPeriode: Dayjs;
    breddeAvDatoObjektIProsent: number;
    endringAv: 'datovelger' | 'tidslinje' | 'ingen';
    setEndringAv: (endringAv: 'datovelger' | 'tidslinje') => void;
    tidslinje: DatoMedKategori[];
}

const Tidslinje: FunctionComponent<Props> = (props) => {
    const [datoOnDrag, setDatoOnDrag] = useState<Dayjs | undefined>(undefined);
    const [tidslinjeSomSkalVises, setTidslinjeSomSkalVises] = useState<
        DatoMedKategori[]
    >(props.tidslinje);
    const {
        dagensDato,
        regelEndringsDato1Januar,
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
        const oppstartFørRegelendring = harLøpendePermitteringMedOppstartFørRegelendring(
            props.allePermitteringerOgFraværesPerioder.permitteringer,
            regelEndring1Juli
        );
        const finnesLøpende = !!finnPotensiellLøpendePermittering(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        );
        const situasjon = finnPermitteringssituasjon1Januar(
            props.tidslinje,
            regelEndringsDato1Januar,
            regelEndring1Juli,
            49 * 7,
            finnesLøpende
        );
        if (
            situasjon === Permitteringssituasjon1Januar.MAKS_NÅDD_IKKE_LØPENDE
        ) {
        }
        if (!oppstartFørRegelendring) {
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
    }, [
        props.tidslinje,
        regelEndring1Juli,
        props.allePermitteringerOgFraværesPerioder,
    ]);

    useEffect(() => {
        if (props.endringAv === 'datovelger') {
            setPosisjonsStylingDragElement('absolute');
        }
    }, [props.endringAv]);

    useEffect(() => {
        const oppstartFørRegelendring = harLøpendePermitteringMedOppstartFørRegelendring(
            props.allePermitteringerOgFraværesPerioder.permitteringer,
            regelEndring1Juli
        );
        const gjeldendeRegelverk = oppstartFørRegelendring
            ? Permitteringssregelverk.KORONA_ORDNING
            : Permitteringssregelverk.NORMALT_REGELVERK;
        const maksDagerUtenLønnsplikt = oppstartFørRegelendring
            ? 49 * 7
            : 26 * 7;
        const finnesLøpende = !!finnPotensiellLøpendePermittering(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        );

        const situasjon = finnPermitteringssituasjon1Januar(
            props.tidslinje,
            regelEndringsDato1Januar,
            regelEndring1Juli,
            49 * 7,
            finnesLøpende
        );
        if (
            situasjon === Permitteringssituasjon1Januar.MAKS_NÅDD_IKKE_LØPENDE
        ) {
            const datoMaksNådd = finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli(
                props.tidslinje,
                regelEndringsDato1Januar,
                regelEndring1Juli
            );
            props.set18mndsPeriode(datoMaksNådd!!);
        } else {
            const sluttAv18mndsPeriode = finnesLøpende
                ? finnDatoForMaksPermittering(
                      tidslinjeSomSkalVises,
                      regelEndringsDato1Januar,
                      maksDagerUtenLønnsplikt
                  )!
                : finnDenAktuelle18mndsperiodenSomSkalBeskrives(
                      gjeldendeRegelverk,
                      tidslinjeSomSkalVises,
                      dagensDato,
                      regelEndringsDato1Januar,
                      regelEndring1Juli,
                      maksDagerUtenLønnsplikt,
                      finnesLøpende
                  )?.datoTil || regelEndring1Juli;
            props.set18mndsPeriode(sluttAv18mndsPeriode);
        }
    }, [
        tidslinjeSomSkalVises,
        props.tidslinje,
        props.allePermitteringerOgFraværesPerioder,
    ]);

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
        dagensDato
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
            className={'kalkulator__draggable-periode'}
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
                        <Fargeforklaringer />
                    </div>
                </>
            }
        </div>
    );
};

export default Tidslinje;
