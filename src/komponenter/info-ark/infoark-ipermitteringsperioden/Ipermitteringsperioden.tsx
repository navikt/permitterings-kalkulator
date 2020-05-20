import React from 'react';
import BEMHelper from '../../../utils/bem';
import { SanityBlockTypes } from '../../../sanity-blocks/sanityTypes';
import SanityInnhold from '../../../sanity-blocks/SanityInnhold';

interface Props {
    className: string;
    content: SanityBlockTypes[];
}

const Ipermitteringsperioden = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('avsnitt')}>
            <SanityInnhold textdocument={props.content} />
        </div>
    );
};

export default Ipermitteringsperioden;
