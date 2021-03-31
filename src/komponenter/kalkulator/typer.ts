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

export type DatoIntervall =
    | {
          datoFra: Dayjs;
          datoTil: Dayjs;
          erLøpende?: false;
      }
    | {
          datoFra: Dayjs;
          datoTil?: undefined;
          erLøpende: true;
      };

export interface DatoMedKategori {
    dato: Dayjs;
    kategori: DatointervallKategori;
}

export interface Permitteringsoversikt {
    dagerPermittert: number;
    dagerAnnetFravær: number;
    dagerBrukt: number;
}
