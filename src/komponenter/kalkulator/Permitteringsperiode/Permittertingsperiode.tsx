import React, { FunctionComponent, useEffect, useState } from 'react';
import '../kalkulator.less';
import './Permitteringsperiode.less';

import { antalldagerGått, datoErFørMars } from '../utregninger';
import { Checkbox } from 'nav-frontend-skjema';
import Datovelger from '../../Datovelger/Datovelger';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';
import RadioKnappMedMenInputpopUp from './radioKnappOgInput';
import { PermitteringsperiodeInfo } from '../kalkulator';

interface Props {
    info: PermitteringsperiodeInfo;
    indeks: number;
    allePermitteringer: PermitteringsperiodeInfo[];
    setAllePermitteringer: (permitteringer: PermitteringsperiodeInfo[]) => void;
}

const Permitteringsperiode: FunctionComponent<Props> = props => {
    const [datoFra, setDatoFra] = useState<Date | undefined>(props.info.datoFra);
    const [datoTil, setDatoTil] = useState<Date | undefined>(props.info.datoTil);
    const [erLøpendePermittering, setErLøpendePermittering] = useState(false)
    const [antallDagerBrukt, setAntallDagerBrukt] = useState(0);
    const [agp2Start, setAgp2Start] = useState<Date | undefined>(undefined);

    const indeks =

    useEffect(() => {
        if (erLøpendePermittering) {
            setDatoTil(undefined)
        }
        if (datoFra) {
            const antallDagerGått = antalldagerGått(datoFra, datoTil)
            setAntallDagerBrukt(antallDagerGått);
            const beregnetDato = new Date(datoFra)
            beregnetDato.setDate(beregnetDato.getDate() + 210);
            if (datoErFørMars(beregnetDato)) {
                setAgp2Start(new Date('2021-03-01'))
            }
            else {
                setAgp2Start(beregnetDato)
            }
        }
        const info: PermitteringsperiodeInfo = {
            datoFra:datoFra,
            datoTil:datoTil,
            antallDagerPErmisjonOgFerie: 0,
            antallDagerSykmeldt:0,
        }
        props.allePermitteringer[props.indeks] = info;
    }, [datoFra, datoTil, erLøpendePermittering, props.allePermitteringer]);
    console.log(props.allePermitteringer[0])

    const tekst = 'dager permittert: '+ antallDagerBrukt +
        'Arbeidsgiverperiode 2 starter: ' + skrivOmDato(agp2Start);

    return (<div className={'permitteringsperiode'}>
                <div className={'kalkulator__datovelgere'}>
                    <Datovelger
                        value={datoFra}
                        onChange={event => {
                            setDatoFra(event.currentTarget.value);
                        }}
                        skalVareFoer={datoTil}
                        overtekst="Fra:"
                    />
                    <div className="skjema-innhold__dato-velger-til">
                        <Datovelger
                            value={datoTil}
                            onChange={event => {
                                setDatoTil(event.currentTarget.value);
                            }}
                            disabled={erLøpendePermittering}
                            overtekst="Til:"
                            skalVareEtter={datoFra}
                        />
                        <Checkbox
                            label="Permittertingen er løpende"
                            checked={erLøpendePermittering}
                            onChange={() =>setErLøpendePermittering(!erLøpendePermittering) }

                        />
                    </div>
                </div>
            <RadioKnappMedMenInputpopUp
                spørsmål={"Har den ansatte vært 100 % sykmeldt i denne perioden?"}
            />
            <RadioKnappMedMenInputpopUp
                spørsmål={"Har den ansatte hatt fravær i forbindelse med andre permisjoner eller tatt ut ferie i denne perioden?"}
            />
            <div>{tekst} </div>
        </div>
    );
};

export default Permitteringsperiode;