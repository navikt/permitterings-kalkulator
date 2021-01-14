
//returner antall dager fom startdato tom sluttdato
export const antalldagerGått = (fra: Date, til: Date) => {
    const msGatt = til.getTime() - fra.getTime();
    const dagerGått = msGatt/(1000*60*60*24)
    console.log(dagerGått)
    return msGatt+1
}

export const antallUkerRundetOpp = (antallDager: number) => {
    return Math.ceil(antallDager/7);
}