import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    antalldagerGått, datointervallKategori, DatoMedKategori, finn1DagTilbake,
    finnDato18MndFram,
    finnDato18MndTilbake,
    konstruerTidslinje,
} from '../utregninger';
import './Tidslinje.less';
import { AllePermitteringerOgFraværesPerioder } from '../kalkulator';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
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

const regnUtIndeksForDato = (dato: Date, tidslinjeobjekt: DatoMedKategori[]) => {
    let indeksDato = 0;
    tidslinjeobjekt.forEach((objekt, indeks) => {
        if (skrivOmDato(dato) === skrivOmDato(objekt.dato)) {
            console.log('dette skjer for indeks', indeks)
            indeksDato = indeks
        }
    })
    return indeksDato
}

const Tidslinje:FunctionComponent<Props> = props => {
    const [tidslinjeobjekter, setTidslinjeobjekter] = useState(konstruerTidslinje(props.allePermitteringerOgFraværesPerioder))
    const breddePerObjekt = (100/tidslinjeobjekter.length);
    const [datoOnDrag, setDatoOnDrag] = useState(finnDato18MndTilbake(props.sisteDagIPeriode))

    useEffect(() => {
        setTidslinjeobjekter(konstruerTidslinje(props.allePermitteringerOgFraværesPerioder))
    },[props.allePermitteringerOgFraværesPerioder, props.sisteDagIPeriode] );

    const finnFarge = (kategori: datointervallKategori) => {
        if (kategori === 0) {
            return '#005B82'
        }
        if (kategori === 2) {
            return 'darksalmon'
        }
        return 'transParent'
    }

    const tidslinjeHTMLObjekt = tidslinjeobjekter
        .map ( (objekt, indeks) => {
            const style: React.CSSProperties = {
                width: breddePerObjekt.toString()+'%',
            }
            const erIdag = (skrivOmDato(objekt.dato) === skrivOmDato(new Date)) ? 'dagens-dato' : '';
            return (
                <div id = {'kalkulator-tidslinjeobjekt-'+indeks}style={style}
                     className={'kalkulator__tidslinjeobjekt '+erIdag}
                     key={indeks}>
                    {erIdag &&
                        <div className={'tidslinje-dagens-dato-markør'}>
                            <Undertekst className={'tidslinje-dagens-dato-markør-tekst'}>{skrivOmDato(new Date())}</Undertekst>
                        </div>
                    }
                </div>
            );
        })

    interface FargeElement {
        antallDagerISekvens: number,
        kategori: datointervallKategori,
        grenserTilFraværHøyre?: boolean,
        grenserTilFraværVenstre?: boolean
    }

    const fargePerioder: FargeElement[] = [];
    let rekkefølgeTeller = 1;
    tidslinjeobjekter.forEach((objekt, indeks) => {
        if (indeks !== 0) {
            if (tidslinjeobjekter[indeks-1].kategori === tidslinjeobjekter[indeks].kategori) {
                rekkefølgeTeller ++
            }
            else {
                const fargeElement: FargeElement = {
                    antallDagerISekvens: rekkefølgeTeller,
                    kategori: tidslinjeobjekter[indeks-1].kategori,
                }
                fargePerioder.push(fargeElement)
                rekkefølgeTeller = 1
            }
            if (indeks === tidslinjeobjekter.length-1) {
                const fargeElement: FargeElement = {
                    antallDagerISekvens: rekkefølgeTeller,
                    kategori: tidslinjeobjekter[indeks].kategori,
                }
                fargePerioder.push(fargeElement)
            }
        }
    })

    const htmlFargeObjekt = fargePerioder.map ( (objekt, indeks) => {
        let borderRadius ='0'
        if (objekt.kategori === 0) {
            const grenserTilFraværVenstre = objekt.kategori === 0 && fargePerioder[indeks-1].kategori === 2
            const grenserTilFraværHøyre = objekt.kategori === 0 && fargePerioder[indeks+1].kategori === 2
            if (grenserTilFraværVenstre) {
                borderRadius = '0 4px 4px 0'
            }
            else if (grenserTilFraværHøyre ){
                borderRadius = '4px 0 0 4px'
            }
            else {
                borderRadius = '4px'
            }
        }

        const style: React.CSSProperties = {
            width: (breddePerObjekt*objekt.antallDagerISekvens).toString()+'%',
            backgroundColor: finnFarge(objekt.kategori),
            borderRadius: borderRadius
        }
        return (
            <div style={style}/>
        );
    })

    let breddeAvDragElement = breddePerObjekt*(antalldagerGått(finnDato18MndTilbake(props.sisteDagIPeriode), props.sisteDagIPeriode))
    const OnTidslinjeDragRelease = () => {
        props.set18mndsPeriode(finnDato18MndFram(datoOnDrag));
    }

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
        setDatoOnDrag(tidslinjeobjekter[indeksStartDato].dato)
    }

    //const førsteDatoIPeriode = document.getElementById('kalkulator-tidslinjeobjekt-' + regnUtIndeksForDato(finnDato18MndTilbake(props.sisteDagIPeriode), tidslinjeobjekter));
    //console.log('prøver å finne et id-navn',regnUtIndeksForDato(finnDato18MndTilbake(props.sisteDagIPeriode), tidslinjeobjekter))
    //const førsteDatoIPeriodePosisjon = førsteDatoIPeriode?.getBoundingClientRect();

    return (
        <>
            { tidslinjeobjekter.length>0 &&
                <div className={'kalkulator__tidslinje-container start'} id={'kalkulator__tidslinje-container start'}  >
                    <Draggable axis={'x'} bounds={"parent"} onStop={() => OnTidslinjeDragRelease()} onDrag={() => OnTidslinjeDrag()}>
                        <div style={{width: `${breddeAvDragElement }%`}} id={'draggable-periode'} className={ 'kalkulator__draggable-periode'}>
                            <div className={ 'kalkulator__draggable-kant venstre'}/>
                            <Normaltekst  className = {'venstre-dato '}>
                                {skrivOmDato(datoOnDrag)}
                            </Normaltekst>
                            <div className={ 'kalkulator__draggable-kant høyre'}/>
                            <Normaltekst className = {'høyre-dato'}>
                                {skrivOmDato(finnDato18MndFram(datoOnDrag))}
                            </Normaltekst>
                        </div>
                    </Draggable>
                     <div className={'kalkulator__tidslinje-underlag'} id={'kalkulator__tidslinje'}>
                        <div className={'kalkulator__tidslinje-fargeperioder'}>
                        {htmlFargeObjekt}
                        </div>
                    {tidslinjeHTMLObjekt}
                     </div>
                </div>}
            </>
    );
};

export default Tidslinje;

/*{ tidslinjeobjekter.length>0 && <div className={ 'kalkulator__tidslinje-datoer'}>
    <Normaltekst>{skrivOmDato(tidslinjeobjekter[0].dato)}</Normaltekst>
    <Normaltekst>{skrivOmDato(tidslinjeobjekter[tidslinjeobjekter.length-1].dato)}</Normaltekst>
</div>}

 */