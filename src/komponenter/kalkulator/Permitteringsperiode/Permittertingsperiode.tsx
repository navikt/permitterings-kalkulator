import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import '../kalkulator.less';
import './Permitteringsperiode.less';

import { Checkbox } from 'nav-frontend-skjema';
import Datovelger from '../../Datovelger/Datovelger';
import RadioKnappMedMenInputpopUp from './radioKnappOgInput';
import { PermitteringsperiodeInfo } from '../kalkulator';
import { Element, Undertittel } from 'nav-frontend-typografi';

interface Props {
    info: PermitteringsperiodeInfo;
    indeks: number;
    allePermitteringer: PermitteringsperiodeInfo[];
    setAllePermitteringer: (permitteringer: PermitteringsperiodeInfo[]) => void;
}

const Permitteringsperiode: FunctionComponent<Props> = props => {
    const [datoFra, setDatoFra] = useState<Date | undefined>(props.info.datoFra);
    const [datoTil, setDatoTil] = useState<Date | undefined>(props.info.datoTil);
    const [erLøpendePermittering, setErLøpendePermittering] = useState(true)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (props.allePermitteringer.length> props.indeks && props.indeks>0) {
            ref.current?.scrollIntoView({ block: "end"})
        }
    }, [props.info, props.allePermitteringer]);

    const setTilDatoOgOppdaterListe = (dato?: Date) => {
        setDatoTil(dato);
        const kopiAvInfo = [...props.allePermitteringer]
        kopiAvInfo[props.indeks].datoTil = dato;
        props.setAllePermitteringer(kopiAvInfo);
    }


    return (<div className={'permitteringsperiode'} ref={ref}>
            <Undertittel className={'permitteringsperiode__undertittel'}>{props.indeks+1 +'. permitteringsperiode'}</Undertittel>
            <Element>Fyll inn fra første dag etter lønnsplikt</Element>
                <div className={'kalkulator__datovelgere'}>
                    <Datovelger
                        value={datoFra}
                        onChange={event => {
                            setDatoFra(event.currentTarget.value);
                            const kopiAvInfo = [...props.allePermitteringer]
                            kopiAvInfo[props.indeks].datoFra = event.currentTarget.value;
                            props.setAllePermitteringer(kopiAvInfo);
                        }}
                        skalVareFoer={datoTil}
                        overtekst="Fra:"
                    />
                    <div className="skjema-innhold__dato-velger-til">
                        <Datovelger
                            value={datoTil}
                            onChange={event => {
                                setTilDatoOgOppdaterListe(event.currentTarget.value);
                            }}
                            disabled={erLøpendePermittering}
                            overtekst="Til:"
                            skalVareEtter={datoFra}
                        />
                        <Checkbox
                            label="Permittertingen er løpende"
                            checked={erLøpendePermittering}
                            onChange={() => {
                                const oppdaterterLøpendePermittering = !erLøpendePermittering
                                if (oppdaterterLøpendePermittering === true) {
                                    setTilDatoOgOppdaterListe(undefined)
                                }
                                setErLøpendePermittering(oppdaterterLøpendePermittering)
                            } }
                        />
                    </div>
                </div>
            <RadioKnappMedMenInputpopUp
                allePermitteringer={props.allePermitteringer}
                type={'SYKMELDING'}
                indeks={props.indeks}
                setAllePermitteringer={props.setAllePermitteringer}

            />
            <RadioKnappMedMenInputpopUp
                allePermitteringer={props.allePermitteringer}
                type={'PERMISJONOGFERIE'}
                setAllePermitteringer={props.setAllePermitteringer}
                indeks={props.indeks}
            />
        </div>
    );
};

export default Permitteringsperiode;