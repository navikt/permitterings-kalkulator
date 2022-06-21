import React, { ReactElement } from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatointervallKategori,
    DatoMedKategori,
} from '../../typer';
import { Dayjs } from 'dayjs';

import { finnDato18MndTilbake, formaterDato } from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    finnDatoForMaksPermitteringNormaltRegelverk,
    finnPermitteringssituasjonNormalRegelverk,
    getPermitteringsoversiktFor18Måneder,
    PermitteringssituasjonStandarkRegelverk,
} from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';
import {
    finnFørsteDatoMedPermitteringUtenFravær,
    finnFørstePermitteringsdatoFraDato,
    finnSisteDatoMedPermitteringUtenFravær,
} from '../../utils/tidslinje-utils';
import { loggPermitteringsSituasjon } from '../../../utils/amplitudeEvents';

interface ResultatTekst {
    konklusjon: ReactElement | string;
    beskrivelse: ReactElement | null;
}

const tekstOmPermitteringFør1JuliErSletter = () => {
    return (
        <Element className={'utregningstekst__beskrivelse'}>
            Merk at permitteringsdager før 1. juli 2021 er slettet som følge av
            nye permitteringsregler.
        </Element>
    );
};

export const lagResultatTekstNormaltRegelverk = (
    tidslinjeUtenPermitteringFor1Juli: DatoMedKategori[],
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs,
    innføringsdatoRegelEndring: Dayjs,
    innføringsdatoRegelEndring2: Dayjs,
    finnesSlettesPermittering: Boolean
): ResultatTekst => {
    const permitteringsSituasjon = finnPermitteringssituasjonNormalRegelverk(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelEndring2,
        dagensDato,
        26 * 7
    );
    const dagerBruktVedSluttPåDagpengeforlengelse = getPermitteringsoversiktFor18Måneder(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelEndring2
    ).dagerBrukt;
    switch (permitteringsSituasjon) {
        case PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE: {
            loggPermitteringsSituasjon(
                'Maks permittering nås på slutten av dagpengeforlengelsen',
                'normalt regelverk'
            );
            return {
                konklusjon: tekstOmBruktOgGjenværendePermitteringVedLøpendePermittering(
                    26 * 7,
                    dagerBruktVedSluttPåDagpengeforlengelse
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            01.04.2022 vil lønnsplikten gjeninntre for
                            permitteringer som overskrider 26 uker i løpet av 18
                            måneder.
                        </Normaltekst>
                        {finnesSlettesPermittering &&
                            tekstOmPermitteringFør1JuliErSletter()}
                    </>
                ),
            };
        }

        case PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE: {
            //er definert siden casen gir oss at det finnes en maksdato
            //muligens ikke riktig intervall her
            const datoMaksPermitteringNås = finnDatoForMaksPermitteringNormaltRegelverk(
                tidslinjeUtenPermitteringFor1Juli,
                innføringsdatoRegelEndring2,
                26 * 7,
                dagensDato
            )!!;
            const dagerBruktDagensDato = getPermitteringsoversiktFor18Måneder(
                tidslinjeUtenPermitteringFor1Juli,
                dagensDato
            ).dagerBrukt;
            const førstePermitteringI18mndsIntervall = finnFørstePermitteringsdatoFraDato(
                tidslinjeUtenPermitteringFor1Juli,
                datoMaksPermitteringNås
            );
            //// OBS SJEKK DENNE I PRAKSIS
            loggPermitteringsSituasjon(
                'Maks permittering nås i framtiden',
                'normalt regelverk'
            );
            return {
                konklusjon: tekstOmBruktOgGjenværendePermitteringVedLøpendePermittering(
                    26 * 7,
                    dagerBruktDagensDato
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Du kan maksimalt ha en ansatt permittert i 26 uker i
                            løpet av 18 måneder.
                        </Normaltekst>
                        {finnesSlettesPermittering &&
                            tekstOmPermitteringFør1JuliErSletter()}
                    </>
                ),
            };
        }
        case PermitteringssituasjonStandarkRegelverk.MAKS_IKKE_NÅDD: {
            const dagerBruktDagensDato = getPermitteringsoversiktFor18Måneder(
                tidslinjeUtenPermitteringFor1Juli,
                dagensDato
            ).dagerBrukt;
            loggPermitteringsSituasjon(
                'Maks permittering ikke nådd',
                'normalt regelverk'
            );
            return {
                konklusjon: tekstOmBruktOgGjenværendePermitteringVedLøpendePermittering(
                    26 * 7,
                    dagerBruktDagensDato
                ),
                beskrivelse:
                    dagerBruktDagensDato > 0 ? (
                        <>
                            <Normaltekst
                                className={'utregningstekst__beskrivelse'}
                            >
                                Du kan maksimalt ha en ansatt permittert i 26
                                uker i løpet av 18 måneder.
                            </Normaltekst>
                            {finnesSlettesPermittering &&
                                tekstOmPermitteringFør1JuliErSletter()}
                        </>
                    ) : (
                        <>
                            <Normaltekst
                                className={'utregningstekst__beskrivelse'}
                            >
                                Du har ingen permitteringsperioder som vil
                                påvirke beregningen.
                            </Normaltekst>
                            {tekstOmPermitteringFør1JuliErSletter()}
                        </>
                    ),
            };
        }
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

const tekstOmPermitteringFør1Juli = () => {
    return (
        <Normaltekst className={'utregningstekst__beskrivelse'}>
            For nye permitteringstilfeller fra 1. juli 2021 skal du ikke telle
            med eventuelle permitteringsperioder før 1. juli 2021 i
            18-månedersperioden. Permitteringsdager før 1. juli blir derfor
            utelatt og påvirker ikke utregningen for denne permitteringen.
        </Normaltekst>
    );
};

const skrivUker = (uker: number) => (uker === 1 ? '1 uke' : uker + ' uker');

const skrivDager = (dager: number) =>
    dager === 1 ? '1 dag' : dager + ' dager';

export const tekstOmBruktOgGjenværendePermitteringVedLøpendePermittering = (
    maksAntallDager: number,
    antallDagerBrukt: number
) => {
    const gjenståendeDager =
        antallDagerBrukt < maksAntallDager
            ? maksAntallDager - antallDagerBrukt
            : 0;
    const tekstOmDagpengeforlengelse =
        antallDagerBrukt > maksAntallDager
            ? 'På grunn av forlengelsen av dagpengeordningen kunne du permittere fram til 31. mars 2022.'
            : '';
    return (
        <Element className={'utregningstekst__beskrivelse'}>
            Du har per i dag permittert i{' '}
            {skrivDagerIHeleUkerPlussDager(antallDagerBrukt)} og har{' '}
            {skrivDagerIHeleUkerPlussDager(gjenståendeDager)} gjenstående.{' '}
            {tekstOmDagpengeforlengelse}
        </Element>
    );
};

export const tekstOmBruktOgGjenværendePermitteringVedAvsluttetPermittering = (
    maksAntallDager: number,
    antallDagerBrukt: number,
    datoPermitteringAvsluttes: Dayjs
) => {
    const gjenståendeDager =
        antallDagerBrukt < maksAntallDager
            ? maksAntallDager - antallDagerBrukt
            : 0;
    return (
        <Element className={'utregningstekst__beskrivelse'}>
            Du kan permittere fram til {formaterDato(datoPermitteringAvsluttes)}{' '}
            . Du har permittert i{' '}
            {skrivDagerIHeleUkerPlussDager(antallDagerBrukt)} og har{' '}
            {gjenståendeDager} gjenstående permitteringsdager.{' '}
        </Element>
    );
};
