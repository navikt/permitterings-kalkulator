import React, { ReactElement } from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../../typer';
import { Dayjs } from 'dayjs';
import {
    erHelg,
    finnDato18MndFram,
    finnPotensiellLøpendePermittering,
    formaterDato,
    getFørsteHverdag,
} from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import {
    finnDatoForMaksPermittering,
    finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli,
    finnPermitteringssituasjon1Januar,
    getPermitteringsoversiktFor18Måneder,
    Permitteringssituasjon1Januar,
} from '../../utils/beregningerForRegelverksendring1Jan';
import { loggPermitteringsSituasjon } from '../../../utils/amplitudeEvents';
import Lenke from 'nav-frontend-lenker';

interface ResultatTekst {
    konklusjon: ReactElement | string;
    beskrivelse: ReactElement | null;
}

export const lagResultatTekstForPermitteringsStartFør1Juli = (
    tidslinje: DatoMedKategori[],
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs,
    datoRegelendringJanuar: Dayjs,
    datoRegelEndring1Juli: Dayjs
): ResultatTekst => {
    const finnesLøpendePermittering = !!finnPotensiellLøpendePermittering(
        allePermitteringerOgFraværesPerioder.permitteringer
    );
    const situasjon = finnPermitteringssituasjon1Januar(
        tidslinje,
        datoRegelendringJanuar,
        datoRegelEndring1Juli,
        49 * 7,
        finnesLøpendePermittering
    );
    const oversiktOverPermitteringVedInnføringsdato = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        datoRegelendringJanuar
    );
    if (situasjon === Permitteringssituasjon1Januar.MAKS_NÅDD_IKKE_LØPENDE) {
        const datoMaksNådd = finnMaksAntallDagerNåddHvisAvsluttetPermitteringFraFør1Juli(
            tidslinje,
            datoRegelendringJanuar,
            datoRegelEndring1Juli
        );
        const oversiktOverPermitteringsdagerFra1Juli = getPermitteringsoversiktFor18Måneder(
            tidslinje,
            finnDato18MndFram(datoRegelEndring1Juli)
        );
        return {
            konklusjon: (
                <>
                    <Element>
                        Du kan maksimalt permittere den ansatte til og med{' '}
                        {formaterDato(datoMaksNådd!!)}. Da vil lønnsplikten
                        gjeninntre.
                    </Element>
                </>
            ),
            beskrivelse: (
                <>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Ved videre permittering kan du permittere på nytt med
                        regler gjeldende fra 01.07.2021.
                    </Normaltekst>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Den ansatte har vært permittert i tilsammen{' '}
                        {skrivDagerIHeleUkerPlussDager(
                            oversiktOverPermitteringsdagerFra1Juli.dagerBrukt
                        )}{' '}
                        i 18-månedersperioden fra 1. juli 2021 til 30. desember
                        2022.
                    </Normaltekst>
                    {oversiktOverPermitteringsdagerFra1Juli.dagerBrukt >=
                    26 * 7 ? (
                        <Normaltekst>
                            'Den ansatte har nådd maks antall dager permittert
                            uten lønn.'{' '}
                        </Normaltekst>
                    ) : (
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Ved nye permitteringer kan du maksimalt permittere
                            en ansatt i 26 uker i løpet av 18 måneder.
                            {oversiktOverPermitteringsdagerFra1Juli.dagerBrukt >=
                            26 * 7
                                ? 'Den ansatte har nådd maks antall dager permittert uten lønn. Du kan ikke permittere den ansatte på nytt før 31. desember 2022, da gjeldene 18-månedersperiode er over.'
                                : 'Dersom du permitterer i ytterlige ' +
                                  skrivDagerIHeleUkerPlussDager(
                                      26 * 7 -
                                          oversiktOverPermitteringsdagerFra1Juli.dagerBrukt
                                  ) +
                                  ' innen 30.12.2022, vil du måtte avslutte permitteringen. '}
                        </Normaltekst>
                    )}
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Tips: Du kan fylle inn permitteringer framover i tid,
                        kalkulatoren vil da regne ut når lønnsplikten inntreffer
                        igjen.{' '}
                        <Lenke
                            href={
                                'https://arbeidsgiver.nav.no/arbeidsgiver-permittering/#narSkalJegUtbetale'
                            }
                        >
                            Les mer om permitteringsreglene i veiviser for
                            permittering
                        </Lenke>
                        .
                    </Normaltekst>
                </>
            ),
        };
    }
    if (
        situasjon === Permitteringssituasjon1Januar.MAKS_NÅDD_1_JANUAR_LØPENDE
    ) {
        loggPermitteringsSituasjon(
            'Maks permittering nådd 1. november. Maks permitteringstid er 49 uker'
        );
        return {
            konklusjon: (
                <>
                    <Element>
                        Du har lønnsplikt fra
                        {' ' + formaterDato(datoRegelendringJanuar)}. Maks
                        antall dager for permittering uten lønnsplikt er nådd.
                    </Element>
                </>
            ),
            beskrivelse: (
                <>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        1. januar 2022 vil lønnsplikten gjeninntre for løpende
                        permitteringer som startet før 1. juli der du til sammen
                        har permittert i 49 uker eller mer de siste 18 månedene.
                    </Normaltekst>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Den ansatte har vært permittert i{' '}
                        {skrivDagerIHeleUkerPlussDager(
                            oversiktOverPermitteringVedInnføringsdato.dagerBrukt
                        )}{' '}
                        i 18-månedersperioden fra 2. mai 2020 til 1. november
                        2021. Dette overskrider 49 uker, og du har dermed
                        lønnsplikt fra 1. november 2021.
                    </Normaltekst>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        For nye permitteringer er maks antall uker du kan ha den
                        ansatte permittert 26 uker i løpet av 18 måneder.
                    </Normaltekst>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Hvis du ønsker å permittere på nytt, gjelder nye regler.{' '}
                        <Lenke
                            href={
                                'https://arbeidsgiver.nav.no/arbeidsgiver-permittering/#narSkalJegUtbetale'
                            }
                        >
                            Les mer om permitteringsreglene i veiviser for
                            permittering
                        </Lenke>
                        .
                    </Normaltekst>
                </>
            ),
        };
    }

    const datoMaksPermitteringNådd: Dayjs = finnDatoForMaksPermittering(
        tidslinje,
        datoRegelendringJanuar,
        49 * 7
    )!;

    const tilleggstekstLøpendePermittering = finnPotensiellLøpendePermittering(
        allePermitteringerOgFraværesPerioder.permitteringer
    )
        ? ', dersom permitteringen holdes løpende'
        : '';
    loggPermitteringsSituasjon(
        'maks permittering nådd etter 1. november. Maks permitteringstid er 49 uker.'
    );
    return {
        konklusjon: (
            <>
                <Element>
                    Du har lønnsplikt fra
                    {' ' + formaterDato(datoMaksPermitteringNådd)}
                    {tilleggstekstLøpendePermittering}. Da er maks antall dager
                    for permittering uten lønnsplikt nådd.
                </Element>
            </>
        ),
        beskrivelse: (
            <>
                <Normaltekst className={'utregningstekst__beskrivelse'}>
                    For permitteringer som startet før 1. juli, kan du
                    permittere inntil 49 uker innenfor en periode på 18 måneder
                    før lønnsplikten gjeninntrer.
                </Normaltekst>
                <Normaltekst className={'utregningstekst__beskrivelse'}>
                    Hvis du holder permitteringen løpende, vil du nå 49 uker
                    permittering og måtte betale lønn fra{' '}
                    {' ' + formaterDato(datoMaksPermitteringNådd)}.
                </Normaltekst>
                <Normaltekst className={'utregningstekst__beskrivelse'}>
                    Hvis du avslutter permitteringen, men ønsker å permittere på
                    nytt, gjelder nye regler for permitteringen.{' '}
                    <Lenke
                        href={
                            'https://arbeidsgiver.nav.no/arbeidsgiver-permittering/#narSkalJegUtbetale'
                        }
                    >
                        Les mer om permitteringsreglene i veiviser for
                        permittering
                    </Lenke>
                    .
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
                    NB! Lørdager og søndager forskyver dagen lønnsplikten
                    inntreffer.
                </Element>
                <Normaltekst>
                    Hvis første dag du har lønnsplikt havner på en helgedag,
                    betaler du lønn fra med førstkommende mandag.
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
