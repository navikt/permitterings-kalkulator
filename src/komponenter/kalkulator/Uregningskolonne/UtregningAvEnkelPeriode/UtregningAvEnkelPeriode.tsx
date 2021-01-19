import React, { FunctionComponent, useEffect, useState } from 'react';
import './UtregningAvEnkelPeriode.less';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { PermitteringsperiodeInfo } from '../../kalkulator';
import { antalldagerGått } from '../../utregninger';


interface UtregningAvEnkelPeriodeProps {
    indeks: number
    info: PermitteringsperiodeInfo;
    listeMedPermitteringsinfo: PermitteringsperiodeInfo[]
}

const UtregningAvEnkelPeriode:FunctionComponent<UtregningAvEnkelPeriodeProps> = props => {
    const [antall, setAntall] = useState(0)

    useEffect(() => {
        const antallDagerGått = props.info.datoFra ? antalldagerGått(props.info.datoFra, props.info.datoTil) : 0;
        const svar = antallDagerGått - props.info.antallDagerPErmisjonOgFerie - props.info.antallDagerSykmeldt;
        setAntall(svar)
    }, [props.info, props.listeMedPermitteringsinfo]);



    return (
        <div className={'utregningskolonne__enkel-utregning-container'}>
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
                    totalt:
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
                    <Undertekst className={'utregningskolonne__svar'}>{antall}</Undertekst>
                </div>
            </div>
        </div>
        </div>
    );
};

export default UtregningAvEnkelPeriode;