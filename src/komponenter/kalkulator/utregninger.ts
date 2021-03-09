import { skrivOmDato } from '../Datovelger/datofunksjoner';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    DatoMedKategori,
    OversiktOverBrukteOgGjenværendeDager,
} from './typer';

export const antalldagerGått = (fra?: Date, til?: Date) => {
    if (fra && til) {
        const msGatt = til.getTime() - fra.getTime();
        const dagerGått = msGatt / (1000 * 60 * 60 * 24);
        return Math.round(dagerGått + 1);
    }
    return 0;
};

export const antallUkerRundetOpp = (antallDager: number) => {
    return Math.ceil(antallDager / 7);
};

export const resultatAvAGP2TidligsteDato = (
    tidligsteDatoAGP2: Date,
    allePErmitteringerOgFraværsperioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Date
): OversiktOverBrukteOgGjenværendeDager => {
    const permitteringerInnenforAktuellPeriode = kuttAvDatoIntervallInnenfor18mndHeleListen(
        tidligsteDatoAGP2,
        allePErmitteringerOgFraværsperioder
    );
    return sumPermitteringerOgFravær(
        permitteringerInnenforAktuellPeriode,
        dagensDato
    );
};

export const regnUtAGP2MedLøpendeSluttperiode = (
    tidligsteDatoAGP2: Date,
    allePErmitteringerOgFraværsperioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Date
) => {
    const permitteringerInnenforAktuellPeriode = kuttAvDatoIntervallInnenfor18mndHeleListen(
        tidligsteDatoAGP2,
        allePErmitteringerOgFraværsperioder
    );
    const gjenståendePermittertingsDager = sumPermitteringerOgFravær(
        permitteringerInnenforAktuellPeriode,
        dagensDato
    ).dagerGjensående;
    const tidligstePermitteringsDato = finnTidligsteDato(
        permitteringerInnenforAktuellPeriode.permitteringer
    );
};

export const sumPermitteringerOgFravær = (
    allePErmitteringerOgFraværsperioder: AllePermitteringerOgFraværesPerioder,
    dagensDato: Date
): OversiktOverBrukteOgGjenværendeDager => {
    const statusAlleDager18mndLsite = konstruerStatiskTidslinje(
        allePErmitteringerOgFraværsperioder,
        dagensDato
    );
    let permittert = 0;
    let antallDagerFravær = 0;
    let gjenståendeDager = 0;
    statusAlleDager18mndLsite.forEach((dag) => {
        if (dag.kategori === 0) {
            permittert++;
        }
        if (dag.kategori === 1) {
            gjenståendeDager++;
        }
        if (dag.kategori === 2) {
            antallDagerFravær++;
        }
    });

    const oversikt: OversiktOverBrukteOgGjenværendeDager = {
        dagerPermittert: permittert,
        dagerGjensående: gjenståendeDager,
        dagerAnnetFravær: antallDagerFravær,
    };
    return oversikt;
};

//AGP2FUNKSJONER
export const finnDatoAGP2 = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Date,
    erLøpende: boolean,
    dagensDato: Date
): Date | undefined => {
    const statusPermittering1muligAGP2 = finnOversiktOverBruktPermitteringIGittIntervall(
        tidligsteDatoAGP2,
        tidslinje
    );
    const gjenVærendePermittering = finnGjenståendePermitteringsDager(
        statusPermittering1muligAGP2
    );
    if (gjenVærendePermittering <= 0) {
        console.log('case 1');
        return tidligsteDatoAGP2;
    }
    if (erLøpende) {
        return finnDatoAGP2LøpendPermittering(
            tidslinje,
            tidligsteDatoAGP2,
            gjenVærendePermittering
        );
        console.log('case 2');
    } else {
        const oversikt = finnPeriodeForÅBrukeGjenståendeDager(
            tidslinje,
            tidligsteDatoAGP2,
            dagensDato
        );
        console.log(
            'case 3 informasjon: , du kan permittere ' +
                oversikt?.gjenståendePermitteringsDager +
                ' innen ' +
                oversikt?.sluttDato
        );
        return oversikt?.sluttDato;
    }
};

//må legge til grensetilfeller dersom AGP2 inntreffer for langt fram i tid. Viktig å teste - setDato() her.
export const finnDatoAGP2LøpendPermittering = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Date,
    gjenStåendeDager: number
) => {
    let datoLøpendePermittering = new Date(tidligsteDatoAGP2);
    let dagerGjenstår = gjenStåendeDager;
    while (gjenStåendeDager > 0) {
        datoLøpendePermittering.setDate(
            datoLøpendePermittering.getDate() + gjenStåendeDager
        );
        const statusPermittering1muligAGP2 = finnOversiktOverBruktPermitteringIGittIntervall(
            datoLøpendePermittering,
            tidslinje
        );
        dagerGjenstår =
            statusPermittering1muligAGP2.dagerPermittert -
            statusPermittering1muligAGP2.dagerAnnetFravær;
    }
    return datoLøpendePermittering;
};

export interface InformasjonOmGjenståendeDagerOgPeriodeAGP2 {
    sluttDato: Date;
    gjenståendePermitteringsDager: number;
}

const finnGjenståendePermitteringsDager = (
    oversikt: OversiktOverBrukteOgGjenværendeDager
) => {
    return 7 * 30 - (oversikt.dagerPermittert - oversikt.dagerAnnetFravær);
};

//regner ut differansen i gjenstående permitteringsdager i forhold til antall dager man kan plassere permitteringsdatoene på
//eksempel hvis man har 20 gjenstående permitteringsdager man kan bruke fordelt på 5 dager, returnerer funksjonen 20-5
export const finnOverskuddAvMuligePermitteringsdager = (
    sisteDagIAktuellPeriode: Date,
    tidslinje: DatoMedKategori[],
    oversiktOverBrukteDagerIPeriode: OversiktOverBrukteOgGjenværendeDager,
    dagensDato: Date
) => {
    const ubrukteDagerIPeriode = finnGjenståendePermitteringsDager(
        oversiktOverBrukteDagerIPeriode
    );
    const dagerMellomDagensDatoOgSisteDagIAktuellPeriode = antalldagerGått(
        dagensDato,
        sisteDagIAktuellPeriode
    );
    return (
        ubrukteDagerIPeriode - dagerMellomDagensDatoOgSisteDagIAktuellPeriode
    );
};

export const finnPeriodeForÅBrukeGjenståendeDager = (
    tidslinje: DatoMedKategori[],
    tidligsteDatoAGP2: Date,
    dagensDato: Date
): InformasjonOmGjenståendeDagerOgPeriodeAGP2 | undefined => {
    const førstePermitteringInnenForTidligsteAGP2Periode = tidslinje.find(
        (datoMedKategori) =>
            datoMedKategori.kategori === 0 &&
            datoMedKategori.dato >= finnDato18MndTilbake(tidligsteDatoAGP2)
    );
    if (førstePermitteringInnenForTidligsteAGP2Periode === undefined) {
        return;
    }
    const sisteDagIAktuellPeriode = finnDato18MndFram(
        førstePermitteringInnenForTidligsteAGP2Periode.dato
    );
    let oversiktOverBrukteDagerIPeriode = finnOversiktOverBruktPermitteringIGittIntervall(
        sisteDagIAktuellPeriode,
        tidslinje
    );
    let overskuddAvPermitteringsdagerItidsintervall = finnOverskuddAvMuligePermitteringsdager(
        sisteDagIAktuellPeriode,
        tidslinje,
        oversiktOverBrukteDagerIPeriode,
        dagensDato
    );
    while (overskuddAvPermitteringsdagerItidsintervall > 0) {
        sisteDagIAktuellPeriode.setDate(
            sisteDagIAktuellPeriode.getDate() +
                overskuddAvPermitteringsdagerItidsintervall
        );
        let oversiktOverBrukteDagerIPeriode = finnOversiktOverBruktPermitteringIGittIntervall(
            sisteDagIAktuellPeriode,
            tidslinje
        );
        overskuddAvPermitteringsdagerItidsintervall = finnOverskuddAvMuligePermitteringsdager(
            sisteDagIAktuellPeriode,
            tidslinje,
            oversiktOverBrukteDagerIPeriode,
            dagensDato
        );
        console.log(
            'brukte dager: ' +
                oversiktOverBrukteDagerIPeriode.dagerPermittert +
                ' ',
            'overskudd permitteringsdager: ' +
                overskuddAvPermitteringsdagerItidsintervall,
            sisteDagIAktuellPeriode
        );
    }
    return {
        sluttDato: sisteDagIAktuellPeriode,
        gjenståendePermitteringsDager: finnGjenståendePermitteringsDager(
            oversiktOverBrukteDagerIPeriode
        ),
    };
};

//AGP2FUNKSJONER SLUTT

export const finnOversiktOverBruktPermitteringIGittIntervall = (
    sisteDatoIAktuellPeriode: Date,
    tidslinje: DatoMedKategori[]
) => {
    let permittert = 0;
    let antallDagerFravær = 0;
    let gjenståendeDager = 0;
    tidslinje.forEach((dag) => {
        if (
            dag.dato >= finnDato18MndTilbake(sisteDatoIAktuellPeriode) &&
            dag.dato <= sisteDatoIAktuellPeriode
        ) {
            if (dag.kategori === 0) {
                permittert++;
            }
            if (dag.kategori === 1) {
                gjenståendeDager++;
            }
            if (dag.kategori === 2) {
                antallDagerFravær++;
            }
        }
    });
    const oversikt: OversiktOverBrukteOgGjenværendeDager = {
        dagerPermittert: permittert,
        dagerGjensående: gjenståendeDager,
        dagerAnnetFravær: antallDagerFravær,
    };
    console.log(
        oversikt.dagerPermittert +
            ' dager permittert fra ' +
            skrivOmDato(finnDato18MndTilbake(sisteDatoIAktuellPeriode)) +
            '-' +
            skrivOmDato(sisteDatoIAktuellPeriode)
    );
    return oversikt;
};

export const inngårIPermitteringsperiode = (
    permitteringsintervall: DatoIntervall,
    fraværsintervall: DatoIntervall
) => {
    if (
        datoIntervallErDefinert(permitteringsintervall) &&
        datoIntervallErDefinert(fraværsintervall)
    ) {
        const helefraVærsperiodenInngår =
            fraværsintervall.datoFra!! >= permitteringsintervall.datoFra!! &&
            fraværsintervall.datoTil!! <= permitteringsintervall.datoTil!!;

        const fraværIHelePerioden =
            fraværsintervall.datoFra!! <= permitteringsintervall.datoFra!! &&
            fraværsintervall.datoTil!! >= permitteringsintervall.datoTil!!;

        const sisteDelInngår =
            fraværsintervall.datoFra!! >= permitteringsintervall.datoFra!! &&
            fraværsintervall.datoFra!! <= permitteringsintervall.datoTil!!;

        const førsteDelInngår =
            fraværsintervall.datoFra!! <= permitteringsintervall.datoFra!! &&
            fraværsintervall.datoTil!! >= permitteringsintervall.datoFra!!;

        switch (true) {
            case helefraVærsperiodenInngår:
                return antalldagerGått(
                    fraværsintervall.datoFra!!,
                    fraværsintervall.datoTil
                );
            case fraværIHelePerioden:
                return antalldagerGått(
                    permitteringsintervall.datoFra!!,
                    permitteringsintervall.datoTil
                );
            case sisteDelInngår:
                return antalldagerGått(
                    fraværsintervall.datoFra!!,
                    permitteringsintervall.datoTil
                );
            case førsteDelInngår:
                return antalldagerGått(
                    permitteringsintervall.datoFra!!,
                    fraværsintervall.datoTil
                );
            default:
                return 0;
        }
    }
    return 0;
};

//denne er bra
export const summerFraværsdagerIPermitteringsperiode = (
    permitteringsperiode: DatoIntervall,
    fraværsperioder: DatoIntervall[]
) => {
    let antallFraværsdagerIPeriode = 0;
    fraværsperioder.forEach(
        (periode) =>
            (antallFraværsdagerIPeriode += inngårIPermitteringsperiode(
                permitteringsperiode,
                periode
            ))
    );
    return antallFraværsdagerIPeriode;
};

export const finnUtOmDefinnesOverlappendePerioder = (
    perioder: DatoIntervall[]
) => {
    let finnesOverLapp = false;
    perioder.forEach((periode) => {
        if (datoIntervallErDefinert(periode)) {
            perioder.forEach((periode2) => {
                if (datoIntervallErDefinert(periode2) && periode !== periode2) {
                    if (inngårIPermitteringsperiode(periode, periode2) > 0) {
                        finnesOverLapp = true;
                    }
                }
            });
        }
    });
    return finnesOverLapp;
};

export const kuttAvDatoIntervallFørGittDato = (
    gittDato: Date,
    tidsIntervall: DatoIntervall
) => {
    const nyttDatoIntervall: DatoIntervall = {
        datoFra: tidsIntervall.datoFra,
        datoTil: tidsIntervall.datoTil,
    };
    // @ts-ignore
    if (
        datoIntervallErDefinert(tidsIntervall) &&
        tidsIntervall.datoFra!! < gittDato
    ) {
        // @ts-ignore
        if (tidsIntervall.datoTil >= gittDato) {
            nyttDatoIntervall.datoFra = gittDato;
        } else {
            nyttDatoIntervall.datoFra = undefined;
            nyttDatoIntervall.datoTil = undefined;
        }
    }
    return nyttDatoIntervall;
};

export const kuttAvDatoIntervallEtterGittDato = (
    gittDato: Date,
    tidsIntervall: DatoIntervall
) => {
    const nyttDatoIntervall: DatoIntervall = {
        datoFra: tidsIntervall.datoFra,
        datoTil: tidsIntervall.datoTil,
    };
    // @ts-ignore
    if (tidsIntervall.datoTil > gittDato) {
        // @ts-ignore
        if (tidsIntervall.datoFra >= gittDato) {
            nyttDatoIntervall.datoFra = undefined;
            nyttDatoIntervall.datoTil = undefined;
        } else {
            nyttDatoIntervall.datoTil = gittDato;
        }
    }
    return nyttDatoIntervall;
};

export const kuttAvDatoIntervallInnenfor18mndHeleListen = (
    sluttDatoPeriode: Date,
    allePermitteringerOgFraværsperioder: AllePermitteringerOgFraværesPerioder
) => {
    const avkuttet18mndPerioder: AllePermitteringerOgFraværesPerioder = {
        andreFraværsperioder:
            allePermitteringerOgFraværsperioder.andreFraværsperioder,
        permitteringer: [],
    };
    allePermitteringerOgFraværsperioder.permitteringer.forEach((periode) => {
        const kuttetDatoIntervall: DatoIntervall = kuttAvDatoIntervallInnefor18mnd(
            periode,
            finnDato18MndTilbake(sluttDatoPeriode),
            sluttDatoPeriode
        );
        avkuttet18mndPerioder.permitteringer.push(kuttetDatoIntervall);
    });
    return avkuttet18mndPerioder;
};

export const kuttAvDatoIntervallInnefor18mnd = (
    datoIntevall: DatoIntervall,
    startdato: Date,
    sluttDato: Date
) => {
    const datoIntervallEtterStartperiode = kuttAvDatoIntervallFørGittDato(
        startdato,
        datoIntevall
    );
    return kuttAvDatoIntervallEtterGittDato(
        sluttDato,
        datoIntervallEtterStartperiode
    );
};

export const finnDato18MndTilbake = (dato: Date) => {
    let nyDato = new Date(dato);
    nyDato.setFullYear(dato.getFullYear() - 2);
    nyDato.setMonth(dato.getMonth() + 6);
    nyDato.setDate(dato.getDate() + 1);
    if (nyDato.getDate() < dato.getDate()) {
        const førsteDatoINyMåned = new Date(nyDato);
        førsteDatoINyMåned.setDate(1);
        nyDato = førsteDatoINyMåned;
    }
    return nyDato;
};

export const finnGrenserFor18MNDPeriode = (dagensDato: Date): DatoIntervall => {
    const bakover18mnd = finnDato18MndTilbake(dagensDato);
    const maksGrenseIBakoverITid = new Date(bakover18mnd);
    maksGrenseIBakoverITid.setDate(maksGrenseIBakoverITid.getDate() - 56);
    const maksGrenseFramoverITid = new Date(dagensDato);
    maksGrenseFramoverITid.setDate(maksGrenseFramoverITid.getDate() + 168);

    const intervall: DatoIntervall = {
        datoFra: maksGrenseIBakoverITid,
        datoTil: maksGrenseFramoverITid,
    };
    return intervall;
};

export const getDefaultPermitteringsperiode = (
    dagensDato: Date
): DatoIntervall => ({
    datoFra: finnDato18MndTilbake(dagensDato),
    datoTil: undefined,
});

export const finnDato18MndFram = (dato: Date) => {
    let nyDato = new Date(dato);
    nyDato.setFullYear(dato.getFullYear() + 1);
    nyDato.setMonth(dato.getMonth() + 6);
    nyDato.setDate(dato.getDate() - 1);
    if (nyDato.getDate() + 1 < dato.getDate()) {
        const førsteDatoINyMåned = new Date(nyDato);
        førsteDatoINyMåned.setDate(1);
        nyDato = finn1DagTilbake(førsteDatoINyMåned)!!;
    }
    return nyDato;
};

export const finnTidligsteDato = (datointervall: DatoIntervall[]) => {
    let tidligsteDato = datointervall[0].datoFra!!;
    datointervall.forEach((datoIntervall) => {
        if (datoIntervall.datoFra) {
            if (!tidligsteDato) {
                tidligsteDato = datoIntervall.datoFra;
            }
            if (tidligsteDato > datoIntervall.datoFra) {
                tidligsteDato = datoIntervall.datoFra;
            }
        }
    });
    return tidligsteDato;
};

export const finnSisteDato = (
    datointervall: DatoIntervall[]
): Date | undefined => {
    let sisteDato = datointervall[0].datoTil;
    datointervall.forEach((intervall) => {
        if (intervall.datoTil) {
            if (!sisteDato) {
                sisteDato = intervall.datoTil;
            }
            if (sisteDato < intervall.datoTil) {
                sisteDato = intervall.datoTil;
            }
        }
    });
    return sisteDato;
};

export const datoIntervallErDefinert = (datoIntervall: DatoIntervall) => {
    return (
        datoIntervall.datoFra !== undefined &&
        datoIntervall.datoTil !== undefined
    );
};

export const datoErIEnkeltIntervall = (
    dato: Date,
    intervall: DatoIntervall
) => {
    return dato >= intervall.datoFra!! && dato <= intervall.datoTil!!;
};

export const konstruerStatiskTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder,
    dagensDato: Date
) => {
    const listeMedTidslinjeObjekter: DatoMedKategori[] = [];
    const antallObjektITidslinje = antalldagerGått(
        finnGrenserFor18MNDPeriode(dagensDato).datoFra,
        finnGrenserFor18MNDPeriode(dagensDato).datoTil
    );
    const startDato = finnGrenserFor18MNDPeriode(dagensDato).datoFra;
    listeMedTidslinjeObjekter.push(
        finneKategori(startDato!!, allePermitteringerOgFravær)
    );
    for (let dag = 1; dag < antallObjektITidslinje; dag++) {
        const nesteDag = finn1DagFram(listeMedTidslinjeObjekter[dag - 1].dato);
        listeMedTidslinjeObjekter.push(
            finneKategori(nesteDag, allePermitteringerOgFravær)
        );
    }
    return listeMedTidslinjeObjekter;
};

const finnesIIntervaller = (dato: Date, perioder: DatoIntervall[]) => {
    let finnes = false;
    perioder.forEach((periode) => {
        if (
            datoIntervallErDefinert(periode) &&
            datoErIEnkeltIntervall(dato, periode)
        ) {
            finnes = true;
        }
    });
    return finnes;
};

const finneKategori = (
    dato: Date,
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
): DatoMedKategori => {
    const erFraVærsDato = finnesIIntervaller(
        dato,
        allePermitteringerOgFraværesPerioder.andreFraværsperioder
    );
    const erPermittert = finnesIIntervaller(
        dato,
        allePermitteringerOgFraværesPerioder.permitteringer
    );
    if (erFraVærsDato && erPermittert) {
        return {
            kategori: 2,
            dato: dato,
        };
    }
    if (erPermittert) {
        return {
            kategori: 0,
            dato: dato,
        };
    }
    return {
        kategori: 1,
        dato: dato,
    };
};

export const flytt18mndsperiode1dag = (
    tidligereStartDato: Date,
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder
) => {
    const nyStartDag = finn1DagFram(tidligereStartDato);
    const sluttDato = finnDato18MndFram(nyStartDag);
    allePermitteringerOgFravær.permitteringer.forEach((periode, indeks) => {
        const kuttetTidsintervall = kuttAvDatoIntervallInnefor18mnd(
            periode,
            nyStartDag,
            sluttDato
        );
        allePermitteringerOgFravær.permitteringer[indeks] = kuttetTidsintervall;
    });
    return allePermitteringerOgFravær;
};

const skrivut = (intervall: DatoIntervall) => {
    console.log(skrivOmDato(intervall.datoFra), skrivOmDato(intervall.datoTil));
};

export const finn1DagFram = (dato: Date) => {
    const enDagFram = new Date(dato);
    enDagFram.setDate(enDagFram.getDate() + 1);
    return enDagFram;
};

export const finn1DagTilbake = (dato?: Date) => {
    if (dato) {
        const enDagTilbake = new Date(dato);
        enDagTilbake.setDate(enDagTilbake.getDate() - 1);
        return enDagTilbake;
    }
    return undefined;
};
