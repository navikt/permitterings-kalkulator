import React, { ReactElement } from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../../typer';
import { Dayjs } from 'dayjs';
import { Normaltekst } from 'nav-frontend-typografi';

import {
    PermitteringssituasjonVedSluttPaForlengelse,
    getPermitteringsoversiktFor18Måneder,
    finnPermitteringssituasjonVedSluttPåForlengelse,
} from '../../utils/beregningerForSluttPåDagpengeforlengelse';
import { finnSisteDatoMedPermitteringUtenFravær } from '../../utils/tidslinje-utils';
import {
    tekstOmBruktOgGjenværendePermitteringVedAvsluttetPermittering,
    tekstOmBruktOgGjenværendePermitteringVedLøpendePermittering,
} from './utregningstekst-normalt-regelverk';
import { loggPermitteringsSituasjon } from '../../../utils/amplitudeEvents';

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
    switch (situasjon) {
        case PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_NORMALT_REGELVERK_SPESIALCASE:
            const sistePermitteringsdato = finnSisteDatoMedPermitteringUtenFravær(
                tidslinje
            );
            const antallDagerBrukt = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                datoSluttPaDagepengeForlengelse
            ).dagerBrukt;
            loggPermitteringsSituasjon(
                'Permittert mer enn 27 uker men mindre enn 49',
                'koronaregelverk'
            );
            return {
                konklusjon: tekstOmBruktOgGjenværendePermitteringVedAvsluttetPermittering(
                    26 * 7,
                    antallDagerBrukt,
                    sistePermitteringsdato
                ),
                beskrivelse: (
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        01.04.2022 vil lønnsplikten gjeninntre for
                        permitteringer som overskrider 26 uker i løpet av 18
                        måneder.
                    </Normaltekst>
                ),
            };
        case PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE: {
            const antallDagerBrukt = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                datoSluttPaDagepengeForlengelse
            ).dagerBrukt;
            loggPermitteringsSituasjon(
                'Maks permittering nås på slutten av dagpengeforlengelsen',
                'koronaregelverk'
            );
            return {
                konklusjon: tekstOmBruktOgGjenværendePermitteringVedLøpendePermittering(
                    49 * 7,
                    antallDagerBrukt
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            01.04.2022 vil lønnsplikten gjeninntre for
                            permitteringer som overskrider 49 uker i løpet av 18
                            måneder.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Hvis den aktive permitteringer avsluttes og du
                            ønsker å permittere på nytt, vil nye regler gjelde.
                        </Normaltekst>
                    </>
                ),
            };
        }
        case PermitteringssituasjonVedSluttPaForlengelse.MAKS_NÅDD_ETTER_SLUTTDATO_AV_FORLENGELSE: {
            const dagerBruktDagensDato = getPermitteringsoversiktFor18Måneder(
                tidslinje,
                dagensDato
            ).dagerBrukt;
            loggPermitteringsSituasjon(
                'Maks permittering nås i framtiden',
                'normalt regelverk'
            );
            return {
                konklusjon: tekstOmBruktOgGjenværendePermitteringVedLøpendePermittering(
                    49 * 7,
                    dagerBruktDagensDato
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Du kan maksimalt ha en ansatt permittert i 49 uker i
                            løpet av 18 måneder for permitteringer iverksatt før
                            1. juli.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Hvis den aktive permitteringer avsluttes og du
                            ønsker å permittere på nytt, vil nye regler gjelde.
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

const skrivUker = (uker: number) => (uker === 1 ? '1 uke' : uker + ' uker');

const skrivDager = (dager: number) =>
    dager === 1 ? '1 dag' : dager + ' dager';
