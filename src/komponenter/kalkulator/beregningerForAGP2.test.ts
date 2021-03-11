import { AllePermitteringerOgFraværesPerioder } from './typer';
import { konstruerStatiskTidslinje } from './utregninger';
import dayjs from 'dayjs';
import { finnInformasjonAGP2 } from './beregningerForAGP2';

test('dato for AGP2 er 1. juni når permitteringen er nøyaktig 30 uker', () => {
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
