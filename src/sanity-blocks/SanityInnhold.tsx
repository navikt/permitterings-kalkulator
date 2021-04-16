import React from 'react';
import { SanityBlockTypes } from './sanityTypes';
import SanityBlocktype from './SanityBlocktype';
import Tekstseksjon from '../komponenter/infoseksjon/Tekstseksjon';

interface Props {
    textdocument: SanityBlockTypes[];
}

const SanityInnhold = (props: Props) => {
    return (
        <>
            {props.textdocument.length > 0
                ? props.textdocument.map(
                      (element: SanityBlockTypes, index: number) => {
                          return (
                              <Tekstseksjon
                                  tittel={element.title}
                                  id={element._id}
                                  key={index}
                              >
                                  <SanityBlocktype content={element} />
                              </Tekstseksjon>
                          );
                      }
                  )
                : null}
        </>
    );
};

export default SanityInnhold;
