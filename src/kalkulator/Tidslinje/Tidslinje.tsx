import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useState,
} from 'react';
import './Tidslinje.less';
import {
    AllePermitteringerOgFraværesPerioder,
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
    finnDenAktuelle18mndsperiodenSomSkalBeskrives,
    getPermitteringsoversiktFor18Måneder,
    harLøpendePermitteringMedOppstartFørRegelendring,
} from '../utils/beregningerForRegelverksendring1Nov';
import { Permitteringssregelverk } from '../SeResultat/Utregningstekst/Utregningstekst';

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
    const {
        dagensDato,
        regelEndringsDato1November,
        regelEndring1Juli,
    } = useContext(PermitteringContext);
    const [
        absoluttPosisjonFraVenstreDragElement,
        setAbsoluttPosisjonFraVenstreDragElement,
    ] = useState(
        regnUtPosisjonFraVenstreGittSluttdato(
            props.tidslinje,
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
        const datoRegelEndring = oppstartFørRegelendring
            ? regelEndringsDato1November
            : regelEndring1Juli;
        const finnesLøpende = !!finnPotensiellLøpendePermittering(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        );
        const sluttAv18mndsPeriode =
            finnDenAktuelle18mndsperiodenSomSkalBeskrives(
                gjeldendeRegelverk,
                props.tidslinje,
                dagensDato,
                regelEndringsDato1November,
                regelEndring1Juli,
                maksDagerUtenLønnsplikt,
                finnesLøpende
            )?.datoTil || regelEndring1Juli;
        props.set18mndsPeriode(sluttAv18mndsPeriode);
    }, [props.tidslinje]);

    useEffect(() => {
        const nyPosisjonFraVenstre = regnUtPosisjonFraVenstreGittSluttdato(
            props.tidslinje,
            props.breddeAvDatoObjektIProsent,
            props.sisteDagIPeriode
        );
        if (datoOnDrag && !datoOnDrag.isSame(props.sisteDagIPeriode, 'day')) {
            const posisjonDragElement = regnUtPosisjonFraVenstreGittSluttdato(
                props.tidslinje,
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
        props.tidslinje,
    ]);

    const htmlElementerForHverDato = lagHTMLObjektForAlleDatoer(
        props.tidslinje,
        props.breddeAvDatoObjektIProsent,
        dagensDato
    );
    const htmlFargeObjekt = lagHTMLObjektForPeriodeMedFarge(
        lagObjektForRepresentasjonAvPerioderMedFarge(props.tidslinje),
        props.breddeAvDatoObjektIProsent
    );

    const OnTidslinjeDragRelease = () => {
        if (datoOnDrag) {
            props.set18mndsPeriode(datoOnDrag);
        }
    };

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
        setDatoOnDrag(props.tidslinje[indeksStartDato].dato);
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
                        datoTil: finnDato18MndTilbake(datoVisesPaDragElement),
                        datoFra: datoVisesPaDragElement,
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
                    <Element
                        className={
                            'kalkulator__tidslinje-drag-element-forklaring'
                        }
                    >
                        Oversikt over permitteringsperiodene{' '}
                        {
                            getPermitteringsoversiktFor18Måneder(
                                props.tidslinje,
                                datoVisesPaDragElement
                            ).dagerBrukt
                        }{' '}
                        dager
                    </Element>
                    <Normaltekst>
                        Illustrasjonen viser permitteringsperiodene du har
                        plottet inn og plasserer de i en tidslinje
                    </Normaltekst>
                    <Normaltekst>
                        Den aktuelle 18-månedsperioden er markert med blått.
                        Perioden din ansatte når eller potensielt når maks
                        antall permitteringsdager er{' '}
                        {formaterDatoIntervall({
                            datoFra: finnDato18MndTilbake(
                                props.sisteDagIPeriode
                            ),
                            datoTil: props.sisteDagIPeriode,
                        })}
                    </Normaltekst>
                    <Normaltekst>
                        Du kan dra det blå drag-elementet for å se hvor mange
                        permitteringsdager som er innenfor den markerte
                        18-månedsperioden.
                    </Normaltekst>
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
                                onStop={() => OnTidslinjeDragRelease()}
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
