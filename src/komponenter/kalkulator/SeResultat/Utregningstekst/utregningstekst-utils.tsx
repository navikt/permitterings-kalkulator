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
    finnPermitteringssituasjon,
    getPermitteringsoversiktFor18Måneder,
    Permitteringssituasjon,
} from '../../utils/beregningerForAGP2';
import {
    erHelg,
    finnDato18MndTilbake,
    formaterDato,
    formaterDatoIntervall,
    get5FørsteHverdager,
    getFørsteHverdag,
    til18mndsperiode,
} from '../../utils/dato-utils';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';
import { finnFørsteDatoMedPermitteringUtenFravær } from '../../utils/tidslinje-utils';
import Lenke from 'nav-frontend-lenker';

const datoPotensiellRegelendring = dayjs('2021-10-01');

interface ResultatTekst {
    konklusjon: ReactElement | string;
    beskrivelse: ReactElement | null;
}

export const lagResultatTekst = (
    tidslinje: DatoMedKategori[],
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs,
    innføringsdatoAGP2: Dayjs
): ResultatTekst => {
    const situasjon = finnPermitteringssituasjon(
        tidslinje,
        innføringsdatoAGP2,
        210
    );
    const oversiktOverPermitteringVedInnføringsdato = getPermitteringsoversiktFor18Måneder(
        tidslinje,
        innføringsdatoAGP2
    );

    switch (situasjon) {
        case Permitteringssituasjon.AGP2_NÅDD_VED_INNFØRINGSDATO:
            return {
                konklusjon: (
                    <>
                        <Element>
                            Arbeidsgiverperiode 2 vil inntreffe{' '}
                            {formaterDato(innføringsdatoAGP2)}. Det betyr at du
                            skal betale lønn for følgende fem dager:
                        </Element>
                        <Normaltekst tag="ul" style={{ marginTop: '0.5rem' }}>
                            {get5FørsteHverdager(innføringsdatoAGP2).map(
                                (dato, index) => (
                                    <li key={index}>{formaterDato(dato)}</li>
                                )
                            )}
                        </Normaltekst>
                    </>
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Arbeidsgiverperiode 2 treffer ansatte som har vært
                            permittert i 30 uker eller mer i løpet av
                            18-måneders perioden 2. desember 2019–1. juni 2021,
                            dersom de fremdeles er permittert 1. juni.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Den ansatte har vært permittert i{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                oversiktOverPermitteringVedInnføringsdato.dagerBrukt
                            )}{' '}
                            i 18-månedersperioden fra 2. desember 2019 til 1.
                            juni 2021. Dette overskrider 30 uker, dermed
                            inntreffer arbeidsgiverperiode 2 den 1. juni 2021.
                        </Normaltekst>
                    </>
                ),
            };
        case Permitteringssituasjon.AGP2_NÅDD_ETTER_INNFØRINGSDATO:
            const datoAGP2: Dayjs = finnDatoForAGP2(
                tidslinje,
                innføringsdatoAGP2,
                210
            )!;
            const sisteDagI18mndsperiode = datoAGP2.subtract(1, 'day');

            const finnesLøpendePermittering = !!allePermitteringerOgFraværesPerioder.permitteringer.find(
                (permittering) => permittering.erLøpende
            );

            const tilleggstekstLøpendePermittering = finnesLøpendePermittering
                ? ', dersom permitteringen holdes løpende'
                : '';
            return {
                konklusjon: (
                    <>
                        <Element>
                            Arbeidsgiverperiode 2 vil inntreffe{' '}
                            {formaterDato(getFørsteHverdag(datoAGP2))}
                            {tilleggstekstLøpendePermittering}. Det betyr at du
                            skal betale lønn for følgende fem dager:
                        </Element>
                        <Normaltekst tag="ul" style={{ marginTop: '0.5rem' }}>
                            {get5FørsteHverdager(datoAGP2).map(
                                (dato, index) => (
                                    <li key={index}>{formaterDato(dato)}</li>
                                )
                            )}
                        </Normaltekst>
                        {alertOmForskyvingAvAGP2HvisHelg(datoAGP2)}
                    </>
                ),
                beskrivelse: (
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Arbeidsgiverperiode 2 inntreffer dagen den ansatte har
                        vært permittert i 30 uker i løpet av de siste 18
                        månedene. I dette tilfellet vil den ansatte ha vært
                        permittert i 30 uker i 18-månedersperioden{' '}
                        {formaterDatoIntervall(
                            til18mndsperiode(sisteDagI18mndsperiode)
                        )}
                        .
                    </Normaltekst>
                ),
            };
        case Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT:
            const aktuell18mndsperiode = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                innføringsdatoAGP2,
                dagensDato,
                210
            );
            if (!aktuell18mndsperiode) {
                return {
                    konklusjon: `Arbeidsgiverperiode 2 vil ikke inntreffe i dette tilfellet. Permitteringsperiodene du har fylt inn ligger for langt tilbake i tid til å utløse arbeidsgiverperiode 2. `,
                    beskrivelse: (
                        <>
                            <Normaltekst
                                className={'utregningstekst__beskrivelse'}
                            >
                                Hvis du permitterer den ansatte nå vil
                                arbeidsgiverperiode 2 inntreffe dagen den
                                ansatte har vært permittert i 30 uker i løpet av
                                18 måneder.
                            </Normaltekst>
                            <Normaltekst
                                className={'utregningstekst__beskrivelse'}
                            >
                                Tips: Du kan fylle inn permitteringer framover i
                                tid, kalkulatoren vil da regne ut når
                                arbeidsgiverperiode 2 inntreffer ved fremtidige
                                permitteringer.
                            </Normaltekst>
                        </>
                    ),
                };
            }

            const oversiktOverPermittering = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                aktuell18mndsperiode.datoTil
            );

            return {
                konklusjon: (
                    <>
                        <Element>
                            Ved ytterligere permittering i tiden fram til{' '}
                            {formaterDato(aktuell18mndsperiode.datoTil)} vil
                            arbeidsgiverperiode 2 inntreffe etter{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                210 - oversiktOverPermittering.dagerBrukt
                            )}{' '}
                            uten lønn. Merk at du ved ny permittering alltid
                            skal betale lønn i arbeidsgiverperiode 1 fra starten
                            av permitteringen.
                        </Element>
                        {advarselOmForbeholdAvRegelEndringVedSeinDato(
                            aktuell18mndsperiode.datoTil,
                            datoPotensiellRegelendring
                        )}
                    </>
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Den ansatte har i perioden{' '}
                            {formaterDatoIntervall(
                                til18mndsperiode(aktuell18mndsperiode.datoTil)
                            )}{' '}
                            vært permittert i tilsammen{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                oversiktOverPermittering.dagerBrukt
                            )}
                            .
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Arbeidsgiverperiode 2 inntreffer dagen den ansatte
                            har vært permittert i 30 uker i løpet av de siste 18
                            månedene. Hvis du permitterer den ansatte på nytt
                            inntreffer arbeidsgiverperiode 1. Dersom du
                            permitterer i ytterlige{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                210 - oversiktOverPermittering.dagerBrukt
                            )}{' '}
                            innen {formaterDato(aktuell18mndsperiode.datoTil)}
                            {', '}
                            vil arbeidsgiverperiode 2 inntreffe.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Tips: Du kan fylle inn permitteringer framover i
                            tid, kalkulatoren vil da regne ut når
                            arbeidsgiverperiode 2 inntreffer ved fremtidige
                            permitteringer.
                        </Normaltekst>
                    </>
                ),
            };
        case Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_VED_INNFØRINGSDATO:
            return {
                konklusjon: (
                    <>
                        <Element>
                            Hvis den ansatte ikke er permittert 1. juni, vil
                            ikke arbeidsgiverperiode 2 inntreffe på denne dagen.
                        </Element>
                        {advarselHvisPermitteringEtterInnføringsDato(
                            tidslinje,
                            innføringsdatoAGP2
                        )}
                    </>
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            {' '}
                            Per 1. juni har den ansatte vært permittert i{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                oversiktOverPermitteringVedInnføringsdato.dagerBrukt
                            )}
                            . Arbeidsgiverperiode 2 er bare aktuelt for ansatte
                            som er permittert 1. juni eller seinere.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Hvis du permitterer igjen inntreffer
                            arbeidsgiverperiode 1, deretter kan
                            arbeidsgiverperiode 2 komme.
                        </Normaltekst>
                    </>
                ),
            };
    }
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
