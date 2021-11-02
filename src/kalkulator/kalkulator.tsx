import React, { useContext, useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Element, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Fraværsperioder from './Fraværsperioder/Fraværsperioder';
import { AllePermitteringerOgFraværesPerioder, DatoMedKategori } from './typer';
import Topp from './Topp/Topp';
import { PermitteringContext } from '../ContextProvider';
import dayjs, { Dayjs } from 'dayjs';
import { Permitteringsperioder } from './Permitteringsperioder/Permitteringsperioder';
import {
    finnInitialgrenserForTidslinjedatoer,
    konstruerTidslinje,
    regnUtHvaSisteDatoPåTidslinjenSkalVære,
} from './utils/tidslinje-utils';
import { SeResultat } from './SeResultat/SeResultat';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { loggSidevinsing } from '../utils/amplitudeEvents';

const Kalkulator = () => {
    const { dagensDato, regelEndringsDato1Januar } = useContext(
        PermitteringContext
    );

    const [
        allePermitteringerOgFraværesPerioder,
        setAllePermitteringerOgFraværesPerioder,
    ] = useState<AllePermitteringerOgFraværesPerioder>({
        permitteringer: [{ datoFra: undefined, datoTil: undefined }],
        andreFraværsperioder: [],
    });

    const [
        sisteDagI18mndsPeriodeEndretAv,
        setsteDagI18mndsPeriodeEndretAv,
    ] = useState<'datovelger' | 'tidslinje' | 'ingen'>('ingen');

    const [sisteDagI18mndsPeriode, setSisteDagI18mndsPeriode] = useState<Dayjs>(
        regelEndringsDato1Januar
    );
    const [tidslinje, setTidslinje] = useState<DatoMedKategori[]>([]);
    const [
        sisteDatoVistPåTidslinje,
        setSisteDatoVistPåTidslinje,
    ] = useState<Dayjs>(
        finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil
    );

    useEffect(() => {
        loggSidevinsing();
    }, []);

    useEffect(() => {
        setTidslinje(
            konstruerTidslinje(
                allePermitteringerOgFraværesPerioder,
                dagensDato,
                sisteDatoVistPåTidslinje
            )
        );
    }, [allePermitteringerOgFraværesPerioder, sisteDatoVistPåTidslinje]);

    useEffect(() => {
        const nySisteDatoPåTidslinjen = regnUtHvaSisteDatoPåTidslinjenSkalVære(
            allePermitteringerOgFraværesPerioder,
            dagensDato
        );
        if (nySisteDatoPåTidslinjen.isAfter(sisteDatoVistPåTidslinje)) {
            setSisteDatoVistPåTidslinje(nySisteDatoPåTidslinjen);
        }
    }, [allePermitteringerOgFraværesPerioder]);

    return (
        <div className={'kalkulator__bakgrunn'}>
            <Banner>
                <span aria-label="Permitteringskalkulator">
                    Permitterings&shy;kalkulator
                </span>
            </Banner>
            <div className={'kalkulator'}>
                <AlertStripeAdvarsel className="kalkulator__advarsel">
                    <>
                        <Element>
                            Endringer i permitteringsordningen kan påvirke
                            kalkulatoren
                        </Element>
                        <Normaltekst>
                            Regjeringen foreslår at dagpenge- og
                            permitteringsperioder som nærmer seg slutten
                            forlenges frem til og med 31. desember 2021.
                            Kalkulatoren tar foreløpig ikke denne endringen med
                            i beregningen. Vi oppdaterer kalkulatoren når
                            regelverket er avklart.{' '}
                            <a
                                href="https://www.regjeringen.no/no/aktuelt/forlenger-koronatiltak-i-arbeidslivet-ut-aret/id2878080/"
                                className="lenke"
                            >
                                Les mer om forslaget på regjeringen.no
                            </a>
                        </Normaltekst>
                        <Element>Avtale mellom LO og NHO</Element>
                        <Normaltekst>
                            LO og NHO avtalte nye permitteringsregler som gjaldt
                            i perioden fra 8. mai 2021 til og med 30. september
                            2021. Hvis din virksomhet var omfattet av avtalen
                            vil ikke denne kalkulatoren gi riktig beregning i de
                            tilfellene der den ansatte jobbet i denne perioden
                            under permitteringen.{' '}
                            <a
                                href="https://arbeidsgiver.nav.no/arbeidsgiver-permittering/#iPermitteringsperioden"
                                className="lenke"
                            >
                                Les mer om avtalen i veiviser for permittering.
                            </a>
                        </Normaltekst>
                    </>
                </AlertStripeAdvarsel>
                <Innholdstittel tag="h2">
                    Hvor lenge kan du ha ansatte permittert?
                </Innholdstittel>
                <Topp />
                <Permitteringsperioder
                    allePermitteringerOgFraværesPerioder={
                        allePermitteringerOgFraværesPerioder
                    }
                    setAllePermitteringerOgFraværesPerioder={
                        setAllePermitteringerOgFraværesPerioder
                    }
                />
                <Fraværsperioder
                    setAllePermitteringerOgFraværesPerioder={
                        setAllePermitteringerOgFraværesPerioder
                    }
                    allePermitteringerOgFraværesPerioder={
                        allePermitteringerOgFraværesPerioder
                    }
                />
                <SeResultat
                    setEndringAv={setsteDagI18mndsPeriodeEndretAv}
                    tidslinje={tidslinje}
                    endringAv={sisteDagI18mndsPeriodeEndretAv}
                    sisteDagIPeriode={sisteDagI18mndsPeriode}
                    set18mndsPeriode={setSisteDagI18mndsPeriode}
                    allePermitteringerOgFraværesPerioder={
                        allePermitteringerOgFraværesPerioder
                    }
                />
            </div>
        </div>
    );
};

export default Kalkulator;
