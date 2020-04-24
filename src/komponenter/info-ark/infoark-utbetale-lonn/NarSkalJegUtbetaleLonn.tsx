import React from 'react';
import BEMHelper from '../../../utils/bem';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';
import HvorLengeSkalJegBetaleLonn from './tekster/HvorLengeSkalJegBetaleLonn';
import DuMaIkkeForskuttereLonn from './tekster/DuMaIkkeForskuttereLonn';
import TilbakebetalingAvUtbetaltLonn from './tekster/TilbakebetalingAvUtbetaltLonn';
import UtbetaleLonnIllustrasjon from './Hvor-lenge-skal-jeg-betale/UtbetaleLonnIllustrasjon';

interface Props {
    className: string;
}

const NarSkalJegUtbetaleLonn = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('avsnitt', 'topmodifier')}>
            <Tekstseksjon tittel="Hvor lenge skal jeg betale lønn?">
                <UtbetaleLonnIllustrasjon />
            </Tekstseksjon>
            <Tekstseksjon tittel="Permitteringen starter">
                <HvorLengeSkalJegBetaleLonn />
            </Tekstseksjon>
            <Tekstseksjon tittel="Du må ikke forskuttere lønn for permitteringer som starter fra 20.april">
                <DuMaIkkeForskuttereLonn />
            </Tekstseksjon>
            <Tekstseksjon tittel="Refusjon av utbetalt lønn etter 2. permitteringsdag">
                <TilbakebetalingAvUtbetaltLonn />
            </Tekstseksjon>
        </div>
    );
};

export default NarSkalJegUtbetaleLonn;
