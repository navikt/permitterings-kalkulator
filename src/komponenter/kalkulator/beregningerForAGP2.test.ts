import { AllePermitteringerOgFraværesPerioder } from './typer';
import {
    antallDagerGått,
    finnDato18MndTilbake,
    konstruerStatiskTidslinje,
} from './utregninger';
import dayjs from 'dayjs';
import { finnInformasjonAGP2 } from './beregningerForAGP2';
import { configureDayJS } from '../../dayjs-config';

configureDayJS();

test('dato for AGP2-grense', () => {
    const tidligsteDatoAgp2 = dayjs('2021-06-01');
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
    const tidslinje = konstruerStatiskTidslinje(
        allePermitteringerOgFravær,
        dagensDato
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        tidligsteDatoAgp2,
        false,
        dagensDato,
        210
    );
    const antallDagerIPermitteringsperiode = antallDagerGått(
        dayjs('2019-12-02'),
        dayjs('2020-06-29')
    );
    expect(informasjonOmAGP2.sluttDato).toEqual(tidligsteDatoAgp2);
    expect(informasjonOmAGP2.brukteDager).toBe(
        antallDagerIPermitteringsperiode
    );
});

test('relevant 18-mnds periode begynner ved andre permitteringsperiode', () => {
    const tidligsteDatoAgp2 = dayjs('2021-06-01');
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
    const tidslinje = konstruerStatiskTidslinje(
        allePermitteringerOgFravær,
        dagensDato
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        tidligsteDatoAgp2,
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
    expect(informasjonOmAGP2.brukteDager).toBe(
        antallDagerIAndrePermitteringsperiode
    );
});

test('skal returnere at man kan ha løpende permittering til 10. november', () => {
    const tidligsteDatoAgp2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: dayjs('2021-04-14'),
                datoTil: dayjs('2021-06-01'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerStatiskTidslinje(
        allePermitteringerOgFravær,
        dagensDato
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        tidligsteDatoAgp2,
        true,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.sluttDato).toEqual(dayjs('2021-11-10'));
});

test('skal ignorere permittering i begynnelsen av 18 mndsperiode som sklir ut ved telling av løpende permittering', () => {
    const tidligsteDatoAgp2 = dayjs('2021-06-01');
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [
            {
                datoFra: dayjs('2021-02-16'),
                datoTil: dayjs('2021-06-01'),
            },
            {
                datoFra: dayjs('2019-11-20'),
                datoTil: dayjs('2020-02-13'),
            },
        ],
        andreFraværsperioder: [],
    };
    const dagensDato = dayjs('2021-03-11');
    const tidslinje = konstruerStatiskTidslinje(
        allePermitteringerOgFravær,
        dagensDato
    );
    const informasjonOmAGP2 = finnInformasjonAGP2(
        tidslinje,
        tidligsteDatoAgp2,
        true,
        dagensDato,
        210
    );
    expect(informasjonOmAGP2.sluttDato).toEqual(dayjs('2021-09-14'));
});
