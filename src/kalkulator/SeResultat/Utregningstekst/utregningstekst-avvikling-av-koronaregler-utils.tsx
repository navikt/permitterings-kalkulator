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
    formaterDatoIntervall,
} from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import { loggPermitteringsSituasjon } from '../../../utils/amplitudeEvents';
import Lenke from 'nav-frontend-lenker';
import {
    PermitteringssituasjonVedSluttPaForlengelse,
    finnDatoForMaksPermittering,
    getPermitteringsoversiktFor18Måneder,
    finnPermitteringssituasjonVedSluttPåForlengelse,
} from '../../utils/beregningerForRegelverksendring1Jan';
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
        datoRegelEndring1Juli,
        49 * 7
    );
    const datoMaksPermitteringNådd: Dayjs = finnDatoForMaksPermittering(
        tidslinje,
        datoSluttPaDagepengeForlengelse,
        49 * 7
    )!;
    if (
        datoMaksPermitteringNådd === undefined ||
        situasjon ===
            PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE
    ) {
        const forstePermitteringsdagFra1Juli = finnFørstePermitteringsdatoFraDato(
            tidslinje,
            datoRegelEndring1Juli
        );
        const oversiktOverPermitteringsdagerI18mndsperiode = getPermitteringsoversiktFor18Måneder(
            tidslinje,
            finnDato18MndFram(forstePermitteringsdagFra1Juli)
        );
        loggPermitteringsSituasjon(
            'Maks permittering nådd 1. januar 2021, ikke løpende. Maks permittering er 49 uker.'
        );

        return {
            konklusjon: (
                <>
                    {datoMaksPermitteringNådd ? (
                        <Element>
                            Du kan maksimalt permittere den ansatte til og med{' '}
                            {formaterDato(datoSluttPaDagepengeForlengelse)}. Da
                            vil lønnsplikten gjeninntre.
                        </Element>
                    ) : (
                        <Element>
                            Du har ikke nådd maksgrensa for permittering
                        </Element>
                    )}
                </>
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
                            oversiktOverPermitteringsdagerI18mndsperiode.dagerBrukt
                        )}{' '}
                        i 18-månedersperioden{' '}
                        {formaterDatoIntervall({
                            datoFra: forstePermitteringsdagFra1Juli,
                            datoTil: finnDato18MndFram(
                                forstePermitteringsdagFra1Juli
                            ),
                        })}
                    </Normaltekst>
                    {oversiktOverPermitteringsdagerI18mndsperiode.dagerBrukt >=
                    26 * 7 ? (
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Maks antall dager permittert uten lønn er nådd med
                            regelverk gjeldende fra 1. juli. Du kan ikke
                            permittere den ansatte uten lønn før tidligst{' '}
                            {formaterDato(
                                finnDato18MndFram(
                                    forstePermitteringsdagFra1Juli.add(1, 'day')
                                )
                            )}
                            , da gjeldene 18-månedersperiode er over.{' '}
                        </Normaltekst>
                    ) : (
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Ved nye permitteringer kan du maksimalt permittere
                            en ansatt i 26 uker i løpet av 18 måneder.
                            {oversiktOverPermitteringsdagerI18mndsperiode.dagerBrukt >=
                            26 * 7 ? (
                                <Normaltekst
                                    className={'utregningstekst__beskrivelse'}
                                >
                                    Den ansatte har nådd maks antall dager
                                    permittert uten lønn. Du kan ikke permittere
                                    den ansatte på nytt før tidligst{' '}
                                    {formaterDato(
                                        finnDato18MndFram(
                                            forstePermitteringsdagFra1Juli.add(
                                                1,
                                                'day'
                                            )
                                        )
                                    )}
                                    , da gjeldene 18-månedersperiode er over.
                                </Normaltekst>
                            ) : (
                                <Normaltekst>
                                    Dersom du permitterer i ytterlige{' '}
                                    {skrivDagerIHeleUkerPlussDager(
                                        26 * 7 -
                                            oversiktOverPermitteringsdagerI18mndsperiode.dagerBrukt
                                    )}{' '}
                                    innen{' '}
                                    {formaterDato(
                                        finnDato18MndFram(
                                            forstePermitteringsdagFra1Juli.add(
                                                1,
                                                'day'
                                            )
                                        )
                                    )}
                                    , vil du måtte avslutte permitteringen. '
                                </Normaltekst>
                            )}
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

    const tilleggstekstLøpendePermittering = finnPotensiellLøpendePermittering(
        allePermitteringerOgFraværesPerioder.permitteringer
    )
        ? ', dersom permitteringen holdes løpende'
        : '';
    loggPermitteringsSituasjon(
        'maks permittering nådd etter 1. januar. Maks permitteringstid er 49 uker.'
    );
    // i dette caset er permitteringen
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
                    Hvis den løpende permitteringer avsluttes og du ønsker å
                    permittere på nytt, vil nye regler gjelde.{' '}
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
