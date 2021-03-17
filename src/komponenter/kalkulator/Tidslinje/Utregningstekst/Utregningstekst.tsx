import React, { FunctionComponent, useEffect, useState } from 'react';
import './Utregningstekst.less';
import {
    ArbeidsgiverPeriode2Resulatet,
    InformasjonOmAGP2Status,
} from '../../beregningerForAGP2';
import dayjs from 'dayjs';
import { formaterDato } from '../../../Datovelger/datofunksjoner';
import { finnDato18MndTilbake } from '../../utregninger';
import { Normaltekst, Element } from 'nav-frontend-typografi';

interface Props {
    informasjonOmAGP2Status: InformasjonOmAGP2Status;
}

const beskrivelseAvInput = (info: InformasjonOmAGP2Status) => {
    return `Den ansatte har i perioden 2. desember 2019 til 1. juni 2021 vært permittert i ${skrivDagerIHeleUkerPlussDager(
        info.brukteDager + info.fraværsdager
    )}${leggTiltekstOmFraværsAndelVedFraværv(
        info.fraværsdager,
        info.brukteDager
    )} Det er dermed ${skrivDagerIHeleUkerPlussDager(
        info.brukteDager
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

const genererTekst = (info: InformasjonOmAGP2Status): string => {
    if (info.sluttDato) {
        switch (true) {
            case info.type === ArbeidsgiverPeriode2Resulatet.NÅDD_AGP2:
                return 'Dette overskrider 30 uker. Arbeidsgiverperiode 2 inntreffer 1.juni';
            case info.type ===
                ArbeidsgiverPeriode2Resulatet.LØPENDE_IKKE_NÅDD_AGP2:
                console.log(formaterDato(info.sluttDato), 'sluttdato');
                return (
                    'Dette overskrider ikke 30 uker. Dersom du har løpende permittering fram til ' +
                    formaterDato(info.sluttDato).toString() +
                    ' faller Arbeidsgiverperiode 2 på denne datoen.'
                );

            case info.type ===
                ArbeidsgiverPeriode2Resulatet.IKKE_LØPENDE_IKKE_NÅDD_AGP2:
                const sluttDatoString = formaterDato(info.sluttDato);
                console.log(sluttDatoString, 'sluddato- variabel');
                return (
                    'Du kan ha den ansatte permittert i ' +
                    skrivDagerIHeleUkerPlussDager(
                        info.gjenståendePermitteringsDager
                    ) +
                    ' fram til ' +
                    +sluttDatoString +
                    ' før Arbeidsgiverperiode 2 inntreffer.'
                );
        }
    }
    return '';
};

const Utregningstekst: FunctionComponent<Props> = (props) => {
    const [tekst, setTekst] = useState('');

    useEffect(() => {
        setTekst(genererTekst(props.informasjonOmAGP2Status));
    }, [props.informasjonOmAGP2Status]);

    return (
        <>
            <div className={'kalkulator__tidslinje-utregningstekst-container'}>
                <Normaltekst>
                    {beskrivelseAvInput(props.informasjonOmAGP2Status)}
                </Normaltekst>
                <br />
                <Element>{tekst}</Element>
                <br />
                <Normaltekst>
                    Dersom du vil vite mer om når AGP2 inntreffer ved framtidige
                    permitteringer, kan du gjøre dette ved å fylle inn
                    permitteringer framover i tid. Kalkulatoren vil da regne ut
                    når ( og hvis) AGP 2 inntreffer.
                </Normaltekst>
            </div>
        </>
    );
};

export default Utregningstekst;
