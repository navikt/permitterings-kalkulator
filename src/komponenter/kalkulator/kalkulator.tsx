import React, { useContext, useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
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
import { formaterDato } from './utils/dato-utils';

const Kalkulator = () => {
    const { dagensDato, innføringsdatoAGP2 } = useContext(PermitteringContext);

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
        innføringsdatoAGP2
    );
    const [tidslinje, setTidslinje] = useState<DatoMedKategori[]>([]);
    const [
        sisteDatoVistPåTidslinje,
        setSisteDatoVistPåTidslinje,
    ] = useState<Dayjs>(
        finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil
    );

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
            <Banner classname={'banner'}>
                <span aria-label="Permitteringskalkulator">
                    Permitterings&shy;kalkulator
                </span>
            </Banner>
            <div className={'kalkulator'}>
                <AlertStripeAdvarsel className="kalkulator__advarsel">
                    <Normaltekst className="kalkulator__advarsel-bold">
                        {formaterDato(dayjs('2021-04-21'))}
                    </Normaltekst>
                    <Normaltekst>
                        <span className="kalkulator__advarsel-bold">
                            NAV kjenner til at LO og NHO er enige om nye
                            permitteringsregler.
                        </span>{' '}
                        Dette kan bety at beregningen som kalkulatoren gir nå
                        ikke er riktig etter at de nye reglene er iverksatt.
                        Merk at det kun er beregninger der den permitterte
                        jobber under permitteringen som eventuelt vil bli
                        berørt. Vi jobber med å tilpasse kalkulatoren og vil
                        legge ut informasjon så snart vi vet mer om de nye
                        reglene.{' '}
                        <a
                            href="https://www.nho.no/tema/arbeidsliv/artikler/nye-permitteringsregler/"
                            className="lenke"
                        >
                            Les mer om reglene på nettsiden til NHO
                        </a>
                    </Normaltekst>
                </AlertStripeAdvarsel>
                <Innholdstittel tag="h2">
                    Regn ut når du skal betale arbeidsgiverperiode 2
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
