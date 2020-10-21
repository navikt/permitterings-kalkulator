export interface SanityBlockTypes {
    author: object;
    content: {}[];
    priority: number;
    publishedAt: string;
    title: string;
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
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

export interface NarSkalJegUtbetaleIllustration {
    illustrationAfter: Illustrasjon[];
    illustrationBefore: Illustrasjon[];
    publishedAt: string;
    title: string;
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
}

interface Illustrasjon {
    body: {
        children: Children[];
        markDefs: [];
        style: string;
        _key: string;
        _type: string;
    }[];
    iconImage: {
        asset: {
            _ref: string;
            _type: string;
        };
        _type: string;
    };
    publishedAt: string;
    title: string;
    _key: string;
    _type: string;
}

interface Children {
    marks: [];
    text: string;
    _key: string;
    _type: string;
}
