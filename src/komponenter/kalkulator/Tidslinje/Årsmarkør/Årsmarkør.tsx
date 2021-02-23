import React, { FunctionComponent } from 'react';
import './Årsmarkør.less';
import { Undertekst } from 'nav-frontend-typografi';

interface Props {
    dato: Date
}


const Årsmarkør: FunctionComponent<Props> = (
    props
) => {

    return (
        <div className={'kalkulator__tidslinje-årsmarkering'}>
            <div className={'kalkulator__tidslinje-årsmarkering-vertikal-sylinder'}/>
            <div className={'kalkulator__tidslinje-årsmarkering-nedre-sirkel'}/>
            <Undertekst className={'kalkulator__tidslinje-årsmarkering-tekst'}>
                {props.dato.getFullYear()}
            </Undertekst>
        </div>
    );
};

export default Årsmarkør;
