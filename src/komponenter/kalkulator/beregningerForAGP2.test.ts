import { AllePermitteringerOgFraværesPerioder } from './typer';
import { konstruerStatiskTidslinje } from './utregninger';
import dayjs from 'dayjs';
import { finnInformasjonAGP2 } from './beregningerForAGP2';

test('dato for AGP2-grense', () => {
    const tidligsteDatoAgp2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: new Date('2019-11-13'),
                datoTil: new Date('2020-06-29'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerStatiskTidslinje(
        allePermitteringerOgFravær,
        dagensDato.toDate()
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        tidligsteDatoAgp2,
        false,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.sluttDato).toEqual(tidligsteDatoAgp2.toDate());
    expect(informasjonOmAGP2.brukteDager).toBe(210);
});

test('relevant 18-mnds periode begynnter ved andre permitteringsperiode', () => {
    const tidligsteDatoAgp2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: new Date('2019-11-20'),
                datoTil: new Date('2020-01-06'),
            },
            {
                datoFra: new Date('2020-04-21'),
                datoTil: new Date('2020-06-01'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerStatiskTidslinje(
        allePermitteringerOgFravær,
        dagensDato.toDate()
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        tidligsteDatoAgp2,
        false,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.sluttDato).toEqual(new Date('2021-10-21'));
    expect(informasjonOmAGP2.brukteDager).toBe(41);
});

test('skal returnere at man kan ha løpende permittering til 10. november', () => {
    const tidligsteDatoAgp2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: new Date('2021-04-14'),
                datoTil: new Date('2021-06-01'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerStatiskTidslinje(
        allePermitteringerOgFravær,
        dagensDato.toDate()
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        tidligsteDatoAgp2,
        true,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.sluttDato).toEqual(new Date('2021-11-10'));
});

test('skal ignorere permittering i begynnelsen av 18 mndsperiode som sklir ut ved telling av løpende permittering', () => {
    const tidligsteDatoAgp2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: new Date('2021-02-16'),
                datoTil: new Date('2021-06-01'),
            },
            {
                datoFra: new Date('2019-11-20'),
                datoTil: new Date('2020-02-13'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerStatiskTidslinje(
        allePermitteringerOgFravær,
        dagensDato.toDate()
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        tidligsteDatoAgp2,
        true,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.sluttDato).toEqual(new Date('2021-09-14'));
});
