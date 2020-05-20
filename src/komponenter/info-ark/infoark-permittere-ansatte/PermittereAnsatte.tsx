import React, { useEffect, useState } from 'react';
import BEMHelper from '../../../utils/bem';
import KnappBase from 'nav-frontend-knapper';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';
import {
    skrivTilMalingBesokerSideGaTilSkjema,
    skrivTilMalingVideoBlirSpilt,
} from '../../../utils/amplitudeUtils';
import { SanityBlockTypes } from '../../../sanity-blocks/sanityTypes';
import SanityBlocktype from '../../../sanity-blocks/SanityBlocktype';

interface Props {
    className: string;
    content: SanityBlockTypes[];
}

const PermittereAnsatte = (props: Props) => {
    const cls = BEMHelper(props.className);
    const desktopSize = 480;
    const tabletSize = 380;
    const mobilSize = 280;

    const setSize = () =>
        window.innerWidth > 1024
            ? desktopSize
            : window.innerWidth > 768
            ? tabletSize
            : mobilSize;

    const [videoview, setVideoview] = useState<number>(setSize);

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

    useEffect(() => {
        const handleresize = () => {
            return setVideoview(setSize());
        };

        window.addEventListener('resize', handleresize);
        return () => window.removeEventListener('resize', handleresize);
    }, []);

    return (
        <div className={cls.element('avsnitt')}>
            {props.content.length > 0
                ? props.content.map(
                      (element: SanityBlockTypes, index: number) => {
                          return (
                              <div key={index}>
                                  <Tekstseksjon tittel={element.title}>
                                      <SanityBlocktype content={element} />
                                  </Tekstseksjon>
                                  {leggTilSoknadInngang(index)}
                              </div>
                          );
                      }
                  )
                : null}
            <div className={cls.element('video-frame')}>
                <iframe
                    aria-label="video hvordan for arbeidsgivere rundt permittering"
                    src="https://player.vimeo.com/video/398208025"
                    width={videoview}
                    height="360"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title="Permitteringsvideo for arbeidsgivere"
                    onTimeUpdate={skrivTilMalingVideoBlirSpilt}
                />
            </div>
        </div>
    );
};

export default PermittereAnsatte;
