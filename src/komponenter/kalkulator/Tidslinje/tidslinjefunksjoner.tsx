import { datointervallKategori, DatoMedKategori } from '../utregninger';
import React from 'react';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';
import { Undertekst } from 'nav-frontend-typografi';

interface RepresentasjonAvPeriodeMedFarge {
    antallDagerISekvens: number;
    kategori: datointervallKategori;
    grenserTilFraværHøyre?: boolean;
    grenserTilFraværVenstre?: boolean;
}

export const lagHTMLObjektForAlleDatoer = (
    tidslinjeObjekter: DatoMedKategori[],
    breddePerElement: number
) => {
    return tidslinjeObjekter.map((objekt: DatoMedKategori, indeks: number) => {
        const style: React.CSSProperties = {
            width: breddePerElement.toString() + '%',
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
    });
};

export const lagHTMLObjektForPeriodeMedFarge = (
    representasjonAvPerioderMedFarge: RepresentasjonAvPeriodeMedFarge[],
    breddePerDato: number
) => {
    return representasjonAvPerioderMedFarge.map((objekt, indeks) => {
        let borderRadius = '0';
        if (objekt.kategori === 0) {
            const grenserTilFraværVenstre =
                objekt.kategori === 0 &&
                representasjonAvPerioderMedFarge[indeks - 1].kategori === 2;
            const grenserTilFraværHøyre =
                objekt.kategori === 0 &&
                representasjonAvPerioderMedFarge[indeks + 1].kategori === 2;
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
                (breddePerDato * objekt.antallDagerISekvens).toString() + '%',
            backgroundColor: finnFarge(objekt.kategori),
            borderRadius: borderRadius,
        };
        return <div style={style} />;
    });
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
                };
                fargePerioder.push(fargeElement);
                rekkefølgeTeller = 1;
            }
            if (indeks === tidslinjeObjekter.length - 1) {
                const fargeElement: RepresentasjonAvPeriodeMedFarge = {
                    antallDagerISekvens: rekkefølgeTeller,
                    kategori: tidslinjeObjekter[indeks].kategori,
                };
                fargePerioder.push(fargeElement);
            }
        }
    });
    return fargePerioder;
};

const finnFarge = (kategori: datointervallKategori) => {
    if (kategori === 0) {
        return '#005B82';
    }
    if (kategori === 2) {
        return 'darksalmon';
    }
    return 'transParent';
};
