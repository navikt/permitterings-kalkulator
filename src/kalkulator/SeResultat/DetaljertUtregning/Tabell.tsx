import React, { FunctionComponent } from 'react';
import UtregningAvEnkeltPeriodeITabell from './UtregningAvEnkeltPeriodeITabell/UtregningAvEnkeltPeriodeITabell';
import { DatoIntervall, DatoMedKategori } from '../../typer';
import { Element } from 'nav-frontend-typografi';
import 'nav-frontend-tabell-style';
import { getPermitteringsoversikt } from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';

interface Props {
    tidslinje: DatoMedKategori[];
    permitteringsperioderInnenfor18mndsperiode: DatoIntervall[];
    sumBruktePermitteringsdagerI18mnd: number;
}

export const Tabell: FunctionComponent<Props> = ({
    tidslinje,
    permitteringsperioderInnenfor18mndsperiode,
    sumBruktePermitteringsdagerI18mnd,
}) => {
    return (
        <table className="tabell">
            <thead>
                <tr>
                    <th>Permitteringsperiode</th>
                    <th>Permittert</th>
                    <th>Fravær</th>
                    <th>Permittert u/fravær</th>
                </tr>
            </thead>
            <tbody>
                {permitteringsperioderInnenfor18mndsperiode.map(
                    (periode, index) => (
                        <UtregningAvEnkeltPeriodeITabell
                            key={index}
                            permitteringsperiode={periode}
                            permitteringsoversikt={getPermitteringsoversikt(
                                tidslinje,
                                periode
                            )}
                        />
                    )
                )}
                <tr>
                    <td />
                    <td />
                    <td />
                    <td>
                        <Element>
                            Totalt {sumBruktePermitteringsdagerI18mnd} dager
                        </Element>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
