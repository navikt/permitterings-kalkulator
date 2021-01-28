import React, { FunctionComponent, useEffect, useState } from 'react';
import { DatoMedKategori, konstruerTidslinje } from '../utregninger';
import './Tidslinje.less';
import { AllePermitteringerOgFraværesPerioder } from '../kalkulator';
import { Normaltekst } from 'nav-frontend-typografi';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const Tidslinje:FunctionComponent<Props> = props => {
    const [tidslinjeobjekter, setTidslinjeobjekter] = useState(konstruerTidslinje(props.allePermitteringerOgFraværesPerioder))
    const breddePerObjekt = (100/tidslinjeobjekter.length).toString()+'%';

    useEffect(() => {
        setTidslinjeobjekter(konstruerTidslinje(props.allePermitteringerOgFraværesPerioder))
    },[props.allePermitteringerOgFraværesPerioder] );

    const finnFarge = (datoKategori: DatoMedKategori) => {
        if (datoKategori.kategori === 0) {
            return 'blå'
        }
        if (datoKategori.kategori === 2) {
            return 'grå'
        }
        return 'lysblå'
    }

    const tidslinjeHTMLObjekt = tidslinjeobjekter
        .map ( objekt => {
            const style: React.CSSProperties = {
                width: breddePerObjekt,
                backgroundColor: finnFarge(objekt),
            }
            return (
                <div style={style} className={'kalkulator__tidslinjeobjekt '+ finnFarge(objekt)}/>
            );

        })

    console.log(tidslinjeHTMLObjekt.length, 'lengde')

    return (
        <div className={'kalkulator__tidslinje-container start'}>
            {tidslinjeobjekter.length>0 && <div className={'kalkulator__tidslinje-datoer'}>
                <Normaltekst>{skrivOmDato(tidslinjeobjekter[0].dato)}</Normaltekst>
                <Normaltekst>{skrivOmDato(tidslinjeobjekter[tidslinjeobjekter.length-1].dato)}</Normaltekst>
            </div>}
            <div className={'kalkulator__tidslinje'}>
            {tidslinjeHTMLObjekt}
            </div>
        </div>
    );
};

export default Tidslinje;