import React, { FunctionComponent } from 'react';
import './Topp.less';
import {
    finnDato18MndTilbake,
} from '../utregninger';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';
import Datovelger from '../../Datovelger/Datovelger';
import kalender from './kalender.svg';
import Lenke from 'nav-frontend-lenker';

interface Props {
    set18mndsPeriode: (dato: Date) => void;
    sisteDagIPeriode: Date;
}


const Topp:FunctionComponent<Props> = props => {

    return (
        <div className={'kalkulator__topp'}>
            <Normaltekst className={'kalkulator__generell-info'}>
                Fra 1. november 2020 økte maksperioden en arbeidsgiver kan fritas fra sin
                lønnsplikt innenfor en periode på 18 måneder, fra 26 til 49 uker. <Lenke
                href={'https://arbeidsgiver.nav.no/arbeidsgiver-permittering#narSkalJegUtbetaleLonn'}>
                Du kan lese mer om beregning av lønnsplikt ved permittering her.
            </Lenke>
            </Normaltekst>
            <Undertittel>
                1. Angi hvilken 18 mnd periode du vil beregne
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
                <div className={'kalkulator__18mnd-linje'}>
                    <Element className={'kalkulator__18mnd-illustrasjon-tekst'}>
                        18 måneder
                    </Element>
                </div>
                <Datovelger  className={'initial-datovelger'} overtekst={'Siste dag i perioden'} onChange={(event => {
                    props.set18mndsPeriode(event.currentTarget.value)
                })} value={props.sisteDagIPeriode}/>
            </div>
            <div className={'kalkulator__velg-ny-periode-info'}>
                <img alt={'kalender ikon'} className={'kalkulator__ikon-kalender'} src={kalender}/>
                <Normaltekst>
                    Du kan velge en annen beregningsperiode ved å endre siste dag i perioden.
                </Normaltekst>
            </div>
        </div>

    )

};

export default Topp;