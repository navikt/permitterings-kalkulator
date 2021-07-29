import React, { ReactElement } from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatointervallKategori,
    DatoMedKategori,
} from '../../typer';
import dayjs, { Dayjs } from 'dayjs';
import {
    erHelg,
    finnDato18MndTilbake,
    finnPotensiellLøpendePermittering,
    formaterDato,
    formaterDatoIntervall,
    getFørsteHverdag,
    til18mndsperiode,
} from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import {
    finnDatoForMaksPermittering,
    finnPermitteringssituasjon1Oktober,
    getPermitteringsoversiktFor18Måneder,
    Permitteringssituasjon1Oktober,
} from '../../utils/beregningerForRegelverksendring1Okt';

interface ResultatTekst {
    konklusjon: ReactElement | string;
    beskrivelse: ReactElement | null;
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
                        For permitteringer iverksatt før 1. juli har det ikke
                        vært noen begrensning på hvor lenge en ansatt kan være
                        permittert. Fra og med 1. oktober vil derimot maks
                        antall uker en ansatt kan være permittert være 49 uker i
                        løpet av de siste 18 månedene, for permitteringer
                        iverksatt før 1. juli.
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
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Dette betyr at du må betale lønn til din ansatte fra 1.
                        oktober. Hvis du har permitteringsgrunnlag for å
                        permittere din ansatt videre, er du nødt til å
                        iverksette en ny permittering. Du vil da få en ny
                        lønnsplikt
                    </Normaltekst>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        For nye permitteringer er maks antall uker du kan ha den
                        ansatte permittert 26 uker i løpet av 18 måneder.
                    </Normaltekst>
                </>
            ),
        };
    }

    const datoMaksAntallDagerPermittertNådd: Dayjs = finnDatoForMaksPermittering(
        tidslinje,
        datoRegelEndring,
        49 * 7
    )!;
    const sisteDagI18mndsperiode = datoMaksAntallDagerPermittertNådd.subtract(
        1,
        'day'
    );

    const tilleggstekstLøpendePermittering = finnPotensiellLøpendePermittering(
        allePermitteringerOgFraværesPerioder.permitteringer
    )
        ? ', dersom permitteringen holdes løpende'
        : '';
    return {
        konklusjon: (
            <>
                <Element>
                    Du har lønnsplikt fra
                    {' ' +
                        formaterDato(
                            getFørsteHverdag(datoMaksAntallDagerPermittertNådd)
                        )}
                    {tilleggstekstLøpendePermittering}. Da er maks antall dager
                    for permittering uten lønnsplikt nådd.
                </Element>
                {alertOmForskyvingAvMaksgrenseNåddHvisHelg(
                    datoMaksAntallDagerPermittertNådd
                )}
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
                    {' ' +
                        formaterDato(
                            getFørsteHverdag(datoMaksAntallDagerPermittertNådd)
                        )}
                    .
                </Normaltekst>
                <Normaltekst className={'utregningstekst__beskrivelse'}>
                    Dersom du avslutter permitteringen vil nye regler gjelde for
                    permitteringer iverksatt fra og med 1. juli. For
                    permitteringer etter 1. juli er maks antall uker en ansatt
                    kan være permittert uten lønn 26 uker i løpet av 18 måneder.
                </Normaltekst>
            </>
        ),
    };
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

const alertOmForskyvingAvMaksgrenseNåddHvisHelg = (dato: Dayjs) => {
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
