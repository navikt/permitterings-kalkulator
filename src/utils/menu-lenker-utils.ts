import { Dispatch, SetStateAction } from 'react';
import { seksjoner } from '../komponenter/ContextTypes';

const scrollHeight = (): number => window.scrollY || window.pageYOffset;

const hoppLenkerScrollheight = (): number[] =>
    seksjoner
        .map((section) => document.getElementById(section.id))
        .map((sectionNode) => (sectionNode ? sectionNode.offsetTop : 0));

export const setFocusIndex = (
    setFocusSection: Dispatch<SetStateAction<number>>
): (void | null)[] | null => {
    return seksjoner.length === 5
        ? hoppLenkerScrollheight().map((scrollheight, index) => {
              if (scrollheight - 450 < scrollHeight()) {
                  return setFocusSection(index);
              }
              return null;
          })
        : null;
};
