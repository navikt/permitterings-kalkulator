import { Dispatch, SetStateAction } from 'react';

export interface PermitteringsLenke {
    hopplenke: string;
    lenketekst: string;
}

export const lenker: PermitteringsLenke[] = [
    {
        hopplenke: '#hvordanPermittere',
        lenketekst: 'Hvordan permittere ansatte?',
    },
    {
        hopplenke: '#narSkalJegUtbetaleLonn',
        lenketekst: 'Lønnsplikt ved permittering',
    },
    {
        hopplenke: '#permitteringsperioden',
        lenketekst: 'I permitteringsperioden',
    },
    {
        hopplenke: '#vanligSpr',
        lenketekst: 'Vanlige spørsmål',
    },
];

const scrollHeight = (): number => window.scrollY || window.pageYOffset;

const hoppLenkerScrollheight = (): number[] =>
    lenker
        .map((section) => document.getElementById(section.hopplenke.slice(1)))
        .map((sectionNode) => (sectionNode ? sectionNode.offsetTop : 0));

export const setFocusIndex = (
    setFocusSection: Dispatch<SetStateAction<number>>
): (void | null)[] | null => {
    return lenker.length === 4
        ? hoppLenkerScrollheight().map((scrollheight, index) => {
              if (scrollheight - 450 < scrollHeight()) {
                  return setFocusSection(index);
              }
              return null;
          })
        : null;
};
