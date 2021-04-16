import React from 'react';
import BEMHelper from '../../utils/bem';
import KnappBase from 'nav-frontend-knapper';
import Tekstseksjon from '../infoseksjon/Tekstseksjon';
import { skrivTilMalingBesokerSideGaTilSkjema } from '../../utils/amplitudeUtils';
import { SanityBlockTypes } from '../../sanity-blocks/sanityTypes';
import SanityBlocktype from '../../sanity-blocks/SanityBlocktype';
import Infoseksjon from '../infoseksjon/Infoseksjon';

interface Props {
    className: string;
    content: SanityBlockTypes[];
    navn: string;
    id: string;
}

const id = [
    'meld-fra-til-nav',
    'send-permitteringsvarsel',
    'Du-bor-oppfordre-de-ansatte',
    'Aordningen',
];

const PermittereAnsatte = (props: Props) => {
    const cls = BEMHelper(props.className);

    const gatilSoknad = () => {
        skrivTilMalingBesokerSideGaTilSkjema();
        window.location.href =
            'https://www.nav.no/soknader/nb/bedrift/permitteringer-oppsigelser-og-konkurs/masseoppsigelser';
    };

    const leggTilSoknadInngang = (index: number): React.ReactNode | null => {
        return index === 0 ? (
            <div className={cls.element('knapp-seksjon')}>
                <KnappBase
                    aria-label="Gå til søknaden"
                    onClick={() => gatilSoknad()}
                >
                    Meld ifra
                </KnappBase>
            </div>
        ) : null;
    };

    return (
        <Infoseksjon
            className={props.className}
            overskrift={props.navn}
            id={props.id}
        >
            <div className={cls.element('avsnitt')}>
                {props.content.length > 0
                    ? props.content.map(
                          (element: SanityBlockTypes, index: number) => {
                              return (
                                  <div key={index}>
                                      <Tekstseksjon
                                          tittel={element.title}
                                          id={id[index]}
                                      >
                                          <SanityBlocktype content={element} />
                                      </Tekstseksjon>
                                      {leggTilSoknadInngang(index)}
                                  </div>
                              );
                          }
                      )
                    : null}
            </div>
        </Infoseksjon>
    );
};

export default PermittereAnsatte;
