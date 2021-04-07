import React, { ReactElement } from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    DatointervallKategori,
    DatoMedKategori,
} from '../../typer';
import { Dayjs } from 'dayjs';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnDatoForAGP2,
    finnPermitteringssituasjon,
    getPermitteringsoversiktFor18Måneder,
    Permitteringssituasjon,
} from '../../utils/beregningerForAGP2';
import {
    finnDato18MndTilbake,
    formaterDato,
    formaterDatoIntervall,
    til18mndsperiode,
} from '../../utils/dato-utils';
import { Normaltekst } from 'nav-frontend-typografi';

export const finnDenAktuelle18mndsperiodenSomSkalBeskrives = (
    tidslinje: DatoMedKategori[],
    dagensDato: Dayjs,
    innføringsdatoAGP2: Dayjs,
    antallDagerFørAGP2Inntreffer: number
): DatoIntervall | undefined => {
    const situasjon = finnPermitteringssituasjon(
        tidslinje,
        innføringsdatoAGP2,
        210
    );

    switch (situasjon) {
        case Permitteringssituasjon.AGP2_NÅDD_VED_INNFØRINGSDATO:
            return til18mndsperiode(innføringsdatoAGP2);
        case Permitteringssituasjon.AGP2_NÅDD_ETTER_INNFØRINGSDATO:
            const datoForAGP2 = finnDatoForAGP2(
                tidslinje,
                innføringsdatoAGP2,
                antallDagerFørAGP2Inntreffer
            )!;
            return til18mndsperiode(datoForAGP2.subtract(1, 'day'));
        case Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT:
            return finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinje,
                innføringsdatoAGP2,
                dagensDato,
                antallDagerFørAGP2Inntreffer
            );
        case Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_VED_INNFØRINGSDATO:
            return undefined;
    }
};

interface ResultatTekst {
    konklusjon: string;
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
                konklusjon: `Arbeidsgiverperiode 2 vil intreffe ${formaterDato(
                    innføringsdatoAGP2
                )}. Det betyr at du skal betale lønn for dagene 1., 2., 3., 4. og 7. juni, totalt 5 dager.`,
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Arbeidsgiverperiode 2 treffer ansatte som har vært
                            permittert i mer enn 30 uker i løpet av 18 måneders
                            perioden 02.12.2019 – 01.06.2021, dersom de
                            fremdeles er permittert 1. juni. Dette vil gjelde
                            for deg og de fleste andre arbeidsgivere som har
                            permittert ansatte i forbindelse med korona.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Den ansatte har vært permittert i{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                oversiktOverPermitteringVedInnføringsdato.dagerBrukt
                            )}{' '}
                            i 18-månedsperioden før første juni (02.12.2019 –
                            01.06.2021). Dette overskrider 30 uker, dermed
                            inntreffer Arbeidsgiverperiode 2 den 1. juni.
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
                konklusjon: `Arbeidsgiverperiode 2 vil intreffe ${formaterDato(
                    datoAGP2
                )}${tilleggstekstLøpendePermittering}. Det betyr at du skal betale lønn i fem dager fra ${formaterDato(
                    datoAGP2
                )}.`,
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Den ansatte har i perioden{' '}
                            {formaterDatoIntervall(
                                til18mndsperiode(sisteDagI18mndsperiode)
                            )}{' '}
                            vært permittert i tilsammen 30 uker.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Arbeidsgiverperiode 2 inntreffer dagen den ansatte
                            har vært permittert i mer enn 30 uker i løpet av de
                            siste 18 månedene. I dette tilfellet blir 18
                            måneders perioden{' '}
                            {formaterDatoIntervall(
                                til18mndsperiode(sisteDagI18mndsperiode)
                            )}
                            .
                        </Normaltekst>
                    </>
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
                    konklusjon: `Arbeidsgiverperiode 2 vil ikke inntreffe i nær framtid. Permitteringsperiodene du har fylt inn ligger for langt tilbake i tid til å kunne gi utslag i beregningen av Arbeidsgiverperiode 2.`,
                    beskrivelse: <div />,
                };
            }

            const oversiktOverPermittering = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                aktuell18mndsperiode.datoTil
            );

            return {
                konklusjon: `Du kan fram til ${formaterDato(
                    aktuell18mndsperiode.datoTil
                )}  permittere i ${skrivDagerIHeleUkerPlussDager(
                    210 - oversiktOverPermittering.dagerBrukt
                )} uten lønnsplikt før Arbeidsgiverperiode 2 inntreffer.`,
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
                            . Det betyr at du kan ha den ansatte permittert uten
                            lønnsplikt i{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                210 - oversiktOverPermittering.dagerBrukt
                            )}{' '}
                            før Arbeidsgiverperiode 2 inntreffer.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Når Arbeidsgiverperiode 2 inntreffer skal du betale
                            lønn i fem dager.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Tips: Du kan fylle inn permitteringer framover i
                            tid, kalkulatoren vil da regne ut når
                            Arbeidsgiverperiode 2 inntreffer ved fremtidige
                            permitteringer.
                        </Normaltekst>
                    </>
                ),
            };
        case Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_VED_INNFØRINGSDATO:
            return {
                konklusjon: `Siden den ansatte ikke er permittert 1. juni, vil ikke Arbeidsgiverperiode 2 inntreffe på denne dagen. Arbeidsgiverperiode 2 kan komme dersom den ansatte blir permittert igjen. `,
                beskrivelse: null,
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
        )} ikke teller med i beregningen siden dette faller utenfor det gjeldene 18-måneders-intervallet (${formaterDato(
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

const skrivUker = (uker: number) => (uker === 1 ? '1 uke' : uker + ' uker');

const skrivDager = (dager: number) =>
    dager === 1 ? '1 dag' : dager + ' dager';
