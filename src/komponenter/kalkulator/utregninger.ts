
//returner antall dager fom startdato tom sluttdato
import { PermitteringsperiodeInfo } from './kalkulator';

export const antalldagerGått = (fra: Date, til?: Date) => {
    const tilDato = til ? til : new Date()
    const msGatt = tilDato.getTime() - fra.getTime();
    const dagerGått = msGatt/(1000*60*60*24)
    return Math.ceil(dagerGått+1)
}

export const antallUkerRundetOpp = (antallDager: number) => {
    return Math.ceil(antallDager/7);
}

export const datoErFørMars = (dato: Date) => {
    const førsteMars = new Date('2021-03-01')
    return dato.getTime()<førsteMars.getTime()
}

export const regnUtTotalAntallDager = (listeMedPermitteringsInfo: PermitteringsperiodeInfo[]): number => {
    let antallDagerAllePerioder = 0;
        listeMedPermitteringsInfo.forEach(informasjon => {
        if (informasjon.datoFra) {
            const dager = antalldagerGått(informasjon.datoFra, informasjon.datoTil) - informasjon.antallDagerSykmeldt - informasjon.antallDagerPErmisjonOgFerie;
            antallDagerAllePerioder += dager;
        }
    })
    return antallDagerAllePerioder;
}