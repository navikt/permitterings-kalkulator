import React, { FunctionComponent } from 'react';
import { DatoIntervall, DatoMedKategori } from '../../typer';
import 'nav-frontend-tabell-style';
import {
    antallDagerGått,
    formaterDatoIntervall,
    getOverlappendePeriode,
} from '../../utils/dato-utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './DetaljertUtregning.less';
import { Tabell } from './Tabell';
import MobilversjonKort from './MobilversjonKort/MobilversjonKort';

interface Props {
    tidslinje: DatoMedKategori[];
    permitteringsperioder: DatoIntervall[];
    aktuell18mndsperiode: DatoIntervall;
}

export const DetaljertUtregning: FunctionComponent<Props> = ({
    tidslinje,
    permitteringsperioder,
    aktuell18mndsperiode,
}) => {
    const permitteringsperioderInnenfor18mndsperiode: DatoIntervall[] = permitteringsperioder
        .map((periode) => getOverlappendePeriode(periode, aktuell18mndsperiode))
        .filter((periode) => periode !== undefined) as DatoIntervall[];

    let sumBruktePermitteringsdager = 0;
    permitteringsperioder.forEach(
        (periode) =>
            (sumBruktePermitteringsdager += antallDagerGått(
                periode.datoFra,
                periode.datoTil
            ))
    );

    return (
        <div className="detaljert-utregning">
            <Normaltekst>
                Detaljert utregning for 18-månedsperioden{' '}
                {formaterDatoIntervall(aktuell18mndsperiode)}
            </Normaltekst>
            <div className={'detaljert-utregning__tabellcontainer'}>
                <Tabell
                    permitteringsperioderInnenfor18mndsperiode={
                        permitteringsperioderInnenfor18mndsperiode
                    }
                    tidslinje={tidslinje}
                />
            </div>
            <div className={'detaljert-utregning__mobilversjon-kort-container'}>
                <MobilversjonKort
                    permitteringsperioderInnenfor18mndsperiode={
                        permitteringsperioderInnenfor18mndsperiode
                    }
                    tidslinje={tidslinje}
                />
            </div>
            <Element className={'detaljert-utregning__sum'}>
                Totalt {sumBruktePermitteringsdager}
            </Element>
        </div>
    );
};
