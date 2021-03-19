import { Dayjs } from 'dayjs';

export enum DatointervallKategori {
    PERMITTERT,
    ARBEIDER,
    FRAVÆR_PÅ_PERMITTERINGSDAG,
}

export interface AllePermitteringerOgFraværesPerioder {
    permitteringer: DatoIntervall[];
    andreFraværsperioder: DatoIntervall[];
}

export interface DatoIntervall {
    datoFra: Dayjs | undefined;
    datoTil: Dayjs | undefined;
    erLøpende?: boolean;
}

export interface DatoMedKategori {
    dato: Dayjs;
    kategori: DatointervallKategori;
}

export interface OversiktOverBrukteOgGjenværendeDager {
    dagerPermittert: number;
    dagerAnnetFravær: number;
    dagerGjenstående: number;
    dagerBrukt: number;
}
