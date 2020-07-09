import React from 'react';
import BEMHelper from '../../../utils/bem';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';
import UtbetaleLonnIllustrasjon from './Hvor-lenge-skal-jeg-betale/UtbetaleLonnIllustrasjon';
import { SanityBlockTypes } from '../../../sanity-blocks/sanityTypes';
import SanityInnhold from '../../../sanity-blocks/SanityInnhold';
import Infoseksjon from '../../infoseksjon/Infoseksjon';

interface Props {
    className: string;
    content: SanityBlockTypes[];
}

const NarSkalJegUtbetaleLonn = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <Infoseksjon
            className={props.className}
            overskrift="Når skal jeg utbetale lønn?"
            id="narSkalJegUtbetaleLonn"
        >
            <div className={cls.element('avsnitt', 'topmodifier')}>
                <Tekstseksjon tittel="Hvor lenge skal jeg betale lønn?">
                    <UtbetaleLonnIllustrasjon />
                </Tekstseksjon>
                <SanityInnhold textdocument={props.content} />
            </div>
        </Infoseksjon>
    );
};

export default NarSkalJegUtbetaleLonn;
