import { AllePermitteringerOgFraværesPerioder, DatoIntervall } from '../typer';

export const permitteringsDatoTrefferAGP2Tidsligtst = () => {
    const allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder = {
        permitteringer: [],
        andreFraværsperioder: [],
    };
    const permitteringsPeriode: DatoIntervall = {
        datoFra: new Date('2019-11-13'),
        datoTil: new Date('2020-06-29'),
    };
};
