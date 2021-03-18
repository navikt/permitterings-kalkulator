import { Dispatch, SetStateAction } from 'react';
import { PermitteringInnhold } from '../komponenter/ContextTypes';

export interface PermitteringsLenke {
    id: keyof PermitteringInnhold;
    navn: string;
}

export const lenker: PermitteringsLenke[] = [
    {
        id: 'hvordanPermittere',
        navn: 'Hvordan permittere ansatte?',
    },
    {
        id: 'narSkalJegUtbetale',
        navn: 'Lønnsplikt ved permittering',
    },
    {
        id: 'iPermitteringsperioden',
        navn: 'I permitteringsperioden',
    },
    {
        id: 'informasjonTilAnsatte',
        navn: 'Informasjon til ansatte',
    },
    {
        id: 'vanligeSpr',
        navn: 'Vanlige spørsmål',
    },
];

const scrollHeight = (): number => window.scrollY || window.pageYOffset;

const hoppLenkerScrollheight = (): number[] =>
    lenker
        .map((section) => document.getElementById(section.id))
        .map((sectionNode) => (sectionNode ? sectionNode.offsetTop : 0));

export const setFocusIndex = (
    setFocusSection: Dispatch<SetStateAction<number>>
): (void | null)[] | null => {
    return lenker.length === 5
        ? hoppLenkerScrollheight().map((scrollheight, index) => {
              if (scrollheight - 450 < scrollHeight()) {
                  return setFocusSection(index);
              }
              return null;
          })
        : null;
};
