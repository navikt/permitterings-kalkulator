import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import '../kalkulator.less';
import './Permitteringsperiode.less';

import LeggtilFraværsperiode from './Fraværsperioder';
import { PermitteringsperiodeInfo } from '../kalkulator';
import { Element, Undertittel } from 'nav-frontend-typografi';
import DatoIntervallInput from './DatointervallInput/DatointervallInput';

interface Props {
    info: PermitteringsperiodeInfo;
    indeks: number;
    allePermitteringer: PermitteringsperiodeInfo[];
    setAllePermitteringer: (permitteringer: PermitteringsperiodeInfo[]) => void;
}

const Permitteringsperiode: FunctionComponent<Props> = props => {
    const [erLøpendePermittering, setErLøpendePermittering] = useState(true)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (props.allePermitteringer.length> props.indeks && props.indeks>0) {
            ref.current?.scrollIntoView({ block: "end"})
        }
    }, [props.info, props.allePermitteringer]);

    /*const setTilDatoOgOppdaterListe = (dato?: Date) => {
        setDatoTil(dato);
        const kopiAvInfo = [...props.allePermitteringer]
        kopiAvInfo[props.indeks].datoTil = dato;
        props.setAllePermitteringer(kopiAvInfo);
    }

     */


    return (<div className={'permitteringsperiode'} ref={ref}>
            <Undertittel className={'permitteringsperiode__undertittel'}>{props.indeks+1 +'. permitteringsperiode'}</Undertittel>
            <Element>Fyll inn fra første dag etter lønnsplikt</Element>
                <DatoIntervallInput
                    indeksPermitteringsperioder={props.indeks}
                    allePermitteringer={props.allePermitteringer}
                    setAllePermitteringer={props.setAllePermitteringer}
                    type={'PERMITTERINGSINTERVALL'}
                />
            <LeggtilFraværsperiode
                allePermitteringer={props.allePermitteringer}
                type={'SYKMELDING'}
                indeks={props.indeks}
                setAllePermitteringer={props.setAllePermitteringer}

            />
        </div>
    );
};

export default Permitteringsperiode;