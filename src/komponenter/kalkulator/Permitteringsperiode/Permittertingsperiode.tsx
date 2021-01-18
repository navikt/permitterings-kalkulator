import React, { useEffect, useState } from 'react';
import '../kalkulator.less';

import { antalldagerGått, datoErFørMars } from '../utregninger';
import { Checkbox } from 'nav-frontend-skjema';
import Datovelger from '../../Datovelger/Datovelger';
import { skrivOmDato } from '../../Datovelger/datofunksjoner';


const Permitteringsperiode = () => {
    const [datoFra, setDatoFra] = useState(new Date());
    const [datoTil, setDatoTil] = useState(undefined);
    const [erLøpendePermittering, setErLøpendePermittering] = useState(false)
    const [antallDagerBrukt, setAntallDagerBrukt] = useState(0);
    const [agp2Start, setAgp2Start] = useState<Date | undefined>(undefined);

    const kjentDatoTil = datoTil ? datoTil : '';

    useEffect(() => {
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

    }, [datoFra, datoTil]);

    const tekst = 'dager permittert: '+ antallDagerBrukt +
        'Arbeidsgiverperiode 2 starter: ' + skrivOmDato(agp2Start);

    return (<>
                <div className={'kalkulator__datovelgere'}>
                    <Datovelger
                        value={datoFra.toDateString()}
                        onChange={event => {
                            setDatoFra(event.currentTarget.value);
                        }}
                        skalVareFoer={datoTil}
                        overtekst="Fra:"
                    />
                    <div className="skjema-innhold__dato-velger-til">
                        <Datovelger
                            value={kjentDatoTil}
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
                <div>{tekst} </div>
        </>
    );
};

export default Permitteringsperiode;
