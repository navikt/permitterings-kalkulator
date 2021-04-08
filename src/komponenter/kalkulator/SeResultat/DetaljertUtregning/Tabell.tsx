import React, { FunctionComponent } from 'react';
import UtregningAvEnkeltPeriode from './UtregningAvEnkeltPeriode/UtregningAvEnkeltPeriode';
import { DatoIntervall, DatoMedKategori } from '../../typer';
import { getPermitteringsoversikt } from '../../utils/beregningerForAGP2';
import {
    formaterDatoIntervall,
    getOverlappendePeriode,
} from '../../utils/dato-utils';
import { Normaltekst } from 'nav-frontend-typografi';
import './DetaljertUtregning.less';

interface Props {
    tidslinje: DatoMedKategori[];
    permitteringsperioderInnenfor18mndsperiode: DatoIntervall[];
}

export const Tabell: FunctionComponent<Props> = ({
    tidslinje,
    permitteringsperioderInnenfor18mndsperiode,
}) => {
    return (
        <table className="tabell">
            <thead>
                <tr>
                    <th>Permitteringsperiode</th>
                    <th>Lengde permittering</th>
                    <th>Fravær</th>
                    <th>Permittering u/fravær</th>
                </tr>
            </thead>
            <tbody>
                {permitteringsperioderInnenfor18mndsperiode.map(
                    (periode, index) => (
                        <UtregningAvEnkeltPeriode
                            key={index}
                            permitteringsperiode={periode}
                            permitteringsoversikt={getPermitteringsoversikt(
                                tidslinje,
                                periode
                            )}
                            permitteringsnr={index + 1}
                        />
                    )
                )}
            </tbody>
        </table>
    );
};
