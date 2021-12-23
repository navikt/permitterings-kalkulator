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
    finnTidligsteFraDato,
    formaterDato,
    formaterDatoIntervall,
    til18mndsperiode,
} from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnDatoForMaksPermittering,
    getPermitteringsoversiktFor18Måneder,
} from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';
import { loggPermitteringsSituasjon } from '../../../utils/amplitudeEvents';
import {
    erPermittertVedDato,
    finnFørsteDatoMedPermitteringUtenFravær,
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
    const finnesLøpendePermittering = !!finnPotensiellLøpendePermittering(
        allePermitteringerOgFraværesPerioder.permitteringer
    );
    const datoForMaksPermitteringOppbrukt = finnDatoForMaksPermittering(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelEndring,
        26 * 7
    );
    if (
        datoForMaksPermitteringOppbrukt &&
        datoForMaksPermitteringOppbrukt.isBefore(innføringsdatoRegelEndring2)
    ) {
        const oversiktOverbruktPermittering = getPermitteringsoversiktFor18Måneder(
            tidslinjeUtenPermitteringFor1Juli,
            innføringsdatoRegelEndring2
        );

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
                        Den ansatte har vært permittert i tilsammen{' '}
                        {skrivDagerIHeleUkerPlussDager(
                            oversiktOverbruktPermittering.dagerBrukt
                        )}{' '}
                        i 18-månedersperioden fra 1. juli 2021 til 30. desember
                        2022.
                    </Normaltekst>
                </>
            ),
        };
    }

    if (
        datoForMaksPermitteringOppbrukt &&
        datoForMaksPermitteringOppbrukt.isSameOrAfter(
            innføringsdatoRegelEndring2
        )
    ) {
        const harLøpendePermittering = finnPotensiellLøpendePermittering(
            allePermitteringerOgFraværesPerioder.permitteringer
        );
        if (!harLøpendePermittering) {
            if (datoForMaksPermitteringOppbrukt.isBefore(dagensDato)) {
                loggPermitteringsSituasjon(
                    'Arbeidsgiver har permittert mer enn tillatt.'
                );
            }
        } else {
            const forstePermitteringngsdagInnenfor18mndsPeriode = finnFørsteDatoMedPermitteringUtenFravær(
                tidslinjeUtenPermitteringFor1Juli,
                finnDato18MndTilbake(datoForMaksPermitteringOppbrukt)
            )?.dato!!;
            return {
                konklusjon: finnesLøpendePermittering ? (
                    <>
                        <Element>
                            Du har lønnsplikt fra{' '}
                            {formaterDato(datoForMaksPermitteringOppbrukt)},
                            dersom permitteringen holdes løpende. Da er maks
                            antall dager for permittering uten lønnsplikt nådd.
                        </Element>
                    </>
                ) : (
                    <>
                        <Element>
                            Maksgrensen for uker en ansatt kan være permittert
                            er nådd{' '}
                            {formaterDato(datoForMaksPermitteringOppbrukt)}.
                        </Element>
                    </>
                ),
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            For permitteringer som startet 1. juli eller senere,
                            kan du permittere inntil 26 uker innenfor en periode
                            på 18 måneder før lønnsplikten gjeninntrer.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Den ansatte har vært permittert i{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                getPermitteringsoversiktFor18Måneder(
                                    tidslinjeUtenPermitteringFor1Juli,
                                    datoForMaksPermitteringOppbrukt.subtract(
                                        1,
                                        'day'
                                    )
                                ).dagerBrukt
                            )}{' '}
                            i 18-månedersperioden{' '}
                            {formaterDatoIntervall({
                                datoFra: forstePermitteringngsdagInnenfor18mndsPeriode,
                                datoTil: finnDato18MndFram(
                                    forstePermitteringngsdagInnenfor18mndsPeriode
                                ),
                            })}
                            {finnTidligsteFraDato(
                                allePermitteringerOgFraværesPerioder.permitteringer
                            )?.isBefore(innføringsdatoRegelEndring) &&
                                tekstOmPermitteringFør1Juli()}
                        </Normaltekst>
                    </>
                ),
            };
        }
    }

    const aktuell18mndsperiode = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelEndring,
        dagensDato,
        26 * 7
    );

    if (
        erPermittertVedDato(
            tidslinjeUtenPermitteringFor1Juli,
            innføringsdatoRegelEndring
        ) &&
        finnTidligsteFraDato(
            allePermitteringerOgFraværesPerioder.permitteringer
        )?.isBefore(innføringsdatoRegelEndring)
    ) {
        return {
            konklusjon: `Ved videre permittering kan du permittere på nytt med regler gjeldende fra 01.07.2021. Dette innebærer at permittering før denne datoen er nullstilt.`,
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
                        {getPermitteringsoversiktFor18Måneder(
                            tidslinjeUtenPermitteringFor1Juli,
                            aktuell18mndsperiode!!.datoTil!!
                        ).dagerBrukt >=
                        26 * 7
                            ? 'Maks antall dager permittert uten lønn er nådd. Du kan ikke permittere den ansatte på nytt før 31. desember 2022, da gjeldene 18-månedersperiode er over.'
                            : 'Dersom du permitterer i ytterlige ' +
                              skrivDagerIHeleUkerPlussDager(
                                  26 * 7 -
                                      getPermitteringsoversiktFor18Måneder(
                                          tidslinjeUtenPermitteringFor1Juli,
                                          aktuell18mndsperiode!!.datoTil!!
                                      ).dagerBrukt
                              ) +
                              ' innen 30.12.2022, vil du måtte avslutte permitteringen. '}
                    </Normaltekst>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Tips: Du kan fylle inn permitteringer framover i tid,
                        kalkulatoren vil da regne ut når lønnsplikten inntreffer
                        igjen.
                    </Normaltekst>
                </>
            ),
        };
    }

    if (aktuell18mndsperiode) {
        const oversiktOverPermittering = getPermitteringsoversiktFor18Måneder(
            tidslinjeUtenPermitteringFor1Juli,
            aktuell18mndsperiode.datoTil
        );
        return {
            konklusjon: (
                <>
                    {oversiktOverPermittering.dagerBrukt >= 26 * 7 ? (
                        <Element>
                            Maks antall dager permittert uten lønn er nådd.
                        </Element>
                    ) : (
                        <Element>
                            Ved ytterligere permittering i tiden fram til{' '}
                            {formaterDato(aktuell18mndsperiode.datoTil)} vil du
                            måtte avbryte permitteringen etter{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                26 * 7 - oversiktOverPermittering.dagerBrukt
                            )}
                            . Merk at du ved ny permittering alltid skal betale
                            lønn i arbeidsgiverperiode 1 fra starten av
                            permitteringen.
                        </Element>
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
                    {oversiktOverPermittering.dagerBrukt >= 26 * 7 ? (
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Maks antall dager med permittering uten lønn er nådd
                            etter regelverket innført 1. juli 2021. Du kan ikke
                            permittere på nytt før etter{' '}
                            {formaterDato(aktuell18mndsperiode.datoTil)} da
                            gjeldene 18-månedersperiode er over.
                        </Normaltekst>
                    ) : (
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Du kan maksimalt permittere en ansatt i 26 uker i
                            løpet av 18 måneder. Dersom du permitterer i
                            ytterlige{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                7 * 26 - oversiktOverPermittering.dagerBrukt
                            )}{' '}
                            innen {formaterDato(aktuell18mndsperiode.datoTil)}
                            {', '}
                            vil du måtte avslutte permitteringen.
                        </Normaltekst>
                    )}
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Tips: Du kan fylle inn permitteringer framover i tid,
                        kalkulatoren vil da regne ut når lønnsplikten inntreffer
                        igjen.
                    </Normaltekst>
                    {finnTidligsteFraDato(
                        allePermitteringerOgFraværesPerioder.permitteringer
                    )?.isBefore(innføringsdatoRegelEndring) &&
                        tekstOmPermitteringFør1Juli()}
                </>
            ),
        };
    }
    return {
        konklusjon: `Avsluttede permitteringsperioder før 1. juli vil ikke påvirke videre permittering `,
        beskrivelse: (
            <>
                <Normaltekst className={'utregningstekst__beskrivelse'}>
                    For nye permitteringstilfeller fra 1. juli 2021 skal du ikke
                    telle med eventuelle permitteringsperioder før 1. juli 2021
                    i 18-månedersperioden. Permitteringsdager før 1. juli blir
                    derfor utelatt og påvirker ikke utregningen for denne
                    permitteringen. Les mer om permitteringsreglene i veiviser
                    for permittering.
                </Normaltekst>
                <Normaltekst className={'utregningstekst__beskrivelse'}>
                    Tips: Du kan fylle inn permitteringer framover i tid,
                    kalkulatoren vil da regne ut hvor lenge du kan ha ansatte
                    permittert uten lønn.
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
