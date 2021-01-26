import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import '../kalkulator.less';
import './Permitteringsperiode.less';

import {
    AllePermitteringerOgFraværesPerioder,
    ARBEIDSGIVERPERIODE2DATO,
    DatoIntervall
} from '../kalkulator';
import { Element, Undertittel } from 'nav-frontend-typografi';
import DatoIntervallInput from '../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';

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
            ref.current?.scrollIntoView({ block: "center"})
        }
    }, [props.info, props.allePermitteringerOgFraværesPerioder]);

    const leggTilNyPermitteringsperiode = () => {
        const nyPeriode: DatoIntervall = {
            datoFra: undefined,
            datoTil: ARBEIDSGIVERPERIODE2DATO
        }

        const kopiAvPermitterinsperioder = {...props.allePermitteringerOgFraværesPerioder};
        kopiAvPermitterinsperioder.permitteringer.push(nyPeriode)
        props.setAllePermitteringerOgFraværesPerioder(kopiAvPermitterinsperioder)
    }

    return (<div className={'permitteringsperiode'} ref={ref}>
            <Undertittel className={'permitteringsperiode__undertittel'}>{props.indeks+1 +'. permitteringsperiode'}</Undertittel>
            <Element>Fyll inn fra første dag etter lønnsplikt</Element>
                <DatoIntervallInput
                    erLøpende={erLøpendePermittering}
                    setErLøpende={setErLøpendePermittering}
                    indeksPermitteringsperioder={props.indeks}
                    allePermitteringerOgFraværesPerioder={props.allePermitteringerOgFraværesPerioder}
                    setAllePermitteringerOgFraværesPerioder={props.setAllePermitteringerOgFraværesPerioder}
                    type={'PERMITTERINGSINTERVALL'}
                />
        { props.indeks === props.allePermitteringerOgFraværesPerioder.permitteringer.length -1 &&
        <Knapp className={'kalkulator__legg-til-knapp'} onClick={()=>leggTilNyPermitteringsperiode()}>+ legg til ny permitteringsperiode</Knapp>}
        </div>
    );
};

export default Permitteringsperiode;