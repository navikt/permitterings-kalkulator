import React, { FunctionComponent } from 'react';
import './Topp.less';
import {
    finnDato18MndTilbake,
} from '../utregninger';
import { Ingress, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';
import Datovelger from '../../Datovelger/Datovelger';

interface Props {
    set18mndsPeriode: (dato: Date) => void;
    sisteDagIPeriode: Date;
}


const Topp:FunctionComponent<Props> = props => {

    return (
        <div className={'kalkulator__topp'}>
            <Normaltekst className={'kalkulator__generell-info'}>
                Fra 1. november 2020 økte maksperioden en arbeidsgiver kan fritas fra sin
                lønnsplikt innenfor en periode på 18 måneder, fra 26 til 49 uker.
            </Normaltekst>
            <Ingress>
                Angi hvilken 18 måneders periode du vil beregne ut ifra
            </Ingress>
            <Undertittel className={'kalkulator__18mnd-illustrasjon-tekst'}>
                18 måneder
            </Undertittel>
            <div className={'kalkulator__18mnd-illustrasjon'}>
                <div className={'kalkulator__18mnd-illustrasjon-første-dag'}>
                    <Normaltekst>
                        første dag:
                    </Normaltekst>
                    <Normaltekst>
                        {skrivOmDato(finnDato18MndTilbake(props.sisteDagIPeriode))}
                    </Normaltekst>
                </div>
                <div className={'kalkulator__18mnd-linje'}/>
                <Datovelger  className={'initial-datovelger'} overtekst={'Siste dag i perioden'} onChange={(event => {
                    props.set18mndsPeriode(event.currentTarget.value)
                })}
                             value={props.sisteDagIPeriode}/>
            </div>
        </div>

    )

};

export default Topp;