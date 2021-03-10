import React, { FunctionComponent } from 'react';
import './DatointervallInput.less';
import { DatoIntervall } from '../typer';
import { ARBEIDSGIVERPERIODE2DATO, finn1DagFram } from '../utregninger';
import Datovelger from '../../Datovelger/Datovelger';
import { Checkbox } from 'nav-frontend-skjema';
import Lukknapp from 'nav-frontend-lukknapp';
import dayjs from 'dayjs';

interface Props {
    datoIntervall: DatoIntervall;
    setDatoIntervall: (datoIntervall: DatoIntervall) => void;
    erLøpendeLabel: string;
    slettPeriode: () => void;
}

const DatoIntervallInput: FunctionComponent<Props> = (props) => {
    const { datoIntervall, setDatoIntervall, erLøpendeLabel } = props;
    const erLøpende = !!datoIntervall.erLøpende;

    const setTilDato = (dato: Date) =>
        setDatoIntervall({
            ...datoIntervall,
            datoTil: dato,
        });

    const onFraDatoChange = (event: any) => {
        const eventDato: Date = event.currentTarget.value;

        const nyttDatoIntervall = !!datoIntervall.datoTil
            ? {
                  datoFra: eventDato,
              }
            : {
                  datoFra: eventDato,
                  datoTil: finn1DagFram(eventDato),
              };

        setDatoIntervall({
            ...datoIntervall,
            ...nyttDatoIntervall,
        });
    };

    const onErLøpendeChange = () => {
        const nyState = erLøpende
            ? {
                  erLøpende: false,
              }
            : {
                  erLøpende: true,
                  datoTil: ARBEIDSGIVERPERIODE2DATO,
              };
        setDatoIntervall({
            ...datoIntervall,
            ...nyState,
        });
    };

    return (
        <div className="datointervall-input">
            <div className="datointervall-input__dato-wrapper">
                <Datovelger
                    className="datointervall-input__datoinput"
                    value={dayjs(datoIntervall.datoFra)}
                    onChange={onFraDatoChange}
                    skalVareFoer={dayjs(datoIntervall.datoTil)}
                    overtekst="Første dag"
                />
                <Datovelger
                    className="datointervall-input__datoinput"
                    value={
                        datoIntervall.datoTil && dayjs(datoIntervall.datoTil)
                    }
                    onChange={(event) =>
                        setTilDato(event.currentTarget.value.toDate())
                    }
                    disabled={erLøpende}
                    overtekst="Siste dag"
                    skalVareEtter={dayjs(datoIntervall.datoFra)}
                />
            </div>
            <Checkbox
                className="datointervall-input__checkbox"
                label={erLøpendeLabel}
                checked={erLøpende}
                name={erLøpendeLabel}
                onChange={onErLøpendeChange}
            />
            <Lukknapp
                className="datointervall-input__slett-knapp"
                onClick={props.slettPeriode}
            />
        </div>
    );
};

export default DatoIntervallInput;
