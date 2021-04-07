import { Dayjs } from 'dayjs';

export enum DatointervallKategori {
    PERMITTERT_UTEN_FRAVÆR,
    PERMITTERT_MED_FRAVÆR,
    IKKE_PERMITTERT,
}

export interface AllePermitteringerOgFraværesPerioder {
    permitteringer: Partial<DatoIntervall>[];
    andreFraværsperioder: Partial<DatoIntervall>[];
}

type FastDatoIntervall = {
    datoFra: Dayjs;
    datoTil: Dayjs;
    erLøpende?: false;
};

type LøpendeDatoIntervall = {
    datoFra: Dayjs;
    datoTil?: undefined;
    erLøpende: true;
};

export type DatoIntervall = FastDatoIntervall | LøpendeDatoIntervall;

export interface DatoMedKategori {
    dato: Dayjs;
    kategori: DatointervallKategori;
}

export interface Permitteringsoversikt {
    dagerPermittert: number;
    dagerAnnetFravær: number;
    dagerBrukt: number;
}
