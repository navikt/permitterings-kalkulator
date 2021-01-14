import React, { useEffect, useState } from 'react';
import './kalkulator.less';

import Banner from '../banner/Banner';
import { antalldagerGått, antallUkerRundetOpp } from './utregninger';
import { Checkbox, Input } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import Datovelger from '../Datovelger/Datovelger';


const Kalkulator = () => {
    const [datoFra, setDatoFra] = useState(new Date());
    const [datoTil, setDatoTil] = useState(undefined);

    const forstePermitteringsDag = new Date();
    const tomorrow = new Date(forstePermitteringsDag)
    tomorrow.setDate(tomorrow.getDate() + 6)
    console.log(antallUkerRundetOpp(24));

    const kjentDatoTil = datoTil ? datoTil : '';

    return (
        <div className={'kalkulator-bakgrunn'}>
            <Banner classname={'banner'} />
            <div className={'kalkulator-container'}>
                <Undertittel>Beregning av arbeidsgiverperiode 2 </Undertittel>
                <div className={'kalkulator__datovelgere'}>
                    <Datovelger
                        value={datoFra.toDateString()}
                        onChange={event => {
                            //context.endreSkjemaVerdi('startDato', event.currentTarget.value);
                            setDatoFra(event.currentTarget.value);
                        }}
                        skalVareFoer={datoTil}
                        overtekst="Fra:"
                    />
                    <div className="skjema-innhold__dato-velger-til">
                        <Datovelger
                            value={kjentDatoTil}
                            onChange={event => {
                                //context.endreSkjemaVerdi('sluttDato', event.currentTarget.value);
                                setDatoTil(event.currentTarget.value);
                            }}
                            //disabled={context.skjema.ukjentSluttDato}
                            overtekst="Til:"
                            skalVareEtter={datoFra}
                        />
                        <Checkbox
                            label="Vet ikke hvor lenge det vil vare"
                            checked={false}

                        />
                    </div>
                </div>
                <div>Antall uker permittert er {antallUkerRundetOpp(antalldagerGått(datoFra, datoTil))}</div>
                <div className={'kalkulator__topp'}>
                <div className={'kalkulator__venstre-kolonne'}>
                    <Input label="Mitt skjemafelt:" />
                    <Input label="Mitt skjemafelt:" />
                    <Input label="Mitt skjemafelt:" />
                </div>
                <div className={'kalkulator__høyre-kolonne'}>
                    <Input label="Mitt skjemafelt:" />
                    <Input label="Mitt skjemafelt:" />
                    <Input label="Mitt skjemafelt:" />
                </div>
                </div>
            </div>
        </div>
    );
};

export default Kalkulator;
