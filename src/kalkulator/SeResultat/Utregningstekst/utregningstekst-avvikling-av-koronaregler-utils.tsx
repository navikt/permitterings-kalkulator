import React, { ReactElement } from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatointervallKategori,
    DatoMedKategori,
} from '../../typer';
import dayjs, { Dayjs } from 'dayjs';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnDatoForAGP2,
    getPermitteringsoversiktFor18Måneder,
    Permitteringssituasjon,
} from '../../utils/beregningerForAGP2';
import {
    erHelg,
    finnDato18MndTilbake,
    finnesLøpendePeriode,
    formaterDato,
    formaterDatoIntervall,
    get5FørsteHverdager,
    getFørsteHverdag,
    til18mndsperiode,
} from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';
import { finnFørsteDatoMedPermitteringUtenFravær } from '../../utils/tidslinje-utils';
import Lenke from 'nav-frontend-lenker';
import {
    finnDatoForMaksPermittering,
    finnPermitteringssituasjon1Oktober,
} from '../../utils/beregningerForRegelverksendring1Okt';

const datoPotensiellRegelendring = dayjs('2021-10-01');

interface ResultatTekst {
    konklusjon: ReactElement | string;
    beskrivelse: ReactElement | null;
}

export enum Permitteringssituasjon1Oktober {
    MAKS_NÅDD_1_OKTOBER = 'MAKS_NÅDD_1_OKTOBER',
    MAKS_NÅDD_ETTER_1_OKTOBER = 'MAKS_NÅDD_ETTER_1_OKTOBE',
    IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT = 'IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT',
    IKKE_NÅDD_PGA_IKKE_PERMITTERT_1_OKTOBER = 'IKKE_NÅDD_PGA_IKKE_PERMITTERT_1_OKTOBER',
}

export const lagResultatTekstForPermitteringsStartFør1Juli = (
    tidslinje: DatoMedKategori[],
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs,
    datoRegelEndring: Dayjs
): ResultatTekst => {
    const situasjon = finnPermitteringssituasjon1Oktober(
        tidslinje,
        datoRegelEndring,
        49 * 7
    );
    const oversiktOverPermitteringVedInnføringsdato = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        datoRegelEndring
    );

    if (situasjon === Permitteringssituasjon1Oktober.MAKS_NÅDD_1_OKTOBER) {
        return {
            konklusjon: (
                <>
                    <Element>
                        Du har lønnsplikt fra
                        {' ' + formaterDato(datoRegelEndring)}. Maks antall
                        dager for permittering uten lønnsplikt er nådd.
                    </Element>
                </>
            ),
            beskrivelse: (
                <>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        For permitteringer iverksatt før 1. juli er maks antall
                        uker en ansatt kan være permittert uten at du har
                        lønnsplikt 49 uker i løpet av 18 måneder. Pågrunn av at
                        svært mange måtte permittere lengre ble det gjort et
                        unntak slik at antall dager var ubegrenset. Denne
                        unntaksregelen avvikles 1. oktober, slik at man må
                        betale lønn til sine ansatte dersom de har vært
                        permittert i 49 uker eller mer.
                    </Normaltekst>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Den ansatte har vært permittert i{' '}
                        {skrivDagerIHeleUkerPlussDager(
                            oversiktOverPermitteringVedInnføringsdato.dagerBrukt
                        )}{' '}
                        i 18-månedersperioden fra 2. mars 2020 til 1. oktober
                        2021. Dette overskrider 49 uker, og du har dermed
                        lønnsplikt fra 1. oktober 2021.
                    </Normaltekst>
                </>
            ),
        };
    }

    const datoAGP2: Dayjs = finnDatoForMaksPermittering(
        tidslinje,
        datoRegelEndring,
        49 * 7
    )!;
    const sisteDagI18mndsperiode = datoAGP2.subtract(1, 'day');

    const tilleggstekstLøpendePermittering = finnesLøpendePeriode(
        allePermitteringerOgFraværesPerioder.permitteringer
    )
        ? ', dersom permitteringen holdes løpende'
        : '';
    return {
        konklusjon: (
            <>
                <Element>
                    Du har lønnsplikt fra
                    {' ' + formaterDato(getFørsteHverdag(datoAGP2))}
                    {tilleggstekstLøpendePermittering}. Da er maks antall dager
                    for permittering uten lønnsplikt nådd.
                </Element>
                {alertOmForskyvingAvAGP2HvisHelg(datoAGP2)}
            </>
        ),
        beskrivelse: (
            <>
                <Normaltekst className={'utregningstekst__beskrivelse'}>
                    For permitteringer iverksatt før 1. juli er maks antall uker
                    en ansatt kan være permittert uten at du har lønnsplikt 49
                    uker i løpet av 18 måneder.
                </Normaltekst>
                <Normaltekst className={'utregningstekst__beskrivelse'}>
                    Hvis du holder permitteringen løpende fram til
                    {' ' +
                        formaterDatoIntervall(
                            til18mndsperiode(sisteDagI18mndsperiode)
                        )}
                    , vil du måtte betale lønn fra{' '}
                    {' ' + formaterDato(getFørsteHverdag(datoAGP2))}. Dersom du
                    avslutter permitteringen vil nye regler gjelde for
                    permitteringer iverksatt fra og med 1. juli.
                </Normaltekst>
            </>
        ),
    };
};

const lagTekstOmDatoerSomFallerUtenforRelevant18mndsPeriode = (
    tidslinje: DatoMedKategori[],
    sluttDato18mndsIntervall: Dayjs
) => {
    const startDato18mndsIntervall = finnDato18MndTilbake(
        sluttDato18mndsIntervall
    );
    const finnesPermitteringerFørGittDato = tidslinje.find(
        (datoMedKategori) =>
            datoMedKategori.kategori ===
                DatointervallKategori.PERMITTERT_UTEN_FRAVÆR &&
            datoMedKategori.dato.isBefore(startDato18mndsIntervall)
    );
    if (finnesPermitteringerFørGittDato) {
        return `Merk at permitteringer før ${formaterDato(
            startDato18mndsIntervall
        )} ikke teller med i beregningen siden dette faller utenfor det gjeldene 18-månedersintervallet (${formaterDato(
            startDato18mndsIntervall
        )}-${formaterDato(sluttDato18mndsIntervall)}).`;
    }
    return false;
};

const skrivDagerIHeleUkerPlussDager = (dager: number) => {
    const heleUkerPermittert = Math.floor(dager / 7);
    const restIDager = dager % 7;

    if (heleUkerPermittert > 0) {
        const dagerITekst =
            restIDager === 0 ? '' : ` og ${skrivDager(restIDager)}`;
        return skrivUker(heleUkerPermittert) + dagerITekst;
    }
    return `${restIDager} dager`;
};

const alertOmForskyvingAvAGP2HvisHelg = (dato: Dayjs) => {
    if (erHelg(dato)) {
        return (
            <AlertStripe
                type={'info'}
                form={'inline'}
                className="utregningstekst__alertstripe"
            >
                <Element>
                    NB! Lørdager og søndager forskyver arbeidsgiverperiode 2
                </Element>
                <Normaltekst>
                    Hvis arbeidsgiverperiode 2 inntreffer på en helgedag,
                    betaler du permitteringslønn i fem fortløpende dager fra og
                    med førstkommende mandag.
                </Normaltekst>
            </AlertStripe>
        );
    }
};

const skrivUker = (uker: number) => (uker === 1 ? '1 uke' : uker + ' uker');

const skrivDager = (dager: number) =>
    dager === 1 ? '1 dag' : dager + ' dager';

const advarselOmForbeholdAvRegelEndringVedSeinDato = (
    dato: Dayjs,
    senesteDato: Dayjs
) => {
    if (dato.isSameOrAfter(senesteDato)) {
        return (
            <AlertStripe
                type={'advarsel'}
                form={'inline'}
                className={'utregningstekst__alertstripe'}
            >
                Vi tar forbehold om at endringer i regelverket kan påvirke denne
                beregningen.
            </AlertStripe>
        );
    }
};

const advarselHvisPermitteringEtterInnføringsDato = (
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs
) => {
    const finnesPermittering = finnFørsteDatoMedPermitteringUtenFravær(
        tidslinje,
        innføringsdatoAGP2
    );
    if (finnesPermittering) {
        return (
            <AlertStripe
                type={'advarsel'}
                className={'utregningstekst__alertstripe'}
            >
                <Normaltekst>
                    Kalkulatoren kan dessverre ikke beregne om du får
                    arbeidsgiverperiode 2 ved permittering etter 1. juni i dette
                    tilfellet. Vi jobber med å forbedre løsningen. Du kan
                    kontakte NAVs arbeidsgivertelefon på{' '}
                    <Lenke href={'tel:+4755553336'}> 55 55 33 36</Lenke>, for å
                    få hjelp til denne beregningen.
                </Normaltekst>
            </AlertStripe>
        );
    }
};
