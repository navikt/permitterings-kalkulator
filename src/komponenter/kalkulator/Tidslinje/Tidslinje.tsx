import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    antalldagerGått,
    DatoMedKategori,
    finnDato18MndFram,
    finnDato18MndTilbake,
    konstruerTidslinje,
} from '../utregninger';
import './Tidslinje.less';
import { AllePermitteringerOgFraværesPerioder } from '../kalkulator';
import { Normaltekst } from 'nav-frontend-typografi';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';

import Draggable from 'react-draggable';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    set18mndsPeriode: (dato: Date) => void;
    sisteDagIPeriode: Date;
}

const regnUtHorisontalAvstandMellomToElement = (id1: string, id2: string) => {
    const element1 = document.getElementById(id1);
    const element2 = document.getElementById(id2);
    const posisjonBeskrivelse1 = element1?.getBoundingClientRect();
    const posisjonBeskrivelse2 = element2?.getBoundingClientRect();
    const avstand = posisjonBeskrivelse1?.left!! - posisjonBeskrivelse2?.left!!
    return Math.abs(avstand)
}

const skrivUtypeDato = (type: number):string => {
    switch (true) {
        case (type === 0) :
            return 'permittert'
        case (type === 1) :
            return 'i arbeid'
        case (type === 2) :
            return 'annet fravær'
        default :
            return ''
    }
}

const Tidslinje:FunctionComponent<Props> = props => {
    const [tidslinjeobjekter, setTidslinjeobjekter] = useState(konstruerTidslinje(props.allePermitteringerOgFraværesPerioder))
    const breddePerObjekt = (100/tidslinjeobjekter.length);

    const [typeDatoOnHover, setTypeDatoOnHover] = useState('')

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
        .map ( (objekt, indeks) => {
            const style: React.CSSProperties = {
                width: breddePerObjekt.toString()+'%',
                backgroundColor: finnFarge(objekt),
            }
            return (
                <div id = {'kalkulator-tidslinjeobjekt-'+indeks}style={style}
                     className={'kalkulator__tidslinjeobjekt '+ finnFarge(objekt)}
                     key={indeks}
                />
            );
        })


    let breddeAvDragElement = breddePerObjekt*(antalldagerGått(finnDato18MndTilbake(props.sisteDagIPeriode), props.sisteDagIPeriode))
    const OnTidslinjeDrag = () => {
        let indeksStartDato = 0;
        let minimumAvstand = 1000
        tidslinjeHTMLObjekt.forEach((objekt,indeks) => {
            const avstand = regnUtHorisontalAvstandMellomToElement('draggable-periode','kalkulator-tidslinjeobjekt-'+indeks)
            if (avstand < minimumAvstand) {
                minimumAvstand = avstand
                indeksStartDato = indeks
            }
        }
        )
        const type = tidslinjeobjekter[indeksStartDato].kategori;
        const typeItekst = skrivUtypeDato(type)
        setTypeDatoOnHover(typeItekst)
        const sluttDato = finnDato18MndFram(tidslinjeobjekter[indeksStartDato].dato);
        props.set18mndsPeriode(sluttDato)
        /*let indeksSluttdato = 0;
        tidslinjeobjekter.forEach((objekt,indeks) => {
            if (objekt.dato.toDateString() === sluttDato.toDateString()) {
                indeksSluttdato = indeks
            }
        }
        );

         */
    }

    return (
        <div className={'kalkulator__tidslinje-container start'} id={'kalkulator__tidslinje-container start'}  >
            <div className={'kalkulator__tidslinje-dato-info'}>
                <Normaltekst>{skrivOmDato(finnDato18MndTilbake(props.sisteDagIPeriode)) + '-' +skrivOmDato(props.sisteDagIPeriode)}</Normaltekst>
                <Normaltekst>{typeDatoOnHover}</Normaltekst>
            </div>
            { tidslinjeobjekter.length >0 && <>
                    <Draggable axis={'x'} bounds={"parent"} onStop={() => OnTidslinjeDrag()}>
                        <div style={{width: `${breddeAvDragElement }%`}} id={'draggable-periode'} className={ 'kalkulator__draggable-periode'}/>
                    </Draggable>
            </>}

            <div className={'kalkulator__tidslinje'} id={'kalkulator__tidslinje'}>
            {tidslinjeHTMLObjekt}
            </div>
            { tidslinjeobjekter.length>0 && <div className={ 'kalkulator__tidslinje-datoer'}>
                <Normaltekst>{skrivOmDato(tidslinjeobjekter[0].dato)}</Normaltekst>
                <Normaltekst>{skrivOmDato(tidslinjeobjekter[tidslinjeobjekter.length-1].dato)}</Normaltekst>
            </div>}
        </div>
    );
};

export default Tidslinje;