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
                        {formaterDato(dayjs('2021-04-19'))}
                    </Normaltekst>
                    <Normaltekst>
                        <span className="kalkulator__advarsel-bold">
                            Ny partsavtale om arbeid under permitteringsperioden
                        </span>{' '}
                        NHO og LO har inngått ny avtale om forlenge den
                        tidligere avbruddsperioden fra 6 til 10 uker som gjør at
                        en ansatt kan bli tatt tilbake tilbake til noe
                        arbeid/korte oppdrag under permitteringsperioden.{' '}
                        <a
                            href="https://www.nho.no/tema/arbeidsliv/artikler/nye-permitteringsregler/"
                            className="lenke"
                        >
                            Se NHO-side om avtalen.
                        </a>
                    </Normaltekst>

                    <Normaltekst className="kalkulator__advarsel-bold">
                        <br />
                        Vi jobber nå med å tydeliggjøre detailene fra avtalen og
                        vil implementer dette i denne veiviseren!
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
