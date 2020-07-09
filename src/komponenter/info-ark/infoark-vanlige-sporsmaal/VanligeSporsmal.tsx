import React from 'react';
import BEMHelper from '../../../utils/bem';
import VanligeSporsmalHopplenker from './VanligeSporsmalHopplenker';
import { SanityBlockTypes } from '../../../sanity-blocks/sanityTypes';
import SanityInnhold from '../../../sanity-blocks/SanityInnhold';
import Infoseksjon from '../../infoseksjon/Infoseksjon';

interface Props {
    className: string;
    content: SanityBlockTypes[];
}

const VanligeSporsmal = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <Infoseksjon
            className={props.className}
            overskrift="Vanlige spørsmål"
            id="vanligSpr"
        >
            <div className={cls.element('avsnitt')}>
                <VanligeSporsmalHopplenker content={props.content} />
                <SanityInnhold textdocument={props.content} />
            </div>
        </Infoseksjon>
    );
};

export default VanligeSporsmal;
