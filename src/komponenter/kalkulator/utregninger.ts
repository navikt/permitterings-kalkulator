
//returner antall dager fom startdato tom sluttdato
export const antalldagerGått = (fra: Date, til?: Date) => {
    const tilDato = til ? til : new Date()
    const msGatt = tilDato.getTime() - fra.getTime();
    const dagerGått = msGatt/(1000*60*60*24)
    return dagerGått+1
}

export const antallUkerRundetOpp = (antallDager: number) => {
    return Math.ceil(antallDager/7);
}