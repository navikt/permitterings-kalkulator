import React, { useEffect, useState } from 'react';
import BEMHelper from '../../../utils/bem';
import KnappBase from 'nav-frontend-knapper';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';
import ArbeidsgiversMeldeplikt from './tekster/ArbeidsgiversMeldeplikt';
import Sendpermitteringsvarsel from './tekster/Sendpermitteringsvarsel';
import VarselSkalInneholde from './lister/VarselSkalInneholde';
import DersomVarselInneholder from './tekster/DersomVarselInneholder';
import GiAnsatteBeskjed from './lister/GiAnsatteBeskjed';
import ItilleggBerVi from './lister/ItilleggBerVi';
import HuskArapportere from './tekster/HuskArapportere';
import InfoLenker from './tekster/InfoLenker';
import { gaTilSkjema, videoBlirSpilt } from '../../../utils/amplitudeUtils';

interface Props {
    className: string;
}

const InfoarkPermittereAnsatte = (props: Props) => {
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
        gaTilSkjema();
        window.location.href =
            'https://www.nav.no/soknader/nb/bedrift/permitteringer-oppsigelser-og-konkurs/masseoppsigelser';
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
            <Tekstseksjon tittel="1. Meld fra til NAV">
                <ArbeidsgiversMeldeplikt />
            </Tekstseksjon>
            <div className={cls.element('knapp-seksjon')}>
                <KnappBase onClick={() => gatilSoknad()}>Meld ifra</KnappBase>
            </div>
            <Tekstseksjon tittel="2. Send permitteringsvarsel">
                <Sendpermitteringsvarsel />
            </Tekstseksjon>
            <InfoLenker />
            <VarselSkalInneholde />
            <ItilleggBerVi />
            <DersomVarselInneholder />
            <GiAnsatteBeskjed />
            <HuskArapportere />
            <div className={cls.element('video-frame')}>
                <iframe
                    src="https://player.vimeo.com/video/398208025"
                    width={videoview}
                    height="360"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title="Permitteringsvideo for arbeidsgivere"
                    onTimeUpdate={videoBlirSpilt}
                />
            </div>
        </div>
    );
};

export default InfoarkPermittereAnsatte;
