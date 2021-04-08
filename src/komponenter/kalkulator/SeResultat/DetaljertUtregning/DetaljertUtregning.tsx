import React, { FunctionComponent } from 'react';
import { DatoIntervall, DatoMedKategori } from '../../typer';
import 'nav-frontend-tabell-style';
import {
    formaterDatoIntervall,
    getOverlappendePeriode,
} from '../../utils/dato-utils';
import { Normaltekst } from 'nav-frontend-typografi';
import './DetaljertUtregning.less';
import { Tabell } from './Tabell';

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

    return (
        <div className="detaljert-utregning">
            <Normaltekst>
                Detaljert utregning for 18-månedsperioden{' '}
                {formaterDatoIntervall(aktuell18mndsperiode)}
            </Normaltekst>
            <Tabell
                tidslinje={tidslinje}
                aktuell18mndsperiode={aktuell18mndsperiode}
                permitteringsperioder={permitteringsperioder}
            />
        </div>
    );
};
