import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import './UtregningAvEnkelPeriode.less';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { PermitteringsperiodeInfo } from '../../kalkulator';
import { antalldagerGått, summerAlleFraværeperioder } from '../../utregninger';
import { scrollIntoView } from '../../../../utils/scrollIntoView';


interface UtregningAvEnkelPeriodeProps {
    indeks: number
    info: PermitteringsperiodeInfo;
    listeMedPermitteringsinfo: PermitteringsperiodeInfo[]
}

const UtregningAvEnkelPeriode:FunctionComponent<UtregningAvEnkelPeriodeProps> = props => {
    const [antall, setAntall] = useState(0)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const antallDagerGått = props.info.permitteringsIntervall.datoFra ?
            antalldagerGått(props.info.permitteringsIntervall.datoFra, props.info.permitteringsIntervall.datoTil) : 0;
        const svar = antallDagerGått - summerAlleFraværeperioder(props.info);
        setAntall(svar)
    }, [props.info, props.listeMedPermitteringsinfo]);

    console.log(props.listeMedPermitteringsinfo)

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
                    annet fravær:
                </Undertekst>
                <Undertekst>
                    totalt:
                </Undertekst>

            </div>
            <div className={'utregningskolonne__enkelperiode-utregning'}>
                <Undertekst>
                    {props.info.permitteringsIntervall.datoFra ? antalldagerGått(props.info.permitteringsIntervall.datoFra, props.info.permitteringsIntervall.datoTil) : 0}
                </Undertekst>
                <div className={'utregningskolonne__ledd'}>
                    <Undertekst>-</Undertekst>
                    <Undertekst>{summerAlleFraværeperioder(props.info)}</Undertekst>
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