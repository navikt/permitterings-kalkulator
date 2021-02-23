import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    antalldagerGått,
    DatoMedKategori,
    finnDato18MndTilbake,
    konstruerStatiskTidslinje,
} from '../utregninger';
import './Tidslinje.less';
import { AllePermitteringerOgFraværesPerioder } from '../kalkulator';
import { Normaltekst } from 'nav-frontend-typografi';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';
import Draggable from 'react-draggable';

import { Fargeforklaringer } from './Fargeforklaringer';
import {
    lagHTMLObjektForAlleDatoer,
    lagHTMLObjektForPeriodeMedFarge,
    lagObjektForRepresentasjonAvPerioderMedFarge,
} from './tidslinjefunksjoner';
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

const finnIndeksForDato = (dato: Date, tidslinjeobjekt: DatoMedKategori[]) => {
    let indeksDato = 0;
    tidslinjeobjekt.forEach((objekt, indeks) => {
        if (skrivOmDato(dato) === skrivOmDato(objekt.dato)) {
            indeksDato = indeks;
        }
    });
    return indeksDato;
};

const regnUtPosisjonFraVenstreGittSluttdato = (
    tidslinjeObjekter: DatoMedKategori[],
    breddePerElementIProsent: number,
    sluttDato: Date
) => {
    return (
        (finnIndeksForDato(sluttDato, tidslinjeObjekter) +
            1 -
            antalldagerGått(finnDato18MndTilbake(sluttDato), sluttDato)) *
        breddePerElementIProsent
    );
};

const antallElementMellomObjekt = (
    fra: Date,
    til: Date,
    tidslinje: DatoMedKategori[]
) => {
    const indeksTil = finnIndeksForDato(til, tidslinje);
    const indeksFra = finnIndeksForDato(fra, tidslinje);
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
        absoluttPosisjonFraVenstreDragElement,
        setAbsoluttPosisjonFraVenstreDragElement,
    ] = useState(
        regnUtPosisjonFraVenstreGittSluttdato(
            tidslinjeObjekter,
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
        const nyPosisjonFraVenstre = regnUtPosisjonFraVenstreGittSluttdato(
            tidslinjeObjekter,
            props.breddeAvDatoObjektIProsent,
            props.sisteDagIPeriode
        );
        if (
            datoOnDrag.toDateString() !== props.sisteDagIPeriode.toDateString()
        ) {
            const posisjonDragElement = regnUtPosisjonFraVenstreGittSluttdato(
                tidslinjeObjekter,
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
        tidslinjeObjekter,
    ]);

    const htmlElementerForHverDato = lagHTMLObjektForAlleDatoer(
        tidslinjeObjekter,
        props.breddeAvDatoObjektIProsent
    );
    const htmlFargeObjekt = lagHTMLObjektForPeriodeMedFarge(
        lagObjektForRepresentasjonAvPerioderMedFarge(tidslinjeObjekter),
        props.breddeAvDatoObjektIProsent
    );

    const OnTidslinjeDragRelease = () => {
        props.set18mndsPeriode(datoOnDrag);
    };

    const OnTidslinjeDrag = () => {
        setPosisjonsStylingDragElement('static');
        props.setEndringAv('tidslinje');
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
        setDatoOnDrag(tidslinjeObjekter[indeksStartDato].dato);
    };

    console.log(absoluttPosisjonFraVenstreDragElement);

    const datoVisesPaDragElement =
        props.endringAv === 'tidslinje' ? datoOnDrag : props.sisteDagIPeriode;

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
                                    absoluttPosisjonFraVenstreDragElement.toString() +
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
                                {skrivOmDato(
                                    finnDato18MndTilbake(datoVisesPaDragElement)
                                )}
                            </Normaltekst>

                            <Normaltekst className={'høyre-dato'}>
                                {skrivOmDato(datoVisesPaDragElement)}
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
                        {htmlElementerForHverDato}
                    </div>
                    <Fargeforklaringer />
                </>
            )}
        </div>
    );
};

export default Tidslinje;
