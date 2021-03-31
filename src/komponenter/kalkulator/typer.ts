import { Dayjs } from 'dayjs';

export enum DatointervallKategori {
    PERMITTERT_UTEN_FRAVÆR,
    PERMITTERT_MED_FRAVÆR,
    IKKE_PERMITTERT,
}

export interface AllePermitteringerOgFraværesPerioder {
    permitteringer: DatoIntervall[];
    andreFraværsperioder: DatoIntervall[];
}

export type DatoIntervall =
    | {
          datoFra: Dayjs | undefined;
          datoTil: Dayjs | undefined;
          erLøpende?: false;
      }
    | {
          datoFra: Dayjs | undefined;
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
