import React from 'react';
import BlockContent from '@sanity/block-content-to-react';
import { serializers } from './serializer';
import { SanityBlockTypes } from './sanityTypes';

interface Props {
    content: SanityBlockTypes;
}

const SanityBlocktype = (textblock: Props) => {
    return (
        <>
            <BlockContent
                blocks={textblock.content.content}
                serializers={serializers}
            />
        </>
    );
};

export default SanityBlocktype;
