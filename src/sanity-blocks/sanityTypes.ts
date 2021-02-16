import { PermitteringInnhold } from '../komponenter/ContextTypes';

export interface SanityBlockTypes {
    author: object;
    content: Context[];
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

interface Context {
    children: Children[];
    markDefs: [];
    style: string;
    _key: string;
    _type: string;
}

interface Children {
    marks: [];
    text: string;
    _key: string;
    _type: string;
}
