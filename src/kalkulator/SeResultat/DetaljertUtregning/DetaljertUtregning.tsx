import React, { FunctionComponent } from 'react';
import { DatoIntervall, DatoMedKategori } from '../../typer';
import {
    formaterDatoIntervall,
    getOverlappendePeriode,
} from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './DetaljertUtregning.less';
import { Tabell } from './Tabell';
import MobilversjonKort from './MobilversjonKort/MobilversjonKort';
import { getPermitteringsoversikt } from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';

interface Props {
    tidslinje: DatoMedKategori[];
    permitteringsperioder: DatoIntervall[];
    aktuell18mndsperiode: DatoIntervall;
    permitteringsDagerFør1JuliSlettet: boolean;
}

export const DetaljertUtregning: FunctionComponent<Props> = ({
    tidslinje,
    permitteringsperioder,
    aktuell18mndsperiode,
    permitteringsDagerFør1JuliSlettet,
}) => {
    const permitteringsperioderInnenfor18mndsperiode: DatoIntervall[] = permitteringsperioder
        .map((periode) => getOverlappendePeriode(periode, aktuell18mndsperiode))
        .filter((periode) => periode !== undefined) as DatoIntervall[];

    const sumBruktePermitteringsdagerI18mnd = getPermitteringsoversikt(
        tidslinje,
        aktuell18mndsperiode
    ).dagerBrukt;

    const tekstHvisPermitteringFør1JuliErSlettet = permitteringsDagerFør1JuliSlettet
        ? 'Permitteringer før 1. juli er nullstilt og vil derfor ikke vises i oversikten'
        : '';

    return (
        <div className="detaljert-utregning">
            <Element>
                Detaljert utregning for 18-månedersperioden{' '}
                {formaterDatoIntervall(aktuell18mndsperiode)}:
            </Element>
            <Normaltekst>{tekstHvisPermitteringFør1JuliErSlettet}</Normaltekst>
            <div className={'detaljert-utregning__tabellcontainer'}>
                <Tabell
                    permitteringsperioderInnenfor18mndsperiode={
                        permitteringsperioderInnenfor18mndsperiode
                    }
                    tidslinje={tidslinje}
                    sumBruktePermitteringsdagerI18mnd={
                        sumBruktePermitteringsdagerI18mnd
                    }
                />
            </div>
            <div className={'detaljert-utregning__mobilversjon-kort-container'}>
                <MobilversjonKort
                    permitteringsperioderInnenfor18mndsperiode={
                        permitteringsperioderInnenfor18mndsperiode
                    }
                    tidslinje={tidslinje}
                />
                <Element className={'detaljert-utregning__sum'}>
                    Totalt {sumBruktePermitteringsdagerI18mnd} dager
                </Element>
            </div>
        </div>
    );
};
