import { DatointervallKategori, DatoMedKategori } from '../typer';
import React from 'react';
import { Undertekst } from 'nav-frontend-typografi';
import Årsmarkør from './Årsmarkør/Årsmarkør';
import { Dayjs } from 'dayjs';
import {
    antallDagerGått,
    finnDato18MndTilbake,
    formaterDato,
} from '../utils/dato-utils';

interface RepresentasjonAvPeriodeMedFarge {
    antallDagerISekvens: number;
    kategori: DatointervallKategori;
    grenserTilFraværHøyre?: boolean;
    grenserTilFraværEllerSlettetPermitteringVenstre?: boolean;
    key: number;
}

export const lagHTMLObjektForAlleDatoer = (
    tidslinjeObjekter: DatoMedKategori[],
    breddePerElement: number,
    dagensDato: Dayjs
) => {
    return tidslinjeObjekter.map((objekt: DatoMedKategori, indeks: number) => {
        const style: React.CSSProperties = {
            width: breddePerElement.toString() + '%',
        };
        const erIdagBoolean = objekt.dato.isSame(dagensDato, 'day');
        const erIdag = erIdagBoolean ? ' dagens-dato' : '';
        const erÅrsmarkering = erFørsteJanuar(objekt.dato)
            ? ' årsmarkering'
            : '';
        return (
            <div
                key={indeks}
                id={'kalkulator-tidslinjeobjekt-' + indeks}
                style={style}
                className={
                    'kalkulator__tidslinjeobjekt' +
                    erIdag +
                    ' ' +
                    formaterDato(objekt.dato) +
                    erÅrsmarkering
                }
            >
                {erIdag && (
                    <div className={'tidslinje-dagens-dato-markør'}>
                        <Undertekst
                            className={'tidslinje-dagens-dato-markør-tekst'}
                        >
                            I dag
                            <br />
                            {formaterDato(dagensDato)}
                        </Undertekst>
                        <div className={'tidslinje-dagens-dato-strek'} />
                        <div className={'tidslinje-dagens-dato-sirkel'} />
                    </div>
                )}
                {erÅrsmarkering && <Årsmarkør dato={objekt.dato} />}
            </div>
        );
    });
};

export const lagHTMLObjektForPeriodeMedFarge = (
    representasjonAvPerioderMedFarge: RepresentasjonAvPeriodeMedFarge[],
    breddePerDato: number
) => {
    return representasjonAvPerioderMedFarge.map((objekt, indeks) => {
        let borderRadius = '0';
        // dersom indeks er null kan ikke objektet grense til objekt til venstre, siden det er det første objektet i representasjonen
        let grenserTilAnnenKategoriFraVenstre = false;
        let grenserTilAnnenKategoriFraHøyre = false;
        if (indeks !== 0) {
            borderRadius = '4px';
            const forrigePeriodesKategori =
                representasjonAvPerioderMedFarge[indeks - 1].kategori;
            grenserTilAnnenKategoriFraVenstre =
                forrigePeriodesKategori !== objekt.kategori &&
                forrigePeriodesKategori !==
                    DatointervallKategori.IKKE_PERMITTERT;
            if (grenserTilAnnenKategoriFraVenstre) {
                borderRadius = '0 4px 4px 0';
            }
        }
        // dersom length-1 kan ikke objektet grense til objekt til høyre, siden det er det siste objektet representasjonen
        if (indeks !== representasjonAvPerioderMedFarge.length - 1) {
            const nestePeriodesKategori =
                representasjonAvPerioderMedFarge[indeks + 1].kategori;
            grenserTilAnnenKategoriFraHøyre =
                nestePeriodesKategori !== objekt.kategori &&
                nestePeriodesKategori !== DatointervallKategori.IKKE_PERMITTERT;
            if (grenserTilAnnenKategoriFraHøyre) {
                borderRadius = '4px 0 0 4px';
            }
        }
        if (
            grenserTilAnnenKategoriFraHøyre &&
            grenserTilAnnenKategoriFraVenstre
        ) {
            borderRadius = '0 0 0 0';
        }

        const style: React.CSSProperties = {
            width:
                (breddePerDato * objekt.antallDagerISekvens).toString() + '%',
            backgroundColor: finnFarge(objekt.kategori),
            borderRadius: borderRadius,
        };
        return <div style={style} key={indeks} />;
    });
};

export const regnUtHorisontalAvstandMellomToElement = (
    id1: string,
    id2: string
) => {
    const element1 = document.getElementById(id1);
    const element2 = document.getElementById(id2);
    const posisjonBeskrivelse1 = element1?.getBoundingClientRect();
    const posisjonBeskrivelse2 = element2?.getBoundingClientRect();
    const avstand = posisjonBeskrivelse1?.right! - posisjonBeskrivelse2?.right!;
    return Math.abs(avstand);
};

export const finnBreddeAvObjekt = (id: string) => {
    const element = document.getElementById(id);
    return element?.offsetWidth;
};

export const finnIndeksForDato = (
    dato: Dayjs,
    tidslinjeobjekt: DatoMedKategori[]
) => {
    let indeksDato = 0;
    tidslinjeobjekt.forEach((objekt, indeks) => {
        if (dato.isSame(objekt.dato, 'day')) {
            indeksDato = indeks;
        }
    });
    return indeksDato;
};

export const regnUtPosisjonFraVenstreGittSluttdato = (
    tidslinjeObjekter: DatoMedKategori[],
    breddePerElementIProsent: number,
    sluttDato: Dayjs
) => {
    return (
        (finnIndeksForDato(sluttDato, tidslinjeObjekter) +
            1 -
            antallDagerGått(finnDato18MndTilbake(sluttDato), sluttDato)) *
        breddePerElementIProsent
    );
};

export const fraPixelTilProsent = (idContainer: string, antallBarn: number) => {
    const breddeContainer = document.getElementById(idContainer)?.offsetWidth;
    const breddePerObjekt = breddeContainer! / antallBarn;
    return (breddePerObjekt / breddeContainer!) * 100;
};

export const lagObjektForRepresentasjonAvPerioderMedFarge = (
    tidslinjeObjekter: DatoMedKategori[]
) => {
    const fargePerioder: RepresentasjonAvPeriodeMedFarge[] = [];
    let rekkefølgeTeller = 1;
    tidslinjeObjekter.forEach((objekt, indeks) => {
        if (indeks !== 0) {
            if (
                tidslinjeObjekter[indeks - 1].kategori ===
                tidslinjeObjekter[indeks].kategori
            ) {
                rekkefølgeTeller++;
            } else {
                const fargeElement: RepresentasjonAvPeriodeMedFarge = {
                    antallDagerISekvens: rekkefølgeTeller,
                    kategori: tidslinjeObjekter[indeks - 1].kategori,
                    key: indeks,
                };
                fargePerioder.push(fargeElement);
                rekkefølgeTeller = 1;
            }
            if (indeks === tidslinjeObjekter.length - 1) {
                const fargeElement: RepresentasjonAvPeriodeMedFarge = {
                    antallDagerISekvens: rekkefølgeTeller,
                    kategori: tidslinjeObjekter[indeks].kategori,
                    key: indeks,
                };
                fargePerioder.push(fargeElement);
            }
        }
    });
    return fargePerioder;
};

const finnFarge = (kategori: DatointervallKategori) => {
    if (kategori === DatointervallKategori.PERMITTERT_UTEN_FRAVÆR) {
        return '#5EAEC7';
    }
    if (kategori === DatointervallKategori.PERMITTERT_MED_FRAVÆR) {
        return '#E3B0AB';
    }
    if (kategori === DatointervallKategori.SLETTET_PERMITTERING_FØR_1_JULI) {
        return '#6a6a6a';
    }
    return 'transParent';
};

export const erFørsteJanuar = (date: Dayjs) => {
    return date.month() === 0 && date.date() === 1;
};
