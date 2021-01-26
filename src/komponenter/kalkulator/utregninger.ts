
//returner antall dager fom startdato tom sluttdato
import { ARBEIDSGIVERPERIODE2DATO, DatoIntervall, PermitteringsperiodeInfo } from './kalkulator';

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
    let antallDagerBruktSummert = 0;
        listeMedPermitteringsInfo.forEach(informasjon => {
            if (informasjon.permitteringsIntervall.datoFra && informasjon) {
                const sumDager = antalldagerGått(informasjon.permitteringsIntervall.datoFra, informasjon.permitteringsIntervall.datoTil)
                - summerAlleFraværeperioder(informasjon)
                antallDagerBruktSummert += sumDager
            }
    })
    return antallDagerBruktSummert
}

export const regnUtDatoAGP2 = (dagerBrukt: number) => {
    const dagerIgjen = 210 - dagerBrukt;
    const dagenDato = new Date();
    const beregnetAGP2 = new Date(dagenDato);
    beregnetAGP2.setDate(beregnetAGP2.getDate() + dagerIgjen)
    if (dagerIgjen>0) {
        return beregnetAGP2
    }
    return ARBEIDSGIVERPERIODE2DATO
}

export const summerAlleFraværeperioder = (permitteringsinfo: PermitteringsperiodeInfo) => {
    let antall = 0;
    permitteringsinfo.andreFraværsIntervall.forEach(fraværsIntervall => {
        if (fraværsIntervall.datoFra) {
            antall += antalldagerGått(fraværsIntervall.datoFra, fraværsIntervall.datoTil)
        }
    })
    return antall
}

export const inngårIPermitteringsperiode = (permitteringsintervall: DatoIntervall, fraværsintervall: DatoIntervall) => {
    if (permitteringsintervall.datoFra && permitteringsintervall.datoTil && fraværsintervall.datoFra && fraværsintervall.datoTil) {
        const helefraVærsperiodenInngår = (fraværsintervall.datoFra!!.getTime() >= permitteringsintervall.datoFra!!.getTime())
            && (fraværsintervall.datoTil!!.getTime() <= permitteringsintervall.datoTil!!.getTime())

        const fraværIHelePerioden = (fraværsintervall.datoFra!!.getTime()<permitteringsintervall.datoFra!!.getTime()) &&
            fraværsintervall.datoTil!!.getTime()>permitteringsintervall.datoTil!!.getTime();

        const sisteDelInngår = (fraværsintervall.datoFra!!.getTime() > permitteringsintervall.datoFra!!.getTime()) &&
            fraværsintervall.datoFra!!.getTime() < permitteringsintervall.datoTil!!.getTime()

        const førsteDelInngår = (fraværsintervall.datoFra!!.getTime() < permitteringsintervall.datoFra!!.getTime()) &&
            fraværsintervall.datoTil!!.getTime() > permitteringsintervall.datoFra!!.getTime();

        switch(true) {
            case helefraVærsperiodenInngår:
                return antalldagerGått(fraværsintervall.datoFra!!, fraværsintervall.datoTil)
            case fraværIHelePerioden:
                return antalldagerGått(permitteringsintervall.datoFra!!, permitteringsintervall.datoTil)
            case sisteDelInngår:
                return antalldagerGått(fraværsintervall.datoFra!!, permitteringsintervall.datoTil)
            case førsteDelInngår:
                return antalldagerGått(permitteringsintervall.datoFra!!, fraværsintervall.datoTil)
            default:
                return 0
        }
    }
    return 0;
}

export const summerFraværsdagerIPermitteringsperiode = (permitteringsperiode: DatoIntervall, fraværsperioder: DatoIntervall[]) => {
    let antallFraværsdagerIPeriode = 0;
    fraværsperioder.forEach(periode => antallFraværsdagerIPeriode+=inngårIPermitteringsperiode(permitteringsperiode,periode))
    return antallFraværsdagerIPeriode
}

export const finnUtOmDefinnesOverlappendePerioder = (perioder: DatoIntervall[]) => {
    let finnesOverLapp = false;
    perioder.forEach(periode => {
        perioder.forEach(periode2 => {
            if (periode.datoFra && periode2.datoFra && (periode !== periode2)) {
                if (inngårIPermitteringsperiode(periode, periode2) > 0) {
                    finnesOverLapp = true;
                }
            }
        })
    })
    return finnesOverLapp
}