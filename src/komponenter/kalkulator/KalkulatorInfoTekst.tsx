import React, { FunctionComponent, useContext } from 'react';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import {
    finnDato18MndFramDayjs,
    finnDato18MndTilbakeDayjs,
} from './utregninger';
import { PermitteringContext } from '../ContextProvider';
import { Dayjs } from 'dayjs';
import { formaterDato } from '../Datovelger/datofunksjoner';

interface Props {
    førsteDagI18mndsPeriode: undefined | Dayjs;
}

const KalkulatorInfoTekst: FunctionComponent<Props> = (props) => {
    const { førsteDagI18mndsPeriode } = props;
    const { dagensDatoDayjs } = useContext(PermitteringContext);

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
                    Dagens dato er {formaterDato(dagensDatoDayjs)}. 18 måneder
                    bakover fra i dag er{' '}
                    {formaterDato(finnDato18MndTilbakeDayjs(dagensDatoDayjs))}.
                    18 måneder framover er{' '}
                    {formaterDato(finnDato18MndFramDayjs(dagensDatoDayjs))}.
                </span>
            </Normaltekst>
            {førsteDagI18mndsPeriode && (
                <>
                    <Element>
                        Testdato er {formaterDato(førsteDagI18mndsPeriode)}. 18
                        måneder bakover fra testdato er{' '}
                        {formaterDato(
                            finnDato18MndTilbakeDayjs(førsteDagI18mndsPeriode)
                        )}
                        . 18 måneder framover er{' '}
                        {formaterDato(
                            finnDato18MndFramDayjs(førsteDagI18mndsPeriode)
                        )}
                    </Element>
                </>
            )}
        </>
    );
};

export default KalkulatorInfoTekst;
