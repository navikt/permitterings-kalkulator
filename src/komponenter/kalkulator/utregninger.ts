import {
    AllePermitteringerOgFraværesPerioder,
    ARBEIDSGIVERPERIODE2DATO,
    DatoIntervall,
    GRENSERFOR18MNDPERIODE,
} from './kalkulator';
import { skrivOmDato } from '../Datovelger/datofunksjoner';

export const antalldagerGått = (fra?: Date, til?: Date) => {
    if (fra && til) {
        const tilDato = til ? til : new Date();
        const msGatt = tilDato.getTime() - fra.getTime();
        const dagerGått = msGatt / (1000 * 60 * 60 * 24);
        return Math.ceil(dagerGått + 1);
    }
    return 0;
};

export const antallUkerRundetOpp = (antallDager: number) => {
    return Math.ceil(antallDager / 7);
};

export const datoErFørMars = (dato: Date) => {
    const førsteMars = new Date('2021-03-01');
    return dato.getTime() < førsteMars.getTime();
};

export interface OversiktOverBrukteOgGjenværendeDager {
    dagerPermittert: number;
    dagerAnnetFravær: number;
    dagerGjensående: number;
}

export const sumPermitteringerOgFravær = (
    allePErmitteringerOgFraværsperioder: AllePermitteringerOgFraværesPerioder,
    sisteDag: Date
): OversiktOverBrukteOgGjenværendeDager => {
    const statusAlleDager18mndLsite = konstruerStatiskTidslinje(
        allePErmitteringerOgFraværsperioder
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

//denne regner feil
export const regnUtDatoAGP2 = (dagerBrukt: number) => {
    const dagerIgjen = 210 - dagerBrukt;
    const dagenDato = new Date();
    const beregnetAGP2 = new Date(dagenDato);
    beregnetAGP2.setDate(beregnetAGP2.getDate() + dagerIgjen);
    if (dagerIgjen > 0) {
        return beregnetAGP2;
    }
    return ARBEIDSGIVERPERIODE2DATO;
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
            fraværsintervall.datoFra!! < permitteringsintervall.datoFra!! &&
            fraværsintervall.datoTil!! > permitteringsintervall.datoTil!!;

        const sisteDelInngår =
            fraværsintervall.datoFra!! > permitteringsintervall.datoFra!! &&
            fraværsintervall.datoFra!! < permitteringsintervall.datoTil!!;

        const førsteDelInngår =
            fraværsintervall.datoFra!! < permitteringsintervall.datoFra!! &&
            fraværsintervall.datoTil!! > permitteringsintervall.datoFra!!;

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
    skrivut(nyttDatoIntervall);
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
    let nyDato = new Date();
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

export const finnDato18MndFram = (dato: Date) => {
    let nyDato = new Date();
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

export enum datointervallKategori {
    PERMITTERT,
    ARBEIDER,
    ANNETFRAVÆR,
}

export interface DatoMedKategori {
    dato: Date;
    kategori: datointervallKategori;
}

export const datoErIEnkeltIntervall = (
    dato: Date,
    intervall: DatoIntervall
) => {
    return dato >= intervall.datoFra!! && dato <= intervall.datoTil!!;
};

export const testFunksjonAvTidslinje = (tidsLinje: DatoMedKategori[]) => {
    let bestårTest = true;
    tidsLinje.forEach((objekt, indeks) => {
        if (indeks > 0) {
            if (
                tidsLinje[indeks].dato.getDate() -
                    tidsLinje[indeks - 1].dato.getDate() !==
                1
            ) {
                if (tidsLinje[indeks].dato.getDate() !== 1) {
                    bestårTest = false;
                    console.log(
                        'datoer som feiler test kategorier',
                        tidsLinje[indeks].kategori,
                        tidsLinje[indeks - 1].kategori
                    );
                }
                if (
                    tidsLinje[indeks].dato.getMonth() -
                        tidsLinje[indeks - 1].dato.getMonth() !==
                        1 &&
                    tidsLinje[indeks].dato.getMonth() !== 0
                ) {
                    console.log(
                        'datoer som feiler test kategorier',
                        tidsLinje[indeks].kategori,
                        tidsLinje[indeks - 1].kategori,
                        skrivOmDato(tidsLinje[indeks].dato),
                        skrivOmDato(tidsLinje[indeks - 1].dato)
                    );
                    bestårTest = false;
                }
            }
        }
    });
    return bestårTest;
};

export const konstruerStatiskTidslinje = (
    allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder
) => {
    const listeMedTidslinjeObjekter: DatoMedKategori[] = [];
    const antallObjektITidslinje = antalldagerGått(
        GRENSERFOR18MNDPERIODE.datoFra,
        GRENSERFOR18MNDPERIODE.datoTil
    );
    const startDato = GRENSERFOR18MNDPERIODE.datoFra;
    listeMedTidslinjeObjekter.push(
        finneKategori(startDato!!, allePermitteringerOgFravær)
    );
    for (let dag = 1; dag < antallObjektITidslinje; dag++) {
        const nesteDag = finn1DagFram(listeMedTidslinjeObjekter[dag - 1].dato);
        listeMedTidslinjeObjekter.push(
            finneKategori(nesteDag, allePermitteringerOgFravær)
        );
    }
    console.log(testFunksjonAvTidslinje(listeMedTidslinjeObjekter));
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
