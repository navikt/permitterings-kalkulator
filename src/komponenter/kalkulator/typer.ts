export enum datointervallKategori {
    PERMITTERT,
    ARBEIDER,
    ANNETFRAVÆR,
}

export interface AllePermitteringerOgFraværesPerioder {
    permitteringer: DatoIntervall[];
    andreFraværsperioder: DatoIntervall[];
}

export interface DatoIntervall {
    datoFra: Date | undefined;
    datoTil: Date | undefined;
    erLøpende?: boolean;
}

export interface DatoMedKategori {
    dato: Date;
    kategori: datointervallKategori;
}

export interface OversiktOverBrukteOgGjenværendeDager {
    dagerPermittert: number;
    dagerAnnetFravær: number;
    dagerGjensående: number;
}
