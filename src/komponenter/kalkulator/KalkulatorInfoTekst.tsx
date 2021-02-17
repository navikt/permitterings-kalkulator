import React, { FunctionComponent } from 'react';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { skrivOmDato } from '../Datovelger/datofunksjoner';
import { finnDato18MndFram, finnDato18MndTilbake } from './utregninger';

interface Props {
    førsteDagI18mndsPeriode: undefined | Date;
}

const KalkulatorInfoTekst: FunctionComponent<Props> = (props) => {
    const { førsteDagI18mndsPeriode } = props;
    return (
        <>
            <Systemtittel>Få oversikt over permitteringsperioder</Systemtittel>
            <Normaltekst className={'kalkulator__generell-info'}>
                Fra 1. november 2020 økte maksperioden en arbeidsgiver kan
                fritas fra sin lønnsplikt innenfor en periode på 18 måneder, fra
                26 til 49 uker. Her kan du regne ut hvor mange uker du har
                permittert dine ansatte, og hvor mye du har igjen. Hvilken
                tidsperiode som gjelder for deg finner du ved å fylle inn
                startdato fra din første permittering.
                <span className="typo-element">
                    <br />
                    Dagens dato er {skrivOmDato(new Date())}. 18 måneder bakover
                    fra i dag er {skrivOmDato(finnDato18MndTilbake(new Date()))}
                    . 18 måneder framover er{' '}
                    {skrivOmDato(finnDato18MndFram(new Date()))}.
                </span>
            </Normaltekst>
            {førsteDagI18mndsPeriode && (
                <>
                    <Element>
                        Testdato er {skrivOmDato(førsteDagI18mndsPeriode)}. 18
                        måneder bakover fra testdato er{' '}
                        {skrivOmDato(
                            finnDato18MndTilbake(førsteDagI18mndsPeriode)
                        )}
                        . 18 måneder framover er{' '}
                        {skrivOmDato(
                            finnDato18MndFram(førsteDagI18mndsPeriode)
                        )}
                    </Element>
                </>
            )}
        </>
    );
};

export default KalkulatorInfoTekst;
