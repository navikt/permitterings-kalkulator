import dayjs, { Dayjs } from 'dayjs';

export enum datointervallKategori {
    PERMITTERT,
    ARBEIDER,
    ANNETFRAVÆR,
}

export interface AllePermitteringerOgFraværesPerioder {
    permitteringer: DatoIntervall[];
    andreFraværsperioder: DatoIntervall[];
}

export interface AllePermitteringerOgFraværesPerioderDayjs {
    permitteringer: DatoIntervallDayjs[];
    andreFraværsperioder: DatoIntervallDayjs[];
}

export const tilAllePermitteringerOgFraværesPerioder = (
    perioder: AllePermitteringerOgFraværesPerioderDayjs
): AllePermitteringerOgFraværesPerioder => ({
    permitteringer: perioder.permitteringer.map((periode) =>
        tilDatoIntervall(periode)
    ),
    andreFraværsperioder: perioder.andreFraværsperioder.map((periode) =>
        tilDatoIntervall(periode)
    ),
});

export const tilAllePermitteringerOgFraværesPerioderDayjs = (
    perioder: AllePermitteringerOgFraværesPerioder
): AllePermitteringerOgFraværesPerioderDayjs => ({
    permitteringer: perioder.permitteringer.map((periode) =>
        tilDatoIntervallDayjs(periode)
    ),
    andreFraværsperioder: perioder.andreFraværsperioder.map((periode) =>
        tilDatoIntervallDayjs(periode)
    ),
});

export interface DatoIntervall {
    datoFra: Date | undefined;
    datoTil: Date | undefined;
    erLøpende?: boolean;
}
export interface DatoIntervallDayjs {
    datoFra: Dayjs | undefined;
    datoTil: Dayjs | undefined;
    erLøpende?: boolean;
}

export const tilDatoIntervall = (
    intervall: DatoIntervallDayjs
): DatoIntervall => ({
    datoFra: intervall.datoFra ? intervall.datoFra.toDate() : undefined,
    datoTil: intervall.datoTil ? intervall.datoTil.toDate() : undefined,
    erLøpende: intervall.erLøpende,
});

export const tilDatoIntervallDayjs = (
    intervall: DatoIntervall
): DatoIntervallDayjs => ({
    datoFra: intervall.datoFra ? dayjs(intervall.datoFra) : undefined,
    datoTil: intervall.datoTil ? dayjs(intervall.datoTil) : undefined,
    erLøpende: intervall.erLøpende,
});

export interface DatoMedKategori {
    dato: Date;
    kategori: datointervallKategori;
}

export interface DatoMedKategoriDayjs {
    dato: Dayjs;
    kategori: datointervallKategori;
}

export interface OversiktOverBrukteOgGjenværendeDager {
    dagerPermittert: number;
    dagerAnnetFravær: number;
    dagerGjensående: number;
}
