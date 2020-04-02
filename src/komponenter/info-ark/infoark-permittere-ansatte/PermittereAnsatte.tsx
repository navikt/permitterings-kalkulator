import React from 'react';
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

interface Props {
    className: string;
}

const InfoarkPermittereAnsatte = (props: Props) => {
    const cls = BEMHelper(props.className);

    const gatilSoknad = () => {
        window.location.href =
            'https://www.nav.no/soknader/nb/bedrift/permitteringer-oppsigelser-og-konkurs/masseoppsigelser';
    };

    return (
        <div className={cls.element('avsnitt')}>
            <Tekstseksjon tittel="1.Arbeidsgivers meldeplikt til NAV">
                <ArbeidsgiversMeldeplikt />
            </Tekstseksjon>
            <div className={cls.element('knapp-seksjon')}>
                <KnappBase onClick={() => gatilSoknad()}>Meld ifra</KnappBase>
            </div>
            <Tekstseksjon tittel="2.Send permitteringsvarsel til dine ansatte.">
                <Sendpermitteringsvarsel />
            </Tekstseksjon>
            <VarselSkalInneholde />
            <ItilleggBerVi />
            <DersomVarselInneholder />
            <GiAnsatteBeskjed />
            <HuskArapportere />
        </div>
    );
};

export default InfoarkPermittereAnsatte;
