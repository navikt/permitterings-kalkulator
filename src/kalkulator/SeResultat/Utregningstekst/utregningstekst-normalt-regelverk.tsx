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
    getPermitteringsoversiktFor18Måneder,
    Permitteringssituasjon,
} from '../../utils/beregningerForAGP2';
import {
    erHelg,
    finnDato18MndTilbake,
    finnesLøpendePeriode,
    formaterDato,
    formaterDatoIntervall,
    get5FørsteHverdager,
    getFørsteHverdag,
    til18mndsperiode,
} from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';
import { finnFørsteDatoMedPermitteringUtenFravær } from '../../utils/tidslinje-utils';
import Lenke from 'nav-frontend-lenker';
import {
    finnDatoForMaksPermittering,
    slettPermitteringsdagerFørDato,
} from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';

const datoPotensiellRegelendring = dayjs('2021-10-01');

interface ResultatTekst {
    konklusjon: ReactElement | string;
    beskrivelse: ReactElement | null;
}

export const lagResultatTekstNormaltRegelverk = (
    tidslinje: DatoMedKategori[],
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Dayjs,
    innføringsdatoRegelEndring: Dayjs
): ResultatTekst => {
    const tidslinjeUtenPermitteringFor1Juli = slettPermitteringsdagerFørDato(
        tidslinje,
        innføringsdatoRegelEndring
    );
    const datoForMaksPermitteringOppbrukt = finnDatoForMaksPermittering(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelEndring,
        26 * 7
    );

    if (datoForMaksPermitteringOppbrukt) {
        return {
            konklusjon: (
                <>
                    <Element>
                        Du må betale lønn fra
                        {formaterDato(datoForMaksPermitteringOppbrukt)}. Det
                        betyr at du skal betale lønn for følgende fem dager:
                    </Element>
                </>
            ),
            beskrivelse: (
                <>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Du må betale lønn når den ansatte som har vært
                        permittert i 26 uker eller mer i løpet av 18-måneder.
                    </Normaltekst>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Den ansatte har vært permittert i{' '}
                        {skrivDagerIHeleUkerPlussDager(
                            getPermitteringsoversiktFor18Måneder(
                                tidslinjeUtenPermitteringFor1Juli,
                                datoForMaksPermitteringOppbrukt
                            ).dagerBrukt
                        )}{' '}
                        i 18-månedersperioden{' '}
                        {formaterDatoIntervall({
                            datoFra: finnDato18MndTilbake(
                                datoForMaksPermitteringOppbrukt
                            ),
                            datoTil: datoForMaksPermitteringOppbrukt,
                        })}
                    </Normaltekst>
                </>
            ),
        };
    }

    const aktuell18mndsperiode = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
        tidslinjeUtenPermitteringFor1Juli,
        innføringsdatoRegelEndring,
        dagensDato,
        26 * 7
    );

    if (aktuell18mndsperiode) {
        const oversiktOverPermittering = getPermitteringsoversiktFor18Måneder(
            tidslinjeUtenPermitteringFor1Juli,
            aktuell18mndsperiode.datoTil
        );
        return {
            konklusjon: (
                <>
                    <Element>
                        Ved ytterligere permittering i tiden fram til{' '}
                        {' ' + formaterDato(aktuell18mndsperiode.datoTil)} vil
                        du måtte betale lønn etter
                        {' ' +
                            skrivDagerIHeleUkerPlussDager(
                                26 * 7 - oversiktOverPermittering.dagerBrukt
                            )}{' '}
                        . Merk at du ved ny permittering alltid skal betale lønn
                        i arbeidsgiverperiode 1 fra starten av permitteringen.
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
                        Du kan maksimalt permittere en ansatt i 26 uker i løpet
                        av 18 måneder. Dersom du permitterer i ytterlige{' '}
                        {skrivDagerIHeleUkerPlussDager(
                            7 * 26 - oversiktOverPermittering.dagerBrukt
                        )}{' '}
                        innen {formaterDato(aktuell18mndsperiode.datoTil)}
                        {', '}
                        vil du måtte avslutte permitteringen.
                    </Normaltekst>
                    <Normaltekst className={'utregningstekst__beskrivelse'}>
                        Tips: Du kan fylle inn permitteringer framover i tid,
                        kalkulatoren vil da regne ut når når lønnsplikten
                        inntreffer igjen.
                    </Normaltekst>
                </>
            ),
        };
    }
    return {
        konklusjon: `Avsluttede permitteringsperioder før 1. juli vil ikke påvirke videre permittering `,
        beskrivelse: (
            <>
                <Normaltekst className={'utregningstekst__beskrivelse'}>
                    Regelverket er nå tilbakestilt til normalen. Om du
                    permitterer nå kan du permittere i 26 uker i løpet av 18
                    måneder.
                </Normaltekst>
                <Normaltekst className={'utregningstekst__beskrivelse'}>
                    Tips: Du kan fylle inn permitteringer framover i tid,
                    kalkulatoren vil da regne ut når arbeidsgiverperiode 2
                    inntreffer ved fremtidige permitteringer.
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
