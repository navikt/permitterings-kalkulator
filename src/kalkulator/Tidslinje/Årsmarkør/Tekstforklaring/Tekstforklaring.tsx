import React, {FunctionComponent} from "react";
import { DatoMedKategori} from "../../../typer";
import  {Dayjs} from "dayjs";
import './Tekstforklaring.less'
import {Element,Normaltekst} from "nav-frontend-typografi";
import {getPermitteringsoversiktFor18Måneder} from "../../../utils/beregningerForRegelverksendring1Nov";
import {finnDato18MndTilbake, formaterDatoIntervall} from "../../../utils/dato-utils";
import {skrivDagerIHeleUkerPlussDager} from "../../../SeResultat/Utregningstekst/utregningstekst-avvikling-av-koronaregler-utils";

interface Props {
    sisteDagIPeriode: Dayjs;
    tidslinje: DatoMedKategori[];
    datoVisesPaDragElement: Dayjs;
}


const Tekstforklaring: FunctionComponent<Props> = (props) => {

    const oversiktOverPermitteringi18mndsperiode  = getPermitteringsoversiktFor18Måneder(
        props.tidslinje,
        props.datoVisesPaDragElement
    ).dagerBrukt;

    return (
        <div className="tidslinje__tekstforklaring">
            <Element className={"tidslinje__tekstforklaring-element"}>
                Illustrasjonen viser permitteringsperiodene du har
                plottet inn og plasserer de i en tidslinje.
            </Element>
            <Normaltekst>
                Perioden din ansatte når eller potensielt når maks
                antall permitteringsdager er{' '}
                {formaterDatoIntervall({
                    datoFra: finnDato18MndTilbake(
                        props.sisteDagIPeriode
                    ),
                    datoTil: props.sisteDagIPeriode,
                })}. Ved å dra i det blå drag-elementet har du mulighet for å se hvor lenge den ansatte er permittering i den markerte 18-månedsperioden.
            </Normaltekst>
            <Normaltekst>
                Du kan dra det blå drag-elementet for å se hvor mange
                permitteringsdager som er innenfor den markerte
                18-månedsperioden.
            </Normaltekst>
            <Element
                className={
                    'kalkulator__tidslinje-drag-element-forklaring'
                }
            >
                Permittering i den markerte 18-månedsperioder: {' '}
                {
                    skrivDagerIHeleUkerPlussDager(oversiktOverPermitteringi18mndsperiode)
                }{' '}({oversiktOverPermitteringi18mndsperiode}{' '} dager).
            </Element>
        </div>
    );
};

export default Tekstforklaring;
