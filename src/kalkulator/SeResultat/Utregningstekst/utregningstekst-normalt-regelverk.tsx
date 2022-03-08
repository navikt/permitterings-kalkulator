import React, { ReactElement } from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatointervallKategori,
    DatoMedKategori,
} from '../../typer';
import { Dayjs } from 'dayjs';

import {
    finnDato18MndFram,
    finnDato18MndTilbake,
    finnPotensiellLøpendePermittering,
    formaterDato,
    formaterDatoIntervall,
} from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnDatoForMaksPermitteringNormaltRegelverk,
    finnPermitteringssituasjonNormalRegelverk,
    getPermitteringsoversiktFor18Måneder,
    PermitteringssituasjonStandarkRegelverk,
} from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';
import {
    finnFørsteDatoMedPermitteringUtenFravær,
    finnFørstePermitteringsdatoFraDato,
} from '../../utils/tidslinje-utils';

interface ResultatTekst {
    konklusjon: ReactElement | string;
    beskrivelse: ReactElement | null;
}

export const lagResultatTekstNormaltRegelverk = (
    tidslinjeUtenPermitteringFor1Juli: DatoMedKategori[],
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs,
    innføringsdatoRegelEndring: Dayjs,
    innføringsdatoRegelEndring2: Dayjs
): ResultatTekst => {
    const permitteringsSituasjon = finnPermitteringssituasjonNormalRegelverk(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelEndring2,
        26 * 7
    );
    const tidligstePermitteringEtter1Juli = finnFørsteDatoMedPermitteringUtenFravær(
        tidslinjeUtenPermitteringFor1Juli
    );
    switch (permitteringsSituasjon) {
        case PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_VED_SLUTTDATO_AV_FORLENGELSE: {
            return {
                konklusjon: (
                    <>
                        <Element>
                            Du kan maksimalt permittere den ansatte til og med{' '}
                            {formaterDato(innføringsdatoRegelEndring2)}. Da vil
                            lønnsplikten gjeninntre.
                        </Element>
                    </>
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            01.04.2022 vil lønnsplikten gjeninntre for
                            permitteringer som overskrider 26 uker i løpet av 18
                            måneder.
                        </Normaltekst>
                    </>
                ),
            };
        }
        case PermitteringssituasjonStandarkRegelverk.MAKS_NÅDD_IKKE_PERMITTERT_VED_SLUTTDATO_AV_FORLENGELSE: {
            return {
                konklusjon: (
                    <>
                        <Element>
                            Du kan permittere den ansatte til og med{' '}
                            {formaterDato(innføringsdatoRegelEndring2)}. Etter
                            dette vil lønnsplikten gjeninntre.
                        </Element>
                    </>
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            01.04.2022 vil lønnsplikten gjeninntre for
                            permitteringer som overskrider 26 uker i løpet av 18
                            måneder. Siden den ansatte ikke er permittert på
                            denne datoen, vil ikke lønnsplikten inntreffe.
                        </Normaltekst>
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
                26 * 7
            )!!;
            const førstePermitteringI18mndsIntervall = finnFørstePermitteringsdatoFraDato(
                tidslinjeUtenPermitteringFor1Juli,
                datoMaksPermitteringNås
            );
            return {
                konklusjon: (
                    <>
                        <Element>
                            Du kan permittere den ansatte til og med{' '}
                            {formaterDato(datoMaksPermitteringNås)}. Etter dette
                            vil lønnsplikten gjeninntre.
                        </Element>
                    </>
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Du kan permittere en ansatt mer enn 26 uker i løpet
                            av 18 måneder.
                        </Normaltekst>
                    </>
                ),
            };
        }
        case PermitteringssituasjonStandarkRegelverk.MAKS_IKKE_NÅDD: {
            const aktuell18mndsperiode = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinjeUtenPermitteringFor1Juli,
                innføringsdatoRegelEndring,
                dagensDato,
                26 * 7
            );
            return {
                konklusjon: `Du har ikke nådd maks antall permitteringsdager enda.`,
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Den ansatte har i perioden{' '}
                            {formaterDatoIntervall(aktuell18mndsperiode!!)} vært
                            permittert i tilsammen{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                getPermitteringsoversiktFor18Måneder(
                                    tidslinjeUtenPermitteringFor1Juli,
                                    aktuell18mndsperiode!!.datoTil!!
                                ).dagerBrukt
                            )}
                            .
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Dersom du permitterer i ytterlige {''}
                            {skrivDagerIHeleUkerPlussDager(
                                26 * 7 -
                                    getPermitteringsoversiktFor18Måneder(
                                        tidslinjeUtenPermitteringFor1Juli,
                                        aktuell18mndsperiode!!.datoTil!!
                                    ).dagerBrukt
                            )}{' '}
                            {''}
                            innen {formaterDato(
                                aktuell18mndsperiode!!.datoTil
                            )}{' '}
                            vil du måtte avslutte permitteringen.
                        </Normaltekst>
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
