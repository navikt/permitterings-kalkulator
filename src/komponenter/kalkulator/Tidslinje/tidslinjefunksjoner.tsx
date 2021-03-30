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
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnDatoForAGP2,
    finnPermitteringssituasjon,
    Permitteringssituasjon,
} from '../utils/beregningerForAGP2';

interface RepresentasjonAvPeriodeMedFarge {
    antallDagerISekvens: number;
    kategori: DatointervallKategori;
    grenserTilFraværHøyre?: boolean;
    grenserTilFraværVenstre?: boolean;
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
        if (objekt.kategori === DatointervallKategori.PERMITTERT) {
            if (indeks !== 0) {
                borderRadius = '4px';
                const grenserTilFraværVenstre =
                    representasjonAvPerioderMedFarge[indeks - 1].kategori ===
                    DatointervallKategori.FRAVÆR_PÅ_PERMITTERINGSDAG;
                if (grenserTilFraværVenstre) {
                    borderRadius = '0 4px 4px 0';
                }
            }
            if (indeks !== representasjonAvPerioderMedFarge.length - 1) {
                const grenserTilFraværHøyre =
                    representasjonAvPerioderMedFarge[indeks + 1].kategori ===
                    DatointervallKategori.FRAVÆR_PÅ_PERMITTERINGSDAG;
                if (grenserTilFraværHøyre) {
                    borderRadius = '4px 0 0 4px';
                }
            }
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
    const avstand =
        posisjonBeskrivelse1?.right!! - posisjonBeskrivelse2?.right!!;
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
    const breddePerObjekt = breddeContainer!! / antallBarn;
    return (breddePerObjekt / breddeContainer!!) * 100;
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
    if (kategori === DatointervallKategori.PERMITTERT) {
        return '#5EAEC7';
    }
    if (kategori === DatointervallKategori.FRAVÆR_PÅ_PERMITTERINGSDAG) {
        return '#E3B0AB';
    }
    return 'transParent';
};

export const erFørsteJanuar = (date: Dayjs) => {
    return date.month() === 0 && date.date() === 1;
};

export const finnSisteDatoI18mndsintervalletSomMarkeresITidslinjen = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number,
    dagensDato: Dayjs
): Dayjs => {
    const situasjon = finnPermitteringssituasjon(
        tidslinje,
        innføringsdatoAGP2,
        antallDagerFørAGP2Inntreffer
    );

    let sluttDatoIllustrasjonPåTidslinje: Dayjs | undefined;
    switch (situasjon) {
        case Permitteringssituasjon.AGP2_NÅDD_ETTER_INNFØRINGSDATO:
            sluttDatoIllustrasjonPåTidslinje = finnDatoForAGP2(
                tidslinje,
                innføringsdatoAGP2,
                antallDagerFørAGP2Inntreffer
            );
            break;
        case Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT:
            sluttDatoIllustrasjonPåTidslinje = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                innføringsdatoAGP2,
                dagensDato,
                antallDagerFørAGP2Inntreffer
            )?.datoTil;
            break;
        case Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_VED_INNFØRINGSDATO:
        case Permitteringssituasjon.AGP2_NÅDD_VED_INNFØRINGSDATO:
        default:
            sluttDatoIllustrasjonPåTidslinje = innføringsdatoAGP2;
            break;
    }
    return sluttDatoIllustrasjonPåTidslinje || innføringsdatoAGP2;
};
