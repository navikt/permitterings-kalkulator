import React, { FunctionComponent } from 'react';
import './UtregningAvEnkelPeriode.less';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { PermitteringsperiodeInfo } from '../../kalkulator';
import { antalldagerGått } from '../../utregninger';


interface UtregningAvEnkelPeriodeProps {
    indeks: number
    info: PermitteringsperiodeInfo;
}

const UtregningAvEnkelPeriode:FunctionComponent<UtregningAvEnkelPeriodeProps> = props => {



    const antallDagerGått = props.info.datoFra ? antalldagerGått(props.info.datoFra, props.info.datoTil) : 0;
    const svar = antallDagerGått - props.info.antallDagerPErmisjonOgFerie - props.info.antallDagerSykmeldt;

    return (
        <>
            <Element>
                {props.indeks+1 +'. permitteringsperiode'}
            </Element>
        <div className={'utregningskolonne__enkelperiode'}>
            <div className={'utregningskolonne__forklaring'}>
                <Undertekst>
                    permittert:
                </Undertekst>
                <Undertekst>
                    sykmeldt:
                </Undertekst>
                <Undertekst>
                    permisjoner:
                </Undertekst>
                <Undertekst>
                    totalt antall dager:
                </Undertekst>

            </div>
            <div className={'utregningskolonne__enkelperiode-utregning'}>
                <Undertekst>
                    {props.info.datoFra ? antalldagerGått(props.info.datoFra, props.info.datoTil) : 0}
                </Undertekst>
                <div className={'utregningskolonne__ledd'}>
                    <Undertekst>-</Undertekst>
                    <Undertekst>{props.info.antallDagerSykmeldt}</Undertekst>
                 </div>
                <div className={'utregningskolonne__ledd'}>
                    <Undertekst>-</Undertekst>
                    <Undertekst>{props.info.antallDagerPErmisjonOgFerie}</Undertekst>
                </div>
                <div className={'utregningskolonne__ledd '}>
                    <Undertekst>=</Undertekst>
                    <Undertekst className={'utregningskolonne__svar'}>{svar}</Undertekst>
                </div>
            </div>
        </div>
        </>
    );
};

export default UtregningAvEnkelPeriode;