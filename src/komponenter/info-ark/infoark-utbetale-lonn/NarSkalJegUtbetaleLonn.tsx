import React from 'react';
import BEMHelper from '../../../utils/bem';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';
import HvorLengeSkalJegBetaleLonn from './tekster/HvorLengeSkalJegBetaleLonn';
import DuMaIkkeForskuttereLonn from './tekster/DuMaIkkeForskuttereLonn';
import TilbakebetalingAvUtbetaltLonn from './tekster/TilbakebetalingAvUtbetaltLonn';

interface Props {
    className: string;
}

const NarSkalJegUtbetaleLonn = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('avsnitt')}>
            <Tekstseksjon tittel="Hvor lenge skal jeg betale lønn?">
                <HvorLengeSkalJegBetaleLonn />
            </Tekstseksjon>
            <Tekstseksjon tittel="Du må ikke forskuttere lønn">
                <DuMaIkkeForskuttereLonn />
            </Tekstseksjon>
            <Tekstseksjon tittel="Tilbakebetaling av utbetalt lønn etter 2. permitteringsdag">
                <TilbakebetalingAvUtbetaltLonn />
            </Tekstseksjon>
        </div>
    );
};

export default NarSkalJegUtbetaleLonn;
