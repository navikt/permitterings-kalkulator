import {
    Element,
    Ingress,
    Innholdstittel,
    Normaltekst,
    Sidetittel,
    Systemtittel,
    Undertittel,
} from 'nav-frontend-typografi';
import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {
    BlockType,
    EkspanderbartpanelType,
    FargeEditor,
    FargeMerknad,
    FargetTekst,
    Highlighted,
    Iframe,
} from './sanityTypes';
import BlockContent from '@sanity/block-content-to-react';
import { skrivTilMalingVideoBlirSpilt } from '../utils/amplitudeUtils';

export enum TypoStyle {
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    H5 = 'h5',
    H6 = 'h6',
    Normal = 'normal',
}

interface SerializerNodeTypes {
    node:
        | BlockType
        | EkspanderbartpanelType
        | FargeEditor
        | FargetTekst
        | Iframe;
    children: React.ReactElement[] | string[];
    options: {
        imageOptions: {};
    };
}

interface BlockTypeNode extends SerializerNodeTypes {
    node: BlockType;
}

interface IframeNode extends SerializerNodeTypes {
    node: Iframe;
}

interface EkspanderbartPanelNode extends SerializerNodeTypes {
    node: EkspanderbartpanelType;
}

interface FargeTekstNode extends SerializerNodeTypes {
    node: FargetTekst;
}

interface FargeEditorNode extends SerializerNodeTypes {
    node: FargeEditor;
}

const typoComponents = {
    [TypoStyle.H1]: Sidetittel,
    [TypoStyle.H2]: Innholdstittel,
    [TypoStyle.H3]: Systemtittel,
    [TypoStyle.H4]: Undertittel,
    [TypoStyle.H5]: Ingress,
    [TypoStyle.H6]: Element,
    [TypoStyle.Normal]: Normaltekst,
};

const videoSerializer = (iframe: IframeNode) => {
    const url = iframe.node.url;
    return url ? (
        <div className="permittering__video-frame">
            <iframe
                aria-label="video"
                aria-labelledby="Permittering - informasjonsvideo for arbeidsgivere"
                src={url}
                style={{
                    borderRadius: '4px',
                }}
                width="100%"
                height="260"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="Permitteringsvideo for arbeidsgivere"
                onTimeUpdate={skrivTilMalingVideoBlirSpilt}
            />
        </div>
    ) : (
        <div />
    );
};

const ekspanderbartpanelSerializer = (panel: EkspanderbartPanelNode) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <Ekspanderbartpanel tittel={panel.node.overskrift || ''}>
                {panel.node.innhold || ''}
            </Ekspanderbartpanel>
        </div>
    );
};

const fargeEditorSerializer = (panel: FargeEditorNode) => {
    const bakgrunnsfarge: string = panel.node.color
        ? panel.node.color.hex
        : '#ffffff';
    return panel.node.innhold ? (
        <div
            style={{
                backgroundColor: bakgrunnsfarge,
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '4px',
            }}
        >
            {panel.node.innhold.map((block, index) => {
                return (
                    <React.Fragment key={index}>
                        <BlockContent
                            blocks={block}
                            serializers={serializers}
                        />
                    </React.Fragment>
                );
            })}
        </div>
    ) : (
        <div />
    );
};

const fargetTekstSerializer = (fargeTekst: FargeTekstNode) => {
    const bakgrunn: string = fargeTekst.node.farge
        ? fargeTekst.node.farge.hex
        : '#ffffff';
    return (
        <div
            style={{
                backgroundColor: bakgrunn,
                padding: '1rem',
                borderRadius: '3px',
            }}
        >
            {fargeTekst.node.innhold}
        </div>
    );
};

const whitespace = (innhold: BlockTypeNode): React.ReactElement => (
    <>
        {blockSerializer(innhold)}
        <br />
    </>
);

const blockSerializer = (block: BlockTypeNode) => {
    const TypoComponent =
        typoComponents[block.node.style] || typoComponents[TypoStyle.Normal];
    return <TypoComponent>{block.children}</TypoComponent>;
};

const imageSerializer = (props: any) => (
    <img src={sanityImageLink(props.node.asset._ref)} alt={'illustrasjon'} />
);

export let env = ['', ''];
export const setEnv = (item: string[]) => (env = item);

export const sanityImageLink = (imageId: string) => {
    const imageFragments = imageId.split('-');
    return `https://cdn.sanity.io/images/${env[0]}/${
        env[1]
    }/${imageFragments[1]
        .concat('-')
        .concat(imageFragments[2])
        .concat('.')
        .concat(imageFragments[3])}`;
};

const serializeCheck = (block: BlockTypeNode) => {
    return block.children[block.children.length - 1] !== ''
        ? blockSerializer(block)
        : whitespace(block);
};

export const serializers = {
    types: {
        block: serializeCheck,
        image: imageSerializer,
        ekspanderbartpanel: ekspanderbartpanelSerializer,
        fargetTekst: fargetTekstSerializer,
        fargeEditor: fargeEditorSerializer,
        iframe: videoSerializer,
    },
    marks: {
        highlightGreen: (props: Highlighted) => (
            <span style={{ backgroundColor: '#CDE7D8' }}>{props.children}</span>
        ),
        color: (props: FargeMerknad) => {
            const farge = props.mark ? props.mark.hex : '#ffffff';
            return (
                <span style={{ backgroundColor: farge }}>{props.children}</span>
            );
        },
    },
};
