import React from 'react';
import BEMHelper from '../../../utils/bem';
import { SanityBlockTypes } from '../../../sanity-blocks/sanityTypes';
import SanityInnhold from '../../../sanity-blocks/SanityInnhold';
import Infoseksjon from '../../infoseksjon/Infoseksjon';

interface Props {
    className: string;
    content: SanityBlockTypes[];
}

const Ipermitteringsperioden = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <Infoseksjon
            className={props.className}
            overskrift="I permitteringsperioden"
            id="permitteringsperioden"
        >
            <div className={cls.element('avsnitt')}>
                <SanityInnhold textdocument={props.content} />
            </div>
        </Infoseksjon>
    );
};

export default Ipermitteringsperioden;
