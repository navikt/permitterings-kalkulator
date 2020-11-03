import React from 'react';
import BEMHelper from '../../../utils/bem';
import {
    SanityBlockTypes,
    NarSkalJegUtbetaleIllustration,
} from '../../../sanity-blocks/sanityTypes';
import SanityInnhold from '../../../sanity-blocks/SanityInnhold';
import Infoseksjon from '../../infoseksjon/Infoseksjon';

interface Props {
    className: string;
    illustrasjon: NarSkalJegUtbetaleIllustration | null;
    content: SanityBlockTypes[];
    contentEtter: SanityBlockTypes[];
    overskrift: string;
    id: string;
}

export type Situasjon = 'before' | 'after';

const NarSkalJegUtbetaleLonn = (props: Props) => {
    const cls = BEMHelper(props.className);

    return (
        <Infoseksjon
            className={props.className}
            overskrift={props.overskrift}
            id={props.id}
        >
            <div className={cls.element('avsnitt')}>
                <SanityInnhold textdocument={props.contentEtter} />
            </div>
        </Infoseksjon>
    );
};

export default NarSkalJegUtbetaleLonn;
