import { PermitteringInnhold } from '../komponenter/ContextTypes';
import { TypoStyle } from './serializer';

export interface SanityBlockTypes {
    author: object;
    content: ContentType[];
    priority: number;
    publishedAt: string;
    title: string;
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: keyof PermitteringInnhold;
    _updatedAt: string;
}

export interface SistOppdatert {
    publishedAt: string;
    title: string;
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
}

type ContentType = BlockType | EkspanderbartpanelType | FargetTekst;

interface CommonContentType {
    _key: string;
    _type: string;
}

export interface BlockType extends CommonContentType {
    children: Children[];
    markDefs: {}[];
    style: TypoStyle;
}

export interface EkspanderbartpanelType extends CommonContentType {
    overskrift: string;
    innhold: string;
}

export interface FargeEditor extends CommonContentType {
    color: Farge | undefined;
    innhold: BlockType[];
}

export interface FargetTekst extends CommonContentType {
    farge: Farge | undefined;
    innhold: string;
}

export interface FargeMerknad extends CommonContentType {
    children: string[];
    mark: Farge | undefined;
}

export interface Highlighted extends CommonContentType {
    children: string[];
    mark: string;
    markKey: string;
}

export interface Children extends CommonContentType {
    marks: [];
    text: string;
}

interface Farge {
    _type: string;
    alpha: number;
    hex: string;
    rgb: {
        _type: string;
        a: number;
        r: number;
        g: number;
        b: number;
    };
}
