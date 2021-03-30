import React, { FunctionComponent, ReactElement, useContext } from 'react';
import './Utregningstekst.less';
import {
    finnDatoAGP2EtterInnføringsdato,
    finnOversiktOverPermitteringOgFraværGitt18mnd,
    finnPermitteringssituasjon,
    getInformasjonOmAGP2HvisAGP2IkkeNås,
    InformasjonOmAGP2Status,
    Permitteringssituasjon,
} from '../../utils/beregningerForAGP2';
import { Dayjs } from 'dayjs';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    DatointervallKategori,
    DatoMedKategori,
} from '../../typer';
import Lenke from 'nav-frontend-lenker';
import lampeikon from './lampeikon.svg';
import { finnDato18MndTilbake, formaterDato } from '../../utils/dato-utils';
import { PermitteringContext } from '../../../ContextProvider';

interface Props {
    tidslinje: DatoMedKategori[];
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

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
    const oversiktOverPermitteringVedInnføringsdato = finnOversiktOverPermitteringOgFraværGitt18mnd(
        innføringsdatoAGP2,
        tidslinje
    );

    switch (situasjon) {
        case Permitteringssituasjon.AGP2_NÅDD_VED_INNFØRINGSDATO:
            return {
                konklusjon: `Arbeidsgiverperiode 2 vil intreffe ${formaterDato(
                    innføringsdatoAGP2
                )}. Det betyr at du skal betale lønn i fem dager fra ${formaterDato(
                    innføringsdatoAGP2
                )} `,
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Arbeidsgiverperiode 2 treffer ansatte som har vært
                            permittert i mer enn 30 uker i løpet av 18 måneders
                            perioden 02.12.2019 – 01.06.2021, dersom de
                            fremdeles er permittert 1. juni. Dette vil gjelde
                            for deg og de fleste arbeidsgivere som har
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
            const datoAGP2: Dayjs = finnDatoAGP2EtterInnføringsdato(
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
                )} .`,
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Den ansatte har i perioden{' '}
                            {formaterDato(
                                finnDato18MndTilbake(sisteDagI18mndsperiode)
                            )}
                            –{formaterDato(sisteDagI18mndsperiode)} være
                            permittert i tilsammen 30 uker.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Arbeidsgiverperiode 2 inntreffer dagen den ansatte
                            har vært permittert i mer enn 30 uker i løpet av de
                            siste 18 månedene. I dette tilfellet blir 18
                            måneders perioden{' '}
                            {formaterDato(
                                finnDato18MndTilbake(sisteDagI18mndsperiode)
                            )}{' '}
                            til {formaterDato(sisteDagI18mndsperiode)}.
                        </Normaltekst>
                    </>
                ),
            };
        case Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_FOR_LITE_PERMITTERT:
            const informasjon = getInformasjonOmAGP2HvisAGP2IkkeNås(
                tidslinje,
                innføringsdatoAGP2,
                210,
                dagensDato
            );
            if (!informasjon.sluttDato) {
                return {
                    konklusjon: `Arbeidsgiverperiode 2 vil ikke inntreffe i nær framtid. Permitteringsperiodene du har fylt inn ligger for langt tilbake i tid til å kunne gi utslag i beregningen av Arbeidsgiverperiode 2.`,
                    beskrivelse: <div />,
                };
            }
            return {
                konklusjon: `Du kan fram til ${formaterDato(
                    informasjon.sluttDato
                )}  permittere i ${skrivDagerIHeleUkerPlussDager(
                    informasjon.gjenståendePermitteringsdager
                )} uten lønnsplikt før Arbeidsgiverperiode 2 inntreffer.`,
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Den ansatte har i perioden{' '}
                            {formaterDato(
                                finnDato18MndTilbake(informasjon.sluttDato)
                            )}
                            –{formaterDato(informasjon.sluttDato)} vært
                            permittert i tilsammen{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                informasjon.bruktePermitteringsdager!
                            )}
                            . Det betyr at du kan ha den ansatte permittert uten
                            lønnsplikt i{' '}
                            {skrivDagerIHeleUkerPlussDager(
                                informasjon.gjenståendePermitteringsdager
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
            datoMedKategori.kategori === DatointervallKategori.PERMITTERT &&
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

const tekstSumPermitteringI18mndsPeriode = (info: InformasjonOmAGP2Status) => {
    return `Den ansatte har i perioden ${formaterDato(
        finnDato18MndTilbake(info.sluttDato!)
    )} til ${formaterDato(
        info.sluttDato!
    )} vært permittert i tilsammen ${skrivDagerIHeleUkerPlussDager(
        info.permitteringsdagerVedInnføringsdato
    )}`;
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

const Utregningstekst: FunctionComponent<Props> = (props) => {
    const { dagensDato, innføringsdatoAGP2 } = useContext(PermitteringContext);

    const resultatTekst = lagResultatTekst(
        props.tidslinje,
        props.allePermitteringerOgFraværesPerioder,
        dagensDato,
        innføringsdatoAGP2
    );

    return (
        <>
            <div className={'kalkulator__tidslinje-utregningstekst-container'}>
                <img
                    className={'kalkulator__tidslinje-lampeikon'}
                    src={lampeikon}
                    alt={''}
                />
                <Element>{resultatTekst.konklusjon}</Element>
                {resultatTekst.beskrivelse}
                <Normaltekst className={'kalkulator__informasjonslenker'}>
                    <Lenke
                        href={
                            'https://arbeidsgiver.nav.no/arbeidsgiver-permittering/#narSkalJegUtbetaleLonn'
                        }
                    >
                        Les mer om Arbeidsgiverperiode 2
                    </Lenke>
                    <Lenke
                        href={
                            'https://arbeidsgiver.nav.no/arbeidsgiver-permittering/'
                        }
                    >
                        Tilbake til permitteringsveivisereng
                    </Lenke>
                </Normaltekst>
            </div>
        </>
    );
};

export default Utregningstekst;
