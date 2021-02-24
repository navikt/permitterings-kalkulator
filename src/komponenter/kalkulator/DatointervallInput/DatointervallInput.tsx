import React, { FunctionComponent } from 'react';
import './DatointervallInput.less';
import { ARBEIDSGIVERPERIODE2DATO, DatoIntervall } from '../kalkulator';
import Datovelger from '../../Datovelger/Datovelger';
import { Radio } from 'nav-frontend-skjema';

interface Props {
    datoIntervall: DatoIntervall;
    setDatoIntervall: (datoIntervall: DatoIntervall) => void;
    erLøpendeLabel: string;
}

const DatoIntervallInput: FunctionComponent<Props> = (props) => {
    const { datoIntervall, setDatoIntervall, erLøpendeLabel } = props;
    const erLøpende = !!datoIntervall.erLøpende;

    const setErLøpende = (løpende: boolean) => {
        setDatoIntervall({
            ...datoIntervall,
            erLøpende: løpende,
        });
    };

    const setTilDato = (dato: Date) =>
        setDatoIntervall({
            ...datoIntervall,
            datoTil: dato,
        });

    return (
        <div className={'kalkulator__datovelgere'}>
            <Datovelger
                value={datoIntervall.datoFra}
                onChange={(event) =>
                    setDatoIntervall({
                        ...datoIntervall,
                        datoFra: event.currentTarget.value,
                    })
                }
                skalVareFoer={datoIntervall.datoTil}
                overtekst="Første dag"
            />
            <div className="skjema-innhold__dato-velger-til">
                <Datovelger
                    value={datoIntervall.datoTil}
                    onChange={(event) => setTilDato(event.currentTarget.value)}
                    disabled={erLøpende}
                    overtekst="Siste dag"
                    skalVareEtter={datoIntervall.datoFra}
                />
            </div>

            <Radio
                className={'kalkulator__datovelgere-checkbox'}
                label={erLøpendeLabel}
                checked={datoIntervall.erLøpende}
                name={erLøpendeLabel}
                onChange={() => {
                    const nyStatus = !erLøpende;
                    setErLøpende(!erLøpende);
                    if (nyStatus) {
                        setTilDato(ARBEIDSGIVERPERIODE2DATO);
                    }
                }}
            />
        </div>
    );
};

export default DatoIntervallInput;
