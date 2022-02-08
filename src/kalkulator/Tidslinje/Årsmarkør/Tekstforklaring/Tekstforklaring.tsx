import React, { FunctionComponent } from 'react';
import { DatoMedKategori } from '../../../typer';
import { Dayjs } from 'dayjs';
import './Tekstforklaring.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    finnDato18MndTilbake,
    formaterDatoIntervall,
} from '../../../utils/dato-utils';
import { skrivDagerIHeleUkerPlussDager } from '../../../SeResultat/Utregningstekst/utregningstekst-avvikling-av-koronaregler-utils';
import { getPermitteringsoversiktFor18Måneder } from '../../../utils/beregningerForSluttPåDagpengeforlengelse';

interface Props {
    sisteDagIPeriode: Dayjs;
    tidslinje: DatoMedKategori[];
    datoVisesPaDragElement: Dayjs;
}

const Tekstforklaring: FunctionComponent<Props> = (props) => {
    const oversiktOverPermitteringi18mndsperiode = getPermitteringsoversiktFor18Måneder(
        props.tidslinje,
        props.datoVisesPaDragElement
    ).dagerBrukt;

    return (
        <div className="tidslinje__tekstforklaring">
            <Element className={'tidslinje__tekstforklaring-element'}>
                Illustrasjonen viser permitteringsperiodene du har plottet inn
                og plasserer de i en tidslinje.
            </Element>
            <Normaltekst>
                Perioden din ansatte når eller potensielt når maks antall
                permitteringsdager er:
            </Normaltekst>
            <Element className="tidslinje__tekstforklaring-periode">
                {formaterDatoIntervall({
                    datoFra: finnDato18MndTilbake(props.sisteDagIPeriode),
                    datoTil: props.sisteDagIPeriode,
                })}
            </Element>
            <Normaltekst>
                Du kan dra det blå drag-elementet for å se hvor mange
                permitteringsdager som er innenfor en bestemt 18-månedsperiode.
            </Normaltekst>
            <Element
                className={'kalkulator__tidslinje-drag-element-forklaring'}
            >
                Permittering i den markerte 18-månedsperioder:{' '}
                {skrivDagerIHeleUkerPlussDager(
                    oversiktOverPermitteringi18mndsperiode
                )}{' '}
                ({oversiktOverPermitteringi18mndsperiode} dager).
            </Element>
        </div>
    );
};

export default Tekstforklaring;
