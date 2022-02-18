import { DatointervallKategori, DatoMedKategori } from '../typer';
import React from 'react';
import Årsmarkør from './Årsmarkør/Årsmarkør';
import { Dayjs } from 'dayjs';
import {
    antallDagerGått,
    finnDato18MndTilbake,
    formaterDato,
} from '../utils/dato-utils';
import Detail from '@navikt/ds-react/esm/typography/Detail';

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
    dagensDato: Dayjs,
    datoMaksPermitteringNås?: Dayjs
) => {
    return tidslinjeObjekter.map((objekt: DatoMedKategori, indeks: number) => {
        const style: React.CSSProperties = {
            width: breddePerElement.toString() + '%',
        };
        const erIdagBoolean = objekt.dato.isSame(dagensDato, 'day');
        const erIdag = erIdagBoolean ? ' dagens-dato' : '';
        const erÅrsmarkering = erFørsteJanuar(objekt.dato)
            ? ' tidslinje-årsmarkering'
            : '';
        const erMaksDatoForPermittering =
            datoMaksPermitteringNås &&
            datoMaksPermitteringNås.isSame(objekt.dato.add(1, 'day'), 'day');
        const klassenavnHvisErMaksDato = erMaksDatoForPermittering
            ? ' dato-maks-nås'
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
                    erÅrsmarkering +
                    klassenavnHvisErMaksDato
                }
            >
                {erIdag && (
                    <div className={'tidslinje-dagens-dato-markør'}>
                        <Detail
                            size="small"
                            className={'tidslinje-dagens-dato-markør-tekst'}
                        >
                            i dag
                        </Detail>
                        <div className={'tidslinje-dagens-dato-strek'} />
                        <div className={'tidslinje-dagens-dato-sirkel'} />
                    </div>
                )}
                {erMaksDatoForPermittering && !erIdagBoolean && (
                    <div className={'dato-maks-nås-markør'}>
                        <Detail size="small" className={'dato-maks-nås-tekst'}>
                            maks nådd
                        </Detail>
                        <div className={'dato-maks-nås-sirkel'} />
                        <div className={'dato-maks-nås-strek'} />
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
    const avstand = posisjonBeskrivelse1?.right! - posisjonBeskrivelse2?.left!;
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
            //sjekker om sekvensen er et element lengre av at de har samme kategori
            if (
                tidslinjeObjekter[indeks - 1].kategori ===
                tidslinjeObjekter[indeks].kategori
            ) {
                rekkefølgeTeller++;
            }
            //dersom de ikke har samme kategori legges den forrige sekvensen til med lengde=rekkefølgeteller
            else {
                const fargeElement: RepresentasjonAvPeriodeMedFarge = {
                    antallDagerISekvens: rekkefølgeTeller,
                    kategori: tidslinjeObjekter[indeks - 1].kategori,
                    key: indeks,
                };
                fargePerioder.push(fargeElement);
                rekkefølgeTeller = 1;
            }
            //hvis det er siste element i tidslinja legges nåværende sekvensen til direkte fordi iterasjonene er over
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
        return '#c2eaf7';
    }
    return 'transParent';
};

export const erFørsteJanuar = (date: Dayjs) => {
    return date.month() === 0 && date.date() === 1;
};
