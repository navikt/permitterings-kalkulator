import React, { ReactElement } from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../../typer';
import { Dayjs } from 'dayjs';
import {
    erHelg,
    finnDato18MndFram,
    finnDato18MndTilbake,
    formaterDato,
    formaterDatoIntervall,
} from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import Lenke from 'nav-frontend-lenker';
import {
    PermitteringssituasjonVedSluttPaForlengelse,
    finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli,
    getPermitteringsoversiktFor18Måneder,
    finnPermitteringssituasjonVedSluttPåForlengelse,
} from '../../utils/beregningerForSluttPåDagpengeforlengelse';
import { finnFørstePermitteringsdatoFraDato } from '../../utils/tidslinje-utils';

interface ResultatTekst {
    konklusjon: ReactElement | string;
    beskrivelse: ReactElement | null;
}

export const lagResultatTekstForPermitteringsStartFør1Juli = (
    tidslinje: DatoMedKategori[],
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs,
    datoSluttPaDagepengeForlengelse: Dayjs,
    datoRegelEndring1Juli: Dayjs
): ResultatTekst => {
    const situasjon = finnPermitteringssituasjonVedSluttPåForlengelse(
        tidslinje,
        datoSluttPaDagepengeForlengelse,
        49 * 7
    );
    const maksPermitteringNås = finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
        tidslinje,
        datoSluttPaDagepengeForlengelse,
        49 * 7,
        dagensDato
    )!!;
    const førstePermitteringI18mndsIntervall = finnFørstePermitteringsdatoFraDato(
        tidslinje,
        finnDato18MndTilbake(maksPermitteringNås)
    );
    switch (situasjon) {
        case PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_NORMALT_REGELVERK_SPESIALCASE:
            const forstePermitteringsdagFra1Juli = finnFørstePermitteringsdatoFraDato(
                tidslinje,
                datoRegelEndring1Juli
            );
            const oversiktOverPermitteringsdagerI18mndsperiodeEtter1Juli = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                finnDato18MndFram(forstePermitteringsdagFra1Juli)
            );
            return {
                konklusjon: (
                    <Element>
                        Du kan permittere den ansatte til og med{' '}
                        {formaterDato(datoSluttPaDagepengeForlengelse)}. Da vil
                        lønnsplikten gjeninntre dersom .
                    </Element>
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            For framtidige permitteringer kan du permittere med
                            regler gjeldende fra 01.07.2021.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Den ansatte har vært permittert i tilsammen{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                oversiktOverPermitteringsdagerI18mndsperiodeEtter1Juli.dagerBrukt
                            )}{' '}
                            i 18-månedersperioden{' '}
                            {formaterDatoIntervall({
                                datoFra: forstePermitteringsdagFra1Juli,
                                datoTil: finnDato18MndFram(
                                    forstePermitteringsdagFra1Juli
                                ),
                            })}
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Maks antall dager permittert uten lønn er nådd med
                            regelverk gjeldende fra 1. juli, du kan ikke
                            permittere på nytt før {''}{' '}
                            {finnDato18MndFram(forstePermitteringsdagFra1Juli)}
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
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
        case PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE: {
            return {
                konklusjon: (
                    <>
                        <Element>
                            Du har lønnsplikt fra
                            {' ' +
                                formaterDato(datoSluttPaDagepengeForlengelse)}
                            , dersom permitteringen holdes aktiv til denne
                            datoen. Da er maks antall dager for permittering
                            uten lønnsplikt nådd.
                        </Element>
                    </>
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            01.04.2022 vil lønnsplikten gjeninntre for
                            permitteringer som overskrider 49 uker i løpet av 18
                            måneder.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Du har permittert i 49 uker eller mer i
                            18-månedersperioden{' '}
                            {formaterDatoIntervall({
                                datoFra: førstePermitteringI18mndsIntervall,
                                datoTil: finnDato18MndFram(
                                    førstePermitteringI18mndsIntervall
                                ),
                            })}
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Hvis den aktive permitteringer avsluttes og du
                            ønsker å permittere på nytt, vil nye regler gjelde.{' '}
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
        case PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE: {
            //maks antall dager må være nådd ut fra caset i switchen over
            return {
                konklusjon: (
                    <>
                        <Element>
                            Du har lønnsplikt fra
                            {' ' + formaterDato(maksPermitteringNås)}, dersom
                            permitteringen holdes aktiv til denne datoen. Da er
                            maks antall dager for permittering uten lønnsplikt
                            nådd.
                        </Element>
                    </>
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            For permitteringer iverksatt før 1. juli 2021 kan du
                            permittere 49 uker i løpet av 18 måneder. Du har
                            permittert i 49 uker eller mer i 18-månedersperioden{' '}
                            {formaterDatoIntervall({
                                datoFra: førstePermitteringI18mndsIntervall,
                                datoTil: finnDato18MndFram(
                                    førstePermitteringI18mndsIntervall
                                ),
                            })}
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Hvis den aktive permitteringer avsluttes og du
                            ønsker å permittere på nytt, vil nye regler gjelde.{' '}
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
    }
};

export const skrivDagerIHeleUkerPlussDager = (dager: number) => {
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
