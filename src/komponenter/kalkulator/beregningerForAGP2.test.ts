import { AllePermitteringerOgFraværesPerioder } from './typer';
import {
    antallDagerGått,
    finnDato18MndTilbake,
    finnInitialgrenserForTidslinjedatoer,
    konstruerTidslinje,
    regnUtHvaSisteDatoPåTidslinjenSkalVære,
} from './utregninger';
import dayjs from 'dayjs';
import {
    finnBruktePermitteringsDager,
    finnInformasjonAGP2,
} from './beregningerForAGP2';
import { configureDayJS } from '../../dayjs-config';

configureDayJS();

test('dato for AGP2-grense', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: dayjs('2019-12-02'),
                datoTil: dayjs('2020-06-29'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil!
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        false,
        dagensDato,
        210
    );
    const antallDagerIPermitteringsperiode = antallDagerGått(
        dayjs('2019-12-02'),
        dayjs('2020-06-29')
    );
    expect(informasjonOmAGP2.sluttDato).toEqual(innføringsdatoAGP2);
    expect(informasjonOmAGP2.brukteDagerVedInnføringsdato).toBe(
        antallDagerIPermitteringsperiode
    );
});

test('relevant 18-mnds periode begynner ved andre permitteringsperiode', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: dayjs('2019-11-20'),
                datoTil: dayjs('2020-01-30'),
            },
            {
                datoFra: dayjs('2020-04-21'),
                datoTil: dayjs('2020-06-01'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil!
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        false,
        dagensDato,
        210
    );
    expect(finnDato18MndTilbake(informasjonOmAGP2.sluttDato!)).toEqual(
        dayjs('2020-04-21')
    );
    const antallDagerIAndrePermitteringsperiode = antallDagerGått(
        dayjs('2020-04-21'),
        dayjs('2020-06-01')
    );
    const vertifikasjonAvAntallDagerPermittertVedInnføringsDato =
        antallDagerGått(
            finnDato18MndTilbake(innføringsdatoAGP2),
            allePermitteringerOgFravær.permitteringer[0].datoTil
        ) +
        antallDagerGått(
            allePermitteringerOgFravær.permitteringer[1].datoFra,
            allePermitteringerOgFravær.permitteringer[1].datoTil
        );
    const brukteDagerI18mndsIntervall = finnBruktePermitteringsDager(
        tidslinje,
        informasjonOmAGP2.sluttDato!
    );

    expect(informasjonOmAGP2.permitteringsdagerVedInnføringsdato).toBe(
        vertifikasjonAvAntallDagerPermittertVedInnføringsDato
    );
    expect(brukteDagerI18mndsIntervall).toBe(
        antallDagerIAndrePermitteringsperiode
    );
    const overskuddAvPermitteringsDagerVedInnføringsDato =
        210 - informasjonOmAGP2.brukteDagerVedInnføringsdato;
    const forMangeLedigePermitteringsdagerIFTGjenståendeDagerI18mndsIntervall =
        overskuddAvPermitteringsDagerVedInnføringsDato >
        antallDagerGått(dagensDato, innføringsdatoAGP2);
    expect(
        forMangeLedigePermitteringsdagerIFTGjenståendeDagerI18mndsIntervall
    ).toBe(true);
});

test('skal returnere at man kan ha løpende permittering til 10. november', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: dayjs('2021-04-14'),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        regnUtHvaSisteDatoPåTidslinjenSkalVære(
            allePermitteringerOgFravær,
            dagensDato
        )!
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        true,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.sluttDato).toEqual(dayjs('2021-11-10'));
});

test('skal ignorere permittering i begynnelsen av 18 mndsperiode som sklir ut ved telling av løpende permittering', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: dayjs('2021-02-16'),
                erLøpende: true,
            },
            {
                datoFra: dayjs('2019-11-20'),
                datoTil: dayjs('2020-02-13'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        regnUtHvaSisteDatoPåTidslinjenSkalVære(
            allePermitteringerOgFravær,
            dagensDato
        )!
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        true,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.sluttDato).toEqual(dayjs('2021-09-14'));
});

test('skal håndtere løpende permittering etter innføringsdato', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: dayjs('2021-07-01'),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        regnUtHvaSisteDatoPåTidslinjenSkalVære(
            allePermitteringerOgFravær,
            dagensDato
        )!
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        true,
        dagensDato,
        210
    );

    expect(informasjonOmAGP2.sluttDato).toEqual(
        dayjs('2021-07-01').add(210, 'days')
    );
});

test('skal håndtere lang permitteringsperiode etter innføringsdato', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: innføringsdatoAGP2.add(1, 'month'),
                datoTil: innføringsdatoAGP2.add(11, 'months'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        regnUtHvaSisteDatoPåTidslinjenSkalVære(
            allePermitteringerOgFravær,
            dagensDato
        )!
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        true,
        dagensDato,
        210
    );

    expect(informasjonOmAGP2.sluttDato).toEqual(
        innføringsdatoAGP2.add(1, 'month').add(210, 'days')
    );
});

test('brukteDager skal telle riktig antall permitteringsdager ved innføringsdato', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const permitteringsstart = dayjs('2021-03-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: permitteringsstart,
                datoTil: permitteringsstart.add(50, 'days'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = innføringsdatoAGP2.subtract(10, 'days');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil!
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        true,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.brukteDagerVedInnføringsdato).toEqual(51);
});

test('brukteDager skal trekke fra fraværsdager under permittering', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const permitteringsstart = dayjs('2021-03-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: permitteringsstart,
                datoTil: permitteringsstart.add(50, 'days'),
            },
        ],
        andreFraværsperioder: [
            {
                datoFra: permitteringsstart.add(5, 'days'),
                datoTil: permitteringsstart.add(25, 'days'),
            },
        ],
    };
    const dagensDato = innføringsdatoAGP2.subtract(10, 'days');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil!
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        true,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.brukteDagerVedInnføringsdato).toEqual(30);
});

test('brukteDager skal bare telle med fraværsdager som overlapper med permittering', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const permitteringsstart = dayjs('2020-07-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: permitteringsstart,
                datoTil: permitteringsstart.add(50, 'days'),
            },
        ],
        andreFraværsperioder: [
            {
                datoFra: permitteringsstart.add(20, 'days'),
                datoTil: permitteringsstart.add(70, 'days'),
            },
        ],
    };
    const dagensDato = innføringsdatoAGP2.subtract(10, 'days');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil!
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        true,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.brukteDagerVedInnføringsdato).toEqual(20);
});

test('brukteDager skal bare telle permitteringsdager i 18mndsperioden før innføringsdato', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const start18mndsperiode = finnDato18MndTilbake(innføringsdatoAGP2);
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: start18mndsperiode.subtract(20, 'days'),
                datoTil: start18mndsperiode.add(20, 'days'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = innføringsdatoAGP2.subtract(10, 'days');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        finnInitialgrenserForTidslinjedatoer(dagensDato).datoTil!
    );

    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        true,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.brukteDagerVedInnføringsdato).toEqual(21);
});

test('finnInformasjonAGP2 skal finne dato for AGP2 ved løpende permittering', () => {
    const innføringsdatoAGP2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: innføringsdatoAGP2.subtract(5, 'weeks'),
                erLøpende: true,
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = innføringsdatoAGP2.subtract(10, 'days');
    const tidslinje = konstruerTidslinje(
        allePermitteringerOgFravær,
        dagensDato,
        regnUtHvaSisteDatoPåTidslinjenSkalVære(
            allePermitteringerOgFravær,
            dagensDato
        )!
    );

    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        innføringsdatoAGP2,
        true,
        dagensDato,
        210
    );

    expect(informasjonOmAGP2.sluttDato).toEqual(
        innføringsdatoAGP2.add(25, 'weeks')
    );
});
