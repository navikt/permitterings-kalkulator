import React, { FunctionComponent, useContext } from 'react';
import './Utregningstekst.less';
import {
    Permitteringssituasjon,
    InformasjonOmAGP2Status,
} from '../../beregningerForAGP2';
import { Dayjs } from 'dayjs';
import { formaterDato } from '../../../Datovelger/datofunksjoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { PermitteringContext } from '../../../ContextProvider';
import { DatointervallKategori, DatoMedKategori } from '../../typer';
import { finnDato18MndTilbake } from '../../utregninger';
import Lenke from 'nav-frontend-lenker';
import lampeikon from './lampeikon.svg';

interface Props {
    informasjonOmAGP2Status: InformasjonOmAGP2Status;
    tidslinje: DatoMedKategori[];
}

export const lagResultatTekstOverskrift = (
    informasjon: InformasjonOmAGP2Status
) => {
    if (!informasjon.sluttDato) {
        return `Arbeidsgiverperiode 2 vil ikke inntreffe i nær framtid.  Permitteringsperiodene du har fylt inn ligger for langt tilbake i tid til å kunne gi utslag i beregningen av Arbeidsgiverperiode 2.`;
    }
    switch (informasjon.type) {
        case Permitteringssituasjon.AGP2_NÅDD_ETTER_INNFØRINGSDATO:
            const tilleggstekstLøpendePermittering = informasjon.finnesLøpendePermittering
                ? ', dersom permitteringen holdes løpende'
                : '';
            return `Arbeidsgiverperiode 2 vil intreffe ${formaterDato(
                finnDato18MndTilbake(informasjon.sluttDato)
            )}${tilleggstekstLøpendePermittering}. Det betyr at du skal betale lønn i fem dager fra ${formaterDato(
                informasjon.sluttDato
            )} `;
        case Permitteringssituasjon.AGP2_NÅDD_VED_INNFØRINGSDATO:
            return `Arbeidsgiverperiode 2 vil intreffe ${formaterDato(
                finnDato18MndTilbake(informasjon.sluttDato)
            )}. Det betyr at du skal betale lønn i fem dager fra ${formaterDato(
                informasjon.sluttDato
            )} `;
        case Permitteringssituasjon.AGP2_IKKE_NÅDD:
            return `Du kan fram til ${formaterDato(
                informasjon.sluttDato
            )}  permittere i ${skrivDagerIHeleUkerPlussDager(
                informasjon.gjenståendePermitteringsDager
            )} uten lønnsplikt  før Arbeidsgiverperiode 2 inntreffer.`;
        case Permitteringssituasjon.AGP2_IKKE_NÅDD_PGA_IKKE_PERMITTERT_INNFØRINGSDATO:
            return `Siden den ansatte ikke er permittert 1. juni, vil ikke Arbeidsgiverperiode 2 inntreffe på denne dagen. Arbeidsgiverperiode 2 kan komme dersom den ansatte blir permittert igjen. `;
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

const leggTiltekstOmFraværsAndelVedFraværv = (
    fraværsdager: number,
    brukteDager: number
) => {
    if (fraværsdager > 0) {
        return ` og har hatt et fravær på ${skrivDagerIHeleUkerPlussDager(
            fraværsdager
        )} i denne perioden. Det er dermed ${skrivDagerIHeleUkerPlussDager(
            brukteDager
        )} som telles med i beregningen av Arbeidsgiverperiode 2.`;
    }
    return '.';
};

const tekstOmPermitteringPåInnføringsdato = (
    erPermittertVedInnføring?: boolean
) => {
    if (erPermittertVedInnføring) {
        return 'Arbeidsgiverperiode 2 inntreffer 1.juni';
    }
    return 'Dersom den ansatte er permittert 1. juni vil Arbeidsgiverperiode 2 inntreffe på denne datoen.';
};

const Utregningstekst: FunctionComponent<Props> = (props) => {
    const { innføringsdatoAGP2 } = useContext(PermitteringContext);

    return (
        <>
            <div className={'kalkulator__tidslinje-utregningstekst-container'}>
                <img
                    className={'kalkulator__tidslinje-lampeikon'}
                    src={lampeikon}
                    alt={''}
                />
                <Element>
                    {lagResultatTekstOverskrift(props.informasjonOmAGP2Status)}
                </Element>
                <br />
                <br />
                <Normaltekst>
                    Dersom du vil vite mer om når AGP2 inntreffer ved framtidige
                    permitteringer, kan du gjøre dette ved å fylle inn
                    permitteringer framover i tid. Kalkulatoren vil da regne ut
                    når (og hvis) Arbeidsgiverperiode 2 inntreffer.
                </Normaltekst>
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
