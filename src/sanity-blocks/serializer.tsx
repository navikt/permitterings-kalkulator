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
import { ReactComponent as Veileder } from '../assets/ikoner/veileder.svg';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {
    BlockType,
    EkspanderbartpanelType,
    FargeEditor,
    FargeMerknad,
    FargetTekst,
    Highlighted,
    Iframe,
    EnkeltKnapp,
    LesMerType,
    VeilederPanelType,
    KnappeParType,
    AlertstripePanelType,
} from './sanityTypes';
import BlockContent from '@sanity/block-content-to-react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { skrivTilMalingVideoBlirSpilt } from '../utils/amplitudeUtils';
import KnappBase from 'nav-frontend-knapper';
import AlertStripe from 'nav-frontend-alertstriper';

export enum TypoStyle {
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    H5 = 'h5',
    H6 = 'h6',
    Normal = 'normal',
}

type VeilederPanelFargeTema =
    | 'normal'
    | 'info'
    | 'suksess'
    | 'advarsel'
    | 'feilmelding';

type KnappBaseType = 'standard' | 'hoved' | 'fare' | 'flat';

interface SerializerNodeTypes {
    node:
        | BlockType
        | EkspanderbartpanelType
        | FargeEditor
        | FargetTekst
        | Iframe
        | VeilederPanelType
        | LesMerType
        | EnkeltKnapp
        | KnappeParType
        | AlertstripePanelType;
    children: React.ReactElement[] | string[];
    options: {
        imageOptions: {};
    };
}

interface LesMerNode extends SerializerNodeTypes {
    node: LesMerType;
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

interface VeilederPanelNode extends SerializerNodeTypes {
    node: VeilederPanelType;
}

interface KnappNode extends SerializerNodeTypes {
    node: EnkeltKnapp;
}

interface KnappeParNode extends SerializerNodeTypes {
    node: KnappeParType;
}

interface AlertTypeNode extends SerializerNodeTypes {
    node: AlertstripePanelType;
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

const veilederpanelSerializer = (panel: VeilederPanelNode) => {
    const kompakt = panel.node.kompakt;
    const plakat = panel.node.plakat;
    const plakatType = plakat ? 'plakat' : 'normal';
    const fargetema = panel.node.paneltype ? panel.node.paneltype[0] : 'normal';
    return panel.node.innhold ? (
        <div>
            <Veilederpanel
                svg={<Veileder />}
                kompakt={kompakt}
                type={plakatType}
                fargetema={fargetema as VeilederPanelFargeTema}
            >
                {panel.node.innhold.map((block: any, index: any) => {
                    return (
                        <React.Fragment key={index}>
                            <BlockContent
                                blocks={block}
                                serializers={serializers}
                            />
                        </React.Fragment>
                    );
                })}
            </Veilederpanel>
        </div>
    ) : (
        <div />
    );
};

const alertstripeSerializer = (alert: AlertTypeNode) => {
    const type = alert.node.alerttype[0];
    return (
        <AlertStripe
            type={
                type === 'info'
                    ? 'info'
                    : type === 'suksess'
                    ? 'suksess'
                    : type === 'feil'
                    ? 'feil'
                    : 'advarsel'
            }
        >
            {alert.node.innhold.map((block: any, index: any) => {
                return (
                    <React.Fragment key={index}>
                        <BlockContent
                            blocks={block}
                            serializers={serializers}
                        />
                    </React.Fragment>
                );
            })}
        </AlertStripe>
    );
};

const lesmerSerializer = (panel: LesMerNode) => {
    return panel.node.innhold ? (
        <Lesmerpanel
            style={{ paddingTop: '0' }}
            intro={panel.node.introduksjonstekst || ''}
            apneTekst={panel.node.apnetekst || ''}
            lukkTekst={panel.node.lukktekst || ''}
        >
            {getBlockContentFromList(panel.node.innhold)}
        </Lesmerpanel>
    ) : (
        <div />
    );
};

interface KnappProps {
    type: KnappBaseType;
    url: string;
    tekst: string;
}

const GetKnapp = (props: KnappProps) => {
    return (
        <KnappBase
            style={{
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}
            type={props.type}
            onClick={() => (window.location.href = props.url)}
        >
            {props.tekst}
        </KnappBase>
    );
};

const getButtonValues = (value: any, objectKey: string): KnappProps => {
    const tekst = value.node[objectKey].tekst || '';
    const url = value.node[objectKey].url || '';
    const type = value.node[objectKey].buttontype
        ? (value.node[objectKey].buttontype[0] as KnappBaseType)
        : 'standard';

    return { type, url, tekst };
};

const enkeltknappSerializer = (props: KnappNode) => {
    const knapp = getButtonValues(props, 'knappen');
    return <>{GetKnapp({ ...knapp })}</>;
};

const knapperSerializer = (props: KnappeParNode) => {
    const knapp = getButtonValues(props, 'knappen');
    const knappTo = getButtonValues(props, 'knappto');
    return (
        <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
            <div style={{ marginRight: '1rem' }}>{GetKnapp({ ...knapp })}</div>
            <div>{GetKnapp({ ...knappTo })}</div>
        </div>
    );
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
            {getBlockContentFromList(panel.node.innhold)}
        </div>
    ) : (
        <div />
    );
};

const getBlockContentFromList = (node: BlockType[]) => (
    <>
        {node.map((block, index) => {
            return (
                <React.Fragment key={index}>
                    <BlockContent blocks={block} serializers={serializers} />
                </React.Fragment>
            );
        })}
    </>
);

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
        knapper: knapperSerializer,
        enkeltknapp: enkeltknappSerializer,
        veilederpanel: veilederpanelSerializer,
        lesmer: lesmerSerializer,
        block: serializeCheck,
        image: imageSerializer,
        ekspanderbartpanel: ekspanderbartpanelSerializer,
        fargetTekst: fargetTekstSerializer,
        fargeEditor: fargeEditorSerializer,
        iframe: videoSerializer,
        alertstripe: alertstripeSerializer,
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
