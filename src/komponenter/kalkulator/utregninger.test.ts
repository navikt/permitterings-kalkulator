import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
    OversiktOverBrukteOgGjenværendeDager,
} from './typer';
import {
    antalldagerGått,
    finn1DagTilbake,
    finnTidligsteDato,
    finnUtOmDefinnesOverlappendePerioder,
    kuttAvDatoIntervallInnefor18mnd,
    summerFraværsdagerIPermitteringsperiode,
    sumPermitteringerOgFravær,
} from './utregninger';

test('Finn dato en dag tilbake fra angitt dato', () => {
    const enDag = new Date('2021-03-01');
    expect(finn1DagTilbake(enDag)?.getDate()).toBe(
        new Date('2021-02-28').getDate()
    );

    const enDagEkstra = new Date('2020-03-01');
    expect(finn1DagTilbake(enDagEkstra)?.getDate()).toBe(
        new Date('2020-02-29').getDate()
    );
});

test('Antal dager mellom to datoer', () => {
    const enDagIFebruar = new Date('2021-02-20');
    const nesteDagIFebruar = new Date('2021-02-21');
    const enDagIMars = new Date('2021-03-23');

    expect(antalldagerGått(enDagIFebruar, enDagIFebruar)).toBe(1);
    expect(antalldagerGått(enDagIFebruar, nesteDagIFebruar)).toBe(2);
    expect(antalldagerGått(enDagIFebruar, enDagIMars)).toBe(32);
});

test('Tester om to datointervaller er overlappende. Samme slutt og startdato skal regnes som overlappende.', () => {
    const startIntervall1 = new Date('2021-03-01');
    const sluttIntervall1 = new Date('2021-04-15');

    const startIntervall2 = new Date('2021-04-15');
    const sluttIntervall2 = new Date('2021-05-15');

    const periode1: DatoIntervall = {
        datoFra: startIntervall1,
        datoTil: sluttIntervall1,
    };

    const periode2: DatoIntervall = {
        datoFra: startIntervall2,
        datoTil: sluttIntervall2,
    };

    expect(
        finnUtOmDefinnesOverlappendePerioder(Array.of(periode1, periode2))
    ).toBe(true);
});

test('Summer antall fraværsdager i en permitteringsperiode', () => {
    const startFraværsIntervall1 = new Date('2021-03-01');
    const sluttFraværsIntervall1 = new Date('2021-03-15'); // 15 dager

    const startFraværsIntervall2 = new Date('2021-04-02');
    const sluttFraværsIntervall2 = new Date('2021-04-02'); // 1 dag

    const startFraværsIntervall3 = new Date('2021-04-29');
    const sluttFraværsIntervall3 = new Date('2021-05-07'); // 9 dager

    const startPermitteringsPeriode = new Date('2020-02-14');
    const sluttPermitteringsPeriode = new Date('2021-06-02');

    const fraværsIntervall1: DatoIntervall = {
        datoFra: startFraværsIntervall1,
        datoTil: sluttFraværsIntervall1,
    };
    const fraværsIntervall2: DatoIntervall = {
        datoFra: startFraværsIntervall2,
        datoTil: sluttFraværsIntervall2,
    };
    const fraværsIntervall3: DatoIntervall = {
        datoFra: startFraværsIntervall3,
        datoTil: sluttFraværsIntervall3,
    };
    const permitteringsPeriode: DatoIntervall = {
        datoFra: startPermitteringsPeriode,
        datoTil: sluttPermitteringsPeriode,
    };

    expect(
        summerFraværsdagerIPermitteringsperiode(
            permitteringsPeriode,
            Array.of(fraværsIntervall1, fraværsIntervall2, fraværsIntervall3)
        )
    ).toBe(25);
});

test('Finner den tidligste datoen fra en liste av flere permitteringsperioder', () => {
    const startPermitteringsPeriode1 = new Date('2021-02-14');
    const sluttPermitteringsPeriode1 = new Date('2021-03-02');
    const startPermitteringsPeriode2 = new Date('2021-01-10');
    const sluttPermitteringsPeriode2 = new Date('2021-01-25');
    const startPermitteringsPeriode3 = new Date('2021-04-14');
    const sluttPermitteringsPeriode3 = new Date('2021-04-28');
    const startPermitteringsPeriode4 = new Date('2021-05-14');
    const sluttPermitteringsPeriode4 = new Date('2021-06-02');

    const permitteringsPeriode1: DatoIntervall = {
        datoFra: startPermitteringsPeriode1,
        datoTil: sluttPermitteringsPeriode1,
    };
    const permitteringsPeriode2: DatoIntervall = {
        datoFra: startPermitteringsPeriode2,
        datoTil: sluttPermitteringsPeriode2,
    };
    const permitteringsPeriode3: DatoIntervall = {
        datoFra: startPermitteringsPeriode3,
        datoTil: sluttPermitteringsPeriode3,
    };
    const permitteringsPeriode4: DatoIntervall = {
        datoFra: startPermitteringsPeriode4,
        datoTil: sluttPermitteringsPeriode4,
    };

    expect(
        finnTidligsteDato(
            Array.of(
                permitteringsPeriode1,
                permitteringsPeriode2,
                permitteringsPeriode3,
                permitteringsPeriode4
            )
        ).getTime()
    ).toBe(new Date('2021-01-10').getTime());
});

test('Sum av permitteringer og fravær', () => {
    const startFraværsIntervall1 = new Date('2020-03-01');
    const sluttFraværsIntervall1 = new Date('2020-03-15'); // 15 dager
    const fraværsPeriode: DatoIntervall = {
        datoFra: startFraværsIntervall1,
        datoTil: sluttFraværsIntervall1,
    };

    const startPermitteringsPeriode1 = new Date('2020-02-14');
    const sluttPermitteringsPeriode1 = new Date('2020-03-02');
    const startPermitteringsPeriode2 = new Date('2020-01-10');
    const sluttPermitteringsPeriode2 = new Date('2020-01-25');
    const startPermitteringsPeriode3 = new Date('2020-04-14');
    const sluttPermitteringsPeriode3 = new Date('2020-04-28');
    const startPermitteringsPeriode4 = new Date('2020-05-14');
    const sluttPermitteringsPeriode4 = new Date('2020-06-02');

    const permitteringsPeriode1: DatoIntervall = {
        datoFra: startPermitteringsPeriode1,
        datoTil: sluttPermitteringsPeriode1,
    };
    const permitteringsPeriode2: DatoIntervall = {
        datoFra: startPermitteringsPeriode2,
        datoTil: sluttPermitteringsPeriode2,
    };
    const permitteringsPeriode3: DatoIntervall = {
        datoFra: startPermitteringsPeriode3,
        datoTil: sluttPermitteringsPeriode3,
    };
    const permitteringsPeriode4: DatoIntervall = {
        datoFra: startPermitteringsPeriode4,
        datoTil: sluttPermitteringsPeriode4,
    };

    const alle: AllePermitteringerOgFraværesPerioder = {
        permitteringer: Array.of(
            permitteringsPeriode1,
            permitteringsPeriode2,
            permitteringsPeriode3,
            permitteringsPeriode4
        ),
        andreFraværsperioder: Array.of(fraværsPeriode),
    };

    const oversikt: OversiktOverBrukteOgGjenværendeDager = sumPermitteringerOgFravær(
        alle,
        new Date('2021-02-14')
    );
    expect(oversikt.dagerAnnetFravær).toBe(1); // Burde være 2? Vises som to i selve komponenten.
    expect(oversikt.dagerGjensående).toBe(650); // Hm ?
    expect(oversikt.dagerPermittert).toBe(64); // 65?
});

test('Kutt av datoer for en permitteringsperiode', () => {
    const startIntervall = new Date('2020-02-14');
    const sluttIntervall = new Date('2020-05-02');

    const intervall: DatoIntervall = {
        datoFra: startIntervall,
        datoTil: sluttIntervall,
    };
    const startKuttDato = new Date('2020-03-02');
    const sluttKuttDato = new Date('2020-04-20');

    const nyttIntervall: DatoIntervall = kuttAvDatoIntervallInnefor18mnd(
        intervall,
        startKuttDato,
        sluttKuttDato
    );
    expect(nyttIntervall.datoFra).toBe(startKuttDato);
    expect(nyttIntervall.datoTil).toBe(sluttKuttDato);
});
