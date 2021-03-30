import React, { FunctionComponent, ReactElement, useContext } from 'react';
import './Utregningstekst.less';
import {
    Permitteringssituasjon,
    InformasjonOmAGP2Status,
} from '../../utils/beregningerForAGP2';
import { Dayjs } from 'dayjs';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { PermitteringContext } from '../../../ContextProvider';
import { DatointervallKategori, DatoMedKategori } from '../../typer';
import Lenke from 'nav-frontend-lenker';
import lampeikon from './lampeikon.svg';
import { finnDato18MndTilbake, formaterDato } from '../../utils/dato-utils';

interface Props {
    informasjonOmAGP2Status: InformasjonOmAGP2Status;
    tidslinje: DatoMedKategori[];
}

interface ResultatTekst {
    konklusjon: string;
    beskrivelse: ReactElement | null;
}

export const lagResultatTekst = (
    informasjon: InformasjonOmAGP2Status
): ResultatTekst => {
    if (!informasjon.sluttDato) {
        return {
            konklusjon: `Arbeidsgiverperiode 2 vil ikke inntreffe i nær framtid.  Permitteringsperiodene du har fylt inn ligger for langt tilbake i tid til å kunne gi utslag i beregningen av Arbeidsgiverperiode 2.`,
            beskrivelse: <div />,
        };
    }
    switch (informasjon.type) {
        case Permitteringssituasjon.AGP2_NÅDD_ETTER_INNFØRINGSDATO:
            const tilleggstekstLøpendePermittering = informasjon.finnesLøpendePermittering
                ? ', dersom permitteringen holdes løpende'
                : '';
            return {
                konklusjon: `Arbeidsgiverperiode 2 vil intreffe ${formaterDato(
                    informasjon.sluttDato
                )}${tilleggstekstLøpendePermittering}. Det betyr at du skal betale lønn i fem dager fra ${formaterDato(
                    informasjon.sluttDato
                )} .`,
                beskrivelse: (
                    <>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Den ansatte har i perioden{' '}
                            {formaterDato(
                                finnDato18MndTilbake(informasjon.sluttDato)
                            )}
                            –{formaterDato(informasjon.sluttDato)} være
                            permittert i tilsammen mer enn 30 uker.
                        </Normaltekst>
                        <Normaltekst className={'utregningstekst__beskrivelse'}>
                            Arbeidsgiverperiode 2 inntreffer dagen den ansatte
                            har vært permittert i 30 uker i løpet av de siste 18
                            månedene. I dette tilfellet blir 18 måneders
                            perioden{' '}
                            {formaterDato(
                                finnDato18MndTilbake(informasjon.sluttDato)
                            )}{' '}
                            til {formaterDato(informasjon.sluttDato)}.
                        </Normaltekst>
                    </>
                ),
            };
        case Permitteringssituasjon.AGP2_NÅDD_VED_INNFØRINGSDATO:
            return {
                konklusjon: `Arbeidsgiverperiode 2 vil intreffe ${formaterDato(
                    informasjon.sluttDato
                )}. Det betyr at du skal betale lønn i fem dager fra ${formaterDato(
                    informasjon.sluttDato
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
                                informasjon.brukteDagerVedInnføringsdato
                            )}{' '}
                            i 18-månedsperioden før første juni (02.12.2019 –
                            01.06.2021). Dette overskrider 30 uker, dermed
                            inntreffer Arbeidsgiverperiode 2 den 1. juni.
                        </Normaltekst>
                    </>
                ),
            };
        //TODO returner antall dager permttert i nytt 18 mnds intervall (ikke 1. jun intervallet)
        case Permitteringssituasjon.AGP2_IKKE_NÅDD:
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
        case Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_INNFØRINGSDATO:
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
    const resultatTekst = lagResultatTekst(props.informasjonOmAGP2Status);

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
                        Tilbake til permitteringsveiviseren
                    </Lenke>
                </Normaltekst>
            </div>
        </>
    );
};

export default Utregningstekst;
