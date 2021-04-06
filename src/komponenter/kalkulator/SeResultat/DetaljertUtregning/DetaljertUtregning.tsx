import React, { FunctionComponent } from 'react';
import UtregningAvEnkeltPeriode from './UtregningAvEnkeltPeriode/UtregningAvEnkeltPeriode';
import dayjs from 'dayjs';

export const DetaljertUtregning: FunctionComponent = () => {
    return (
        <div>
            detaljert utregning
            <UtregningAvEnkeltPeriode
                permitteringsperiode={{
                    datoFra: dayjs('2021-02-20'),
                    datoTil: dayjs('2021-02-21'),
                }}
                permitteringsoversikt={{
                    dagerBrukt: 30,
                    dagerPermittert: 50,
                    dagerAnnetFravær: 20,
                }}
                permitteringsnr={2}
            />
        </div>
    );
};
