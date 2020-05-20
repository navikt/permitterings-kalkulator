import React from 'react';
import BEMHelper from '../../../utils/bem';
import VanligeSporsmalHopplenker from './VanligeSporsmalHopplenker';
import { SanityBlockTypes } from '../../../sanity-blocks/sanityTypes';
import SanityInnhold from '../../../sanity-blocks/SanityInnhold';

interface Props {
    className: string;
    content: SanityBlockTypes[];
}

const VanligeSporsmal = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('avsnitt')}>
            <VanligeSporsmalHopplenker content={props.content} />
            <SanityInnhold textdocument={props.content} />
        </div>
    );
};

export default VanligeSporsmal;
