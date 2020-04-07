import React from 'react';
import BEMHelper from '../../../utils/bem';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';
import KanJegPermittere from './tekster/KanJegPermittere';
import KanJegPermittereOmsorgspenger from './tekster/KanJegPermittereOmsorgspenger';
import SkalTilkallingsvikarene from './tekster/SkalTilkallingsvikarene';
import HvordanSkalJegBeregne from './tekster/HvordanSkalJegBeregne';
import HvordanSkalJegVareSikker from './tekster/HvordanSkalJegVareSikker';
import JegHarAlleredeMattePermittere from './tekster/JegHarAlleredeMattePermittere';
import VanligeSporsmalHopplenker from './VanligeSporsmalHopplenker';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { tekstseksjonsSporsmal } from './tekstSporsmalOgSvar';
import { skrivTilMalingFantDuIkkeDetDuLetteEtter } from '../../../utils/amplitudeUtils';

interface Props {
    className: string;
}

const tekstseksjonstittel = (radNummer: number): string | undefined => {
    return tekstseksjonsSporsmal[radNummer].tittel;
};

const tekstseksjonsid = (radNummer: number): string | undefined => {
    return tekstseksjonsSporsmal[radNummer].id.slice(1);
};

const brukerFantIkkeSvar = (
    event: React.MouseEvent<MouseEvent | HTMLAnchorElement>,
    url: string
) => {
    event.preventDefault();
    skrivTilMalingFantDuIkkeDetDuLetteEtter();
    window.location.href = url;
};

const VanligeSporsmal = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('avsnitt')}>
            <VanligeSporsmalHopplenker hopplenker={tekstseksjonsSporsmal} />
            <Tekstseksjon
                tittel={tekstseksjonstittel(0)}
                id={tekstseksjonsid(0)}
            >
                <KanJegPermittere />
            </Tekstseksjon>
            <Tekstseksjon
                tittel={tekstseksjonstittel(1)}
                id={tekstseksjonsid(1)}
            >
                <KanJegPermittereOmsorgspenger />
            </Tekstseksjon>
            <Tekstseksjon
                tittel={tekstseksjonstittel(2)}
                id={tekstseksjonsid(2)}
            >
                <SkalTilkallingsvikarene />
            </Tekstseksjon>
            <Tekstseksjon
                tittel={tekstseksjonstittel(3)}
                id={tekstseksjonsid(3)}
            >
                <HvordanSkalJegBeregne />
            </Tekstseksjon>
            <Tekstseksjon>
                Skyldes permitteringen brann, ulykker eller naturomstendigheter,
                er det ingen lønnspliktperiode. Les mer om frister{' '}
                <Lenke href="https://lovdata.no/dokument/NL/lov/2005-06-17-62/KAPITTEL_17#%C2%A715-3">
                    i Arbeidsmiljøloven
                </Lenke>
            </Tekstseksjon>
            <Tekstseksjon
                tittel={tekstseksjonstittel(4)}
                id={tekstseksjonsid(4)}
            >
                <JegHarAlleredeMattePermittere />
            </Tekstseksjon>
            <Tekstseksjon
                tittel={tekstseksjonstittel(5)}
                id={tekstseksjonsid(5)}
            >
                <HvordanSkalJegVareSikker />
            </Tekstseksjon>

            <Undertittel id={tekstseksjonsid(6)}>
                {tekstseksjonstittel(6)}
            </Undertittel>
            <Normaltekst>
                <Lenke
                    href="https://www.nav.no/person/kontakt-oss/chat/arbeidsgiver"
                    onClick={(
                        event: React.MouseEvent<MouseEvent | HTMLAnchorElement>
                    ) =>
                        brukerFantIkkeSvar(
                            event,
                            'https://www.nav.no/person/kontakt-oss/chat/arbeidsgiver'
                        )
                    }
                >
                    Chat med NAV om permittering
                </Lenke>
            </Normaltekst>
        </div>
    );
};

export default VanligeSporsmal;
