import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    datointervallKategori,
    DatoMedKategori,
    finnDato18MndTilbake,
    konstruerStatiskTidslinje,
} from '../utregninger';
import './Tidslinje.less';
import {
    AllePermitteringerOgFraværesPerioder,
    GRENSERFOR18MNDPERIODE,
} from '../kalkulator';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';
import Draggable from 'react-draggable';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    set18mndsPeriode: (dato: Date) => void;
    sisteDagIPeriode: Date;
    breddeAvDatoObjektIProsent: number;
    endringAv: 'datovelger' | 'tidslinje' | 'ingen';
    setEndringAv: (endringAv: 'datovelger' | 'tidslinje') => void;
}

const regnUtHorisontalAvstandMellomToElement = (id1: string, id2: string) => {
    const element1 = document.getElementById(id1);
    const element2 = document.getElementById(id2);
    const posisjonBeskrivelse1 = element1?.getBoundingClientRect();
    const posisjonBeskrivelse2 = element2?.getBoundingClientRect();
    const avstand =
        posisjonBeskrivelse1?.right!! - posisjonBeskrivelse2?.right!!;
    return Math.abs(avstand);
};

export const finnBreddeAvObjekt = (id: string) => {
    const element = document.getElementById(id);
    return element?.offsetWidth;
};

const FinnIndeksForDato = (dato: Date, tidslinjeobjekt: DatoMedKategori[]) => {
    let indeksDato = 0;
    tidslinjeobjekt.forEach((objekt, indeks) => {
        if (skrivOmDato(dato) === skrivOmDato(objekt.dato)) {
            indeksDato = indeks;
        }
    });
    return indeksDato;
};

const antallElementMellomObjekt = (
    fra: Date,
    til: Date,
    tidslinje: DatoMedKategori[]
) => {
    const indeksTil = FinnIndeksForDato(til, tidslinje);
    const indeksFra = FinnIndeksForDato(fra, tidslinje);
    return indeksTil - indeksFra + 1;
};

export const fraPixelTilProsent = (idContainer: string, antallBarn: number) => {
    const breddeContainer = document.getElementById(idContainer)?.offsetWidth;
    const breddePerObjekt = breddeContainer!! / antallBarn;
    return (breddePerObjekt / breddeContainer!!) * 100;
};

const Tidslinje: FunctionComponent<Props> = (props) => {
    const [datoOnDrag, setDatoOnDrag] = useState(props.sisteDagIPeriode);
    const [tidslinjeObjekter, setTidslinjeObjekter] = useState(
        konstruerStatiskTidslinje(props.allePermitteringerOgFraværesPerioder)
    );
    const [
        absoluttPosisjonFraHøyreDragElement,
        setAbsoluttPosisjonFraHøyreDragElement,
    ] = useState(
        antallElementMellomObjekt(
            props.sisteDagIPeriode,
            tidslinjeObjekter[tidslinjeObjekter.length - 1].dato,
            tidslinjeObjekter
        ) * props.breddeAvDatoObjektIProsent
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

    const finnFarge = (kategori: datointervallKategori) => {
        if (kategori === 0) {
            return '#005B82';
        }
        if (kategori === 2) {
            return 'darksalmon';
        }
        return 'transParent';
    };

    useEffect(() => {
        setTidslinjeObjekter(
            konstruerStatiskTidslinje(
                props.allePermitteringerOgFraværesPerioder
            )
        );
    }, [props.allePermitteringerOgFraværesPerioder]);

    useEffect(() => {
        if (props.endringAv === 'datovelger') {
            setPosisjonsStylingDragElement('absolute');
        }
    }, [props.endringAv]);

    useEffect(() => {
        if (props.endringAv === 'datovelger') {
            const elementerMellomDatoOnDragOgsisteDagIPeriode = antallElementMellomObjekt(
                datoOnDrag,
                props.sisteDagIPeriode,
                tidslinjeObjekter
            );
            setAbsoluttPosisjonFraHøyreDragElement(
                elementerMellomDatoOnDragOgsisteDagIPeriode *
                    props.breddeAvDatoObjektIProsent
            );
        }
    }, [
        props.sisteDagIPeriode,
        props.breddeAvDatoObjektIProsent,
        datoOnDrag,
        tidslinjeObjekter,
    ]);

    const tidslinjeHTMLObjekt = tidslinjeObjekter.map(
        (objekt: DatoMedKategori, indeks: number) => {
            const style: React.CSSProperties = {
                width: props.breddeAvDatoObjektIProsent.toString() + '%',
            };
            const erIdagBoolean =
                skrivOmDato(objekt.dato) === skrivOmDato(new Date());
            const erIdag = erIdagBoolean ? 'dagens-dato' : '';
            return (
                <div
                    id={'kalkulator-tidslinjeobjekt-' + indeks}
                    style={style}
                    className={
                        'kalkulator__tidslinjeobjekt ' +
                        erIdag +
                        ' ' +
                        skrivOmDato(objekt.dato)
                    }
                    key={indeks}
                >
                    {erIdag && (
                        <div className={'tidslinje-dagens-dato-markør'}>
                            <Undertekst
                                className={'tidslinje-dagens-dato-markør-tekst'}
                            >
                                {skrivOmDato(new Date())}
                            </Undertekst>
                        </div>
                    )}
                </div>
            );
        }
    );

    interface FargeElement {
        antallDagerISekvens: number;
        kategori: datointervallKategori;
        grenserTilFraværHøyre?: boolean;
        grenserTilFraværVenstre?: boolean;
    }

    const fargePerioder: FargeElement[] = [];
    let rekkefølgeTeller = 1;
    tidslinjeObjekter.forEach((objekt, indeks) => {
        if (indeks !== 0) {
            if (
                tidslinjeObjekter[indeks - 1].kategori ===
                tidslinjeObjekter[indeks].kategori
            ) {
                rekkefølgeTeller++;
            } else {
                const fargeElement: FargeElement = {
                    antallDagerISekvens: rekkefølgeTeller,
                    kategori: tidslinjeObjekter[indeks - 1].kategori,
                };
                fargePerioder.push(fargeElement);
                rekkefølgeTeller = 1;
            }
            if (indeks === tidslinjeObjekter.length - 1) {
                const fargeElement: FargeElement = {
                    antallDagerISekvens: rekkefølgeTeller,
                    kategori: tidslinjeObjekter[indeks].kategori,
                };
                fargePerioder.push(fargeElement);
            }
        }
    });

    const htmlFargeObjekt = fargePerioder.map((objekt, indeks) => {
        let borderRadius = '0';
        if (objekt.kategori === 0) {
            const grenserTilFraværVenstre =
                objekt.kategori === 0 &&
                fargePerioder[indeks - 1].kategori === 2;
            const grenserTilFraværHøyre =
                objekt.kategori === 0 &&
                fargePerioder[indeks + 1].kategori === 2;
            if (grenserTilFraværVenstre) {
                borderRadius = '0 4px 4px 0';
            } else if (grenserTilFraværHøyre) {
                borderRadius = '4px 0 0 4px';
            } else {
                borderRadius = '4px';
            }
        }

        const style: React.CSSProperties = {
            width:
                (
                    props.breddeAvDatoObjektIProsent *
                    objekt.antallDagerISekvens
                ).toString() + '%',
            backgroundColor: finnFarge(objekt.kategori),
            borderRadius: borderRadius,
        };
        return <div style={style} />;
    });

    const OnTidslinjeDragRelease = () => {
        props.set18mndsPeriode(datoOnDrag);
    };

    const OnTidslinjeDrag = () => {
        setPosisjonsStylingDragElement(undefined);
        props.setEndringAv('tidslinje');
        let indeksStartDato = 0;
        let minimumAvstand = 1000;
        tidslinjeHTMLObjekt.forEach((objekt, indeks) => {
            const avstand = regnUtHorisontalAvstandMellomToElement(
                'draggable-periode',
                'kalkulator-tidslinjeobjekt-' + indeks
            );
            if (avstand < minimumAvstand) {
                minimumAvstand = avstand;
                indeksStartDato = indeks;
            }
        });
        setDatoOnDrag(tidslinjeObjekter[indeksStartDato].dato);
    };

    return (
        <div
            className={'kalkulator__tidslinje-container start'}
            id={'kalkulator-tidslinje-container'}
        >
            {tidslinjeObjekter.length > 0 && (
                <>
                    <Draggable
                        axis={'x'}
                        bounds={'parent'}
                        onStop={() => OnTidslinjeDragRelease()}
                        onDrag={() => OnTidslinjeDrag()}
                    >
                        <div
                            style={{
                                position: posisjonsStylingDragElement,
                                left:
                                    absoluttPosisjonFraHøyreDragElement.toString() +
                                    '%',
                                width:
                                    (
                                        props.breddeAvDatoObjektIProsent * 550
                                    ).toString() + '%',
                            }}
                            id={'draggable-periode'}
                            className={'kalkulator__draggable-periode'}
                        >
                            <div
                                className={'kalkulator__draggable-kant venstre'}
                            />
                            <div
                                className={'kalkulator__draggable-kant høyre'}
                            />
                            <Normaltekst className={'venstre-dato '}>
                                {skrivOmDato(finnDato18MndTilbake(datoOnDrag))}
                            </Normaltekst>

                            <Normaltekst className={'høyre-dato'}>
                                {skrivOmDato(datoOnDrag)}
                            </Normaltekst>
                        </div>
                    </Draggable>
                    <div
                        className={'kalkulator__tidslinje-underlag'}
                        id={'kalkulator__tidslinje'}
                    >
                        <div className={'kalkulator__tidslinje-fargeperioder'}>
                            {htmlFargeObjekt}
                        </div>
                        {tidslinjeHTMLObjekt}
                    </div>
                </>
            )}
        </div>
    );
};

export default Tidslinje;
