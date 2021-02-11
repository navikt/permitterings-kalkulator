import React, { FunctionComponent, useEffect, useState } from 'react';
import './UtregningAvEnkelPeriode.less';
import { Element, Undertekst } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
} from '../../kalkulator';
import {
    antalldagerGått,
    summerFraværsdagerIPermitteringsperiode,
} from '../../utregninger';

interface UtregningAvEnkelPeriodeProps {
    indeks: number;
    permitteringsperiode: DatoIntervall;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const UtregningAvEnkelPeriode: FunctionComponent<UtregningAvEnkelPeriodeProps> = (
    props
) => {
    const [antall, setAntall] = useState(0);

    useEffect(() => {
        const antallDagerGått = props.permitteringsperiode.datoFra
            ? antalldagerGått(
                  props.permitteringsperiode.datoFra!!,
                  props.permitteringsperiode.datoTil
              )
            : 0;
        const fraværIPerioden = summerFraværsdagerIPermitteringsperiode(
            props.permitteringsperiode,
            props.allePermitteringerOgFraværesPerioder.andreFraværsperioder
        );
        const svar = antallDagerGått - fraværIPerioden;
        setAntall(svar);
    }, [props, antall]);

    return (
        <div className={'utregningskolonne__enkel-utregning-container'}>
            <Element>{props.indeks + 1 + '. permitteringsperiode'}</Element>
            <div className={'utregningskolonne__enkelperiode'}>
                <div className={'utregningskolonne__forklaring'}>
                    <Undertekst>permittert:</Undertekst>
                    <Undertekst>annet fravær:</Undertekst>
                    <Undertekst>totalt:</Undertekst>
                </div>
                <div className={'utregningskolonne__enkelperiode-utregning'}>
                    <Undertekst>
                        {props.permitteringsperiode.datoFra
                            ? antalldagerGått(
                                  props.permitteringsperiode.datoFra,
                                  props.permitteringsperiode.datoTil
                              )
                            : 0}
                    </Undertekst>
                    <div className={'utregningskolonne__ledd'}>
                        <Undertekst>-</Undertekst>
                        <Undertekst>
                            {summerFraværsdagerIPermitteringsperiode(
                                props.permitteringsperiode,
                                props.allePermitteringerOgFraværesPerioder
                                    .andreFraværsperioder
                            )}
                        </Undertekst>
                    </div>
                    <div className={'utregningskolonne__ledd '}>
                        <Undertekst>=</Undertekst>
                        <Undertekst className={'utregningskolonne__svar'}>
                            {antall}
                        </Undertekst>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UtregningAvEnkelPeriode;
