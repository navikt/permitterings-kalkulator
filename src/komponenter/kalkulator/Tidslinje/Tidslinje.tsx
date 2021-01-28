import React, { FunctionComponent, useEffect, useState } from 'react';
import { DatoMedKategori, konstruerTidslinje, settDatoerInnenforRiktigIntervall } from '../utregninger';
import './Tidslinje.less';
import { AllePermitteringerOgFraværesPerioder } from '../kalkulator';


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
            return 'blue'
        }
        if (datoKategori.kategori === 2) {
            return 'red'
        }
        return 'green'
    }

    console.log('tidslinje objekt: ', tidslinjeobjekter);

    const tidslinjeHTMLObjekt = tidslinjeobjekter
        .map ( objekt => {
            const style: React.CSSProperties = {
                width: breddePerObjekt,
                backgroundColor: finnFarge(objekt),
                height: '6px'
            }
            return (
                <div style={style}/>
            );

        })

    console.log(tidslinjeHTMLObjekt.length, 'lengde')

    return (
        <div className={'kalkulator__tidslinje'}>
            {tidslinjeHTMLObjekt}
        </div>
    );
};

export default Tidslinje;