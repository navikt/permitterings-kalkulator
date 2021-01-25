import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import '../kalkulator.less';
import './Permitteringsperiode.less';

import { AllePermitteringerOgFraværesPerioder, DatoIntervall, PermitteringsperiodeInfo } from '../kalkulator';
import { Element, Undertittel } from 'nav-frontend-typografi';
import DatoIntervallInput from './DatointervallInput/DatointervallInput';

interface Props {
    info: DatoIntervall;
    indeks: number;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setAllePermitteringerOgFraværesPerioder: (allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder) => void;
}

const Permitteringsperiode: FunctionComponent<Props> = props => {
    const [erLøpendePermittering, setErLøpendePermittering] = useState(true)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (props.allePermitteringerOgFraværesPerioder.permitteringer.length> props.indeks && props.indeks>0) {
            ref.current?.scrollIntoView({ block: "end"})
        }
    }, [props.info, props.allePermitteringerOgFraværesPerioder]);

    return (<div className={'permitteringsperiode'} ref={ref}>
            <Undertittel className={'permitteringsperiode__undertittel'}>{props.indeks+1 +'. permitteringsperiode'}</Undertittel>
            <Element>Fyll inn fra første dag etter lønnsplikt</Element>
                <DatoIntervallInput
                    indeksPermitteringsperioder={props.indeks}
                    allePermitteringerOgFraværesPerioder={props.allePermitteringerOgFraværesPerioder}
                    setAllePermitteringerOgFraværesPerioder={props.setAllePermitteringerOgFraværesPerioder}
                    type={'PERMITTERINGSINTERVALL'}
                />
        </div>
    );
};

export default Permitteringsperiode;