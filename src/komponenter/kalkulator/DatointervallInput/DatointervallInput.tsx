import React, { FunctionComponent } from 'react';
import './DatointervallInput.less';
import { DatoIntervall } from '../typer';
import Datovelger from '../../Datovelger/Datovelger';
import { Checkbox } from 'nav-frontend-skjema';
import Lukknapp from 'nav-frontend-lukknapp';
import { Dayjs } from 'dayjs';
import AlertStripe from 'nav-frontend-alertstriper';

interface Props {
    datoIntervall: Partial<DatoIntervall>;
    setDatoIntervall: (datoIntervall: Partial<DatoIntervall>) => void;
    slettPeriode: () => void;
    advarsel: string;
}

const DatoIntervallInput: FunctionComponent<Props> = (props) => {
    const { datoIntervall, setDatoIntervall } = props;
    const erLøpende = !!datoIntervall.erLøpende;

    const setTilDato = (dato: Dayjs) =>
        setDatoIntervall({
            ...datoIntervall,
            datoTil: dato,
            erLøpende: false,
        });

    const onFraDatoChange = (event: { currentTarget: { value: Dayjs } }) => {
        const eventDato: Dayjs = event.currentTarget.value;
        if (!datoIntervall.datoTil && !datoIntervall.erLøpende) {
            setDatoIntervall({
                datoFra: eventDato,
                datoTil: eventDato.add(1, 'day'),
                erLøpende: false,
            });
        } else {
            setDatoIntervall({
                ...datoIntervall,
                datoFra: eventDato,
            });
        }
    };

    const onErLøpendeChange = () => {
        if (erLøpende) {
            setDatoIntervall({
                ...datoIntervall,
                erLøpende: false,
            });
        } else {
            setDatoIntervall({
                ...datoIntervall,
                erLøpende: true,
                datoTil: undefined,
            });
        }
    };

    return (
        <div className="datointervall-input">
            <div className="datointervall-input__dato-wrapper">
                <Datovelger
                    className="datointervall-input__datoinput"
                    value={datoIntervall.datoFra}
                    onChange={onFraDatoChange}
                    skalVareFoer={datoIntervall.datoTil}
                    overtekst="Første dag"
                />
                <Datovelger
                    className="datointervall-input__datoinput"
                    value={datoIntervall.datoTil}
                    onChange={(event) => setTilDato(event.currentTarget.value)}
                    disabled={erLøpende}
                    overtekst="Siste dag"
                    skalVareEtter={datoIntervall.datoFra}
                />
            </div>
            <Checkbox
                className="datointervall-input__checkbox"
                label="Ingen sluttdato"
                checked={erLøpende}
                onChange={onErLøpendeChange}
            />
            <Lukknapp
                className="datointervall-input__slett-knapp"
                aria-label="Slett periode"
                onClick={props.slettPeriode}
            />
            {props.advarsel.length > 0 && (
                <AlertStripe
                    type="advarsel"
                    form="inline"
                    className="datointervall-input__advarsel"
                    aria-live="polite"
                    aria-label="Advarsel"
                >
                    {props.advarsel}
                </AlertStripe>
            )}
        </div>
    );
};

export default DatoIntervallInput;
