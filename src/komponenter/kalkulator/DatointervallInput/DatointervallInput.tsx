import React, { FunctionComponent, useContext, useState } from 'react';
import './DatointervallInput.less';
import { DatoIntervall } from '../typer';
import Datovelger from '../../Datovelger/Datovelger';
import { Checkbox } from 'nav-frontend-skjema';
import Lukknapp from 'nav-frontend-lukknapp';
import { Dayjs } from 'dayjs';
import { Element } from 'nav-frontend-typografi';
import ContextProvider, { PermitteringContext } from '../../ContextProvider';
import { formaterDato } from '../utils/dato-utils';

interface Props {
    datoIntervall: Partial<DatoIntervall>;
    setDatoIntervall: (datoIntervall: Partial<DatoIntervall>) => void;
    slettPeriode: () => void;
}

const DatoIntervallInput: FunctionComponent<Props> = (props) => {
    const { datoIntervall, setDatoIntervall } = props;
    const { dagensDato, innføringsdatoAGP2 } = useContext(PermitteringContext);
    const [
        feilmeldingPermitteringForeldet,
        setFeilmeldingPermitteringForeldet,
    ] = useState('');
    const erLøpende = !!datoIntervall.erLøpende;

    const setTilDato = (dato: Dayjs) =>
        setDatoIntervall({
            ...datoIntervall,
            datoTil: dato,
            erLøpende: false,
        });

    const onFraDatoChange = (event: { currentTarget: { value: Dayjs } }) => {
        const velgDatoKnappId = document.getElementById('datofelt-knapp');
        velgDatoKnappId?.focus();
        const eventDato: Dayjs = event.currentTarget.value;
        const grenseDato = dagensDato.isBefore(innføringsdatoAGP2)
            ? innføringsdatoAGP2
            : dagensDato;
        const datoErForGammel = eventDato.isBefore(grenseDato);
        if (datoErForGammel) {
            setFeilmeldingPermitteringForeldet(
                'Fyll inn permitteringsdatoer før ' +
                    formaterDato(grenseDato) +
                    '.'
            );
        } else {
            setFeilmeldingPermitteringForeldet('');
        }

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
            {feilmeldingPermitteringForeldet.length > 0 && (
                <Element
                    className="datointervall-input__feilmelding"
                    aria-live="assertive"
                    aria-label={'feilmelding'}
                >
                    {feilmeldingPermitteringForeldet}
                </Element>
            )}
        </div>
    );
};

export default DatoIntervallInput;
