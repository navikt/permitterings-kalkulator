import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useState,
} from 'react';
import './Utregningstekst.less';
import {
    ArbeidsgiverPeriode2Resulatet,
    InformasjonOmAGP2Status,
} from '../../beregningerForAGP2';
import { Dayjs } from 'dayjs';
import { formaterDato } from '../../../Datovelger/datofunksjoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { PermitteringContext } from '../../../ContextProvider';
import { datointervallKategori, DatoMedKategori } from '../../typer';
import { finnDato18MndTilbake } from '../../utregninger';
import Lenke from 'nav-frontend-lenker';
import lampeikon from './lampeikon.svg';

interface Props {
    informasjonOmAGP2Status: InformasjonOmAGP2Status;
    tidslinje: DatoMedKategori[];
}

const lagTekstOmDatoerSomFallerUtenforRelevant18mndsPeriode = (
    tidslinje: DatoMedKategori[],
    sluttDato18mndsIntervall: Dayjs
) => {
    const startDato18mndsIntervall = finnDato18MndTilbake(
        sluttDato18mndsIntervall
    );
    const finnesPermitteringerFørGittDato = tidslinje.find(
        (datoMedKategori) =>
            datoMedKategori.kategori === datointervallKategori.PERMITTERT &&
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

const tekstNådd30UkerVedInnføringsdato = (
    info: InformasjonOmAGP2Status,
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs
) => {
    const førsteDel = `Dette overskrider 30 uker. ${tekstOmPermitteringPåInnføringsdato(
        info.permittertVedInnføringsdato
    )}`;
    const sistedelAvTekst = lagTekstOmDatoerSomFallerUtenforRelevant18mndsPeriode(
        tidslinje,
        innføringsdatoAGP2
    );
    return (
        <div>
            <Element>{førsteDel}</Element>
            {sistedelAvTekst && (
                <Normaltekst>
                    <br />
                    {sistedelAvTekst}
                </Normaltekst>
            )}
        </div>
    );
};

const tekstIkkeNåddAGP2Løpende = (
    info: InformasjonOmAGP2Status,
    tidslinje: DatoMedKategori[],
    sisteDagAvRelevantIntervall: Dayjs
) => {
    const førsteDel = `Dette overskrider ikke 30 uker. Dersom du har løpende permittering fram til 
                    ${formaterDato(info.sluttDato!).toString()} 
                     faller Arbeidsgiverperiode 2 på denne datoen.`;
    const sistedelAvTekst = lagTekstOmDatoerSomFallerUtenforRelevant18mndsPeriode(
        tidslinje,
        sisteDagAvRelevantIntervall
    );
    return (
        <div>
            <Element>{førsteDel}</Element>
            {sistedelAvTekst && (
                <Normaltekst>
                    <br />
                    {sistedelAvTekst}
                </Normaltekst>
            )}
        </div>
    );
};

const tekstIkkeNåddAGP2IkkeLøpende = (
    info: InformasjonOmAGP2Status,
    tidslinje: DatoMedKategori[],
    sisteDagAvRelevantIntervall: Dayjs
) => {
    const førsteDel = `Du kan ha den ansatte permittert i
                    ${skrivDagerIHeleUkerPlussDager(
                        info.gjenståendePermitteringsDager
                    )}
                     innen 
                    ${formaterDato(sisteDagAvRelevantIntervall)}, 
                     før Arbeidsgiverperiode 2 inntreffer.`;
    const sistedelAvTekst = lagTekstOmDatoerSomFallerUtenforRelevant18mndsPeriode(
        tidslinje,
        sisteDagAvRelevantIntervall!
    );
    return (
        <div>
            <Element>{førsteDel}</Element>
            {sistedelAvTekst && (
                <Normaltekst>
                    <br />
                    {sistedelAvTekst}
                </Normaltekst>
            )}
        </div>
    );
};

const beskrivelseAvInput = (info: InformasjonOmAGP2Status) => {
    return `Den ansatte har i perioden 2. desember 2019 til 1. juni 2021 vært permittert i ${skrivDagerIHeleUkerPlussDager(
        info.permitteringsdagerVedInnføringsdato
    )}${leggTiltekstOmFraværsAndelVedFraværv(
        info.fraværsdagerVedInnføringsdato,
        info.brukteDagerVedInnføringsdato
    )} Det er dermed ${skrivDagerIHeleUkerPlussDager(
        info.brukteDagerVedInnføringsdato
    )} som telles med i beregningen av Arbeidsgiverperiode 2. `;
};

const skrivDagerIHeleUkerPlussDager = (dager: number) => {
    const heleUkerPermittert = Math.floor(dager / 7);
    const restIDager = dager % 7;

    if (heleUkerPermittert > 0) {
        const dagerITekst = restIDager === 0 ? '' : ` og ${restIDager} dager`;
        return `${heleUkerPermittert} uker${dagerITekst}`;
    }
    return `${restIDager} dager`;
};

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

const genererTekst = (
    info: InformasjonOmAGP2Status,
    tidslinje: DatoMedKategori[],
    innføringsdatoAGP2: Dayjs
) => {
    if (info.sluttDato) {
        switch (info.type) {
            case ArbeidsgiverPeriode2Resulatet.NÅDD_AGP2:
                return tekstNådd30UkerVedInnføringsdato(
                    info,
                    tidslinje,
                    innføringsdatoAGP2
                );
            case ArbeidsgiverPeriode2Resulatet.LØPENDE_IKKE_NÅDD_AGP2:
                return tekstIkkeNåddAGP2Løpende(
                    info,
                    tidslinje,
                    info.sluttDato
                );
            case ArbeidsgiverPeriode2Resulatet.IKKE_LØPENDE_IKKE_NÅDD_AGP2:
                return tekstIkkeNåddAGP2IkkeLøpende(
                    info,
                    tidslinje,
                    info.sluttDato
                );
        }
    } else {
        return (
            <div>
                <Element>
                    Den ansatte er ikke permittert lenge nok til å nå
                    Arbeidsgiverperiode 2.
                </Element>
            </div>
        );
    }
};

const Utregningstekst: FunctionComponent<Props> = (props) => {
    const { innføringsdatoAGP2 } = useContext(PermitteringContext);
    const [tekst, setTekst] = useState(<div />);

    useEffect(() => {
        setTekst(
            genererTekst(
                props.informasjonOmAGP2Status,
                props.tidslinje,
                innføringsdatoAGP2
            )
        );
    }, [props.informasjonOmAGP2Status, props.tidslinje, innføringsdatoAGP2]);

    return (
        <>
            <div className={'kalkulator__tidslinje-utregningstekst-container'}>
                <img
                    className={'kalkulator__tidslinje-lampeikon'}
                    src={lampeikon}
                    alt={''}
                />
                <Normaltekst>
                    {beskrivelseAvInput(props.informasjonOmAGP2Status)}
                </Normaltekst>
                <br />
                {tekst}
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
