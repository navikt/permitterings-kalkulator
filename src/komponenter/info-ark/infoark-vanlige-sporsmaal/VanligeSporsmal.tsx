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
import { Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

interface Props {
    className: string;
}

export const tekstseksjonsSporsmal = [
    {
        tittel: 'Kan jeg permittere ansatte som er sykmeldt?',
        id: '#kanJegPermittere',
    },
    {
        tittel: 'Kan jeg permittere en ansatt som får omsorgspenger?',
        id: '#kanJegPermittereOmsorgspenger',
    },
    {
        tittel: 'Skal tilkallingsvikarene ha permitteringsvarsel?',
        id: '#skalTilkallingsvikarene',
    },
    {
        tittel: 'Hvor lenge skal jeg betale lønn?',
        id: '#hvordanSkalJegBeregne',
    },

    {
        tittel: 'Jeg har allerede betalt lønn i mer enn to dager, får jeg disse pengene tilbake?',
        id: '#jegHarAllerede',
    },
    {
        tittel: 'Hvordan kan jeg være sikker på at permitteringen er gyldig, og at de ansatte får pengene sine?',
        id: '#hvordanKanJegVare',
    },
    {
        tittel: 'Fant du ikke det du lette etter?',
        id: '#fantDuIkke',
    },
];

const tekstseksjonstittel = (radNummer: number): string | undefined => {
    return tekstseksjonsSporsmal[radNummer].tittel;
};

const tekstseksjonsid = (radNummer: number): string | undefined => {
    return tekstseksjonsSporsmal[radNummer].id.slice(1);
};

const VanligeSporsmal = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('avsnitt')}>
            <VanligeSporsmalHopplenker hopplenker={tekstseksjonsSporsmal} />
            <Tekstseksjon tittel={tekstseksjonstittel(0)} id={tekstseksjonsid(0)}>
                <KanJegPermittere />
            </Tekstseksjon>
            <Tekstseksjon tittel={tekstseksjonstittel(1)} id={tekstseksjonsid(1)}>
                <KanJegPermittereOmsorgspenger />
            </Tekstseksjon>
            <Tekstseksjon tittel={tekstseksjonstittel(2)} id={tekstseksjonsid(2)}>
                <SkalTilkallingsvikarene />
            </Tekstseksjon>
            <Tekstseksjon tittel={tekstseksjonstittel(3)} id={tekstseksjonsid(3)}>
                <HvordanSkalJegBeregne />
            </Tekstseksjon>
            <Tekstseksjon>
                Skyldes permitteringen brann, ulykker eller naturomstendigheter, er det ingen lønnspliktperiode. Les mer
                om frister{' '}
                <Lenke href="https://lovdata.no/dokument/NL/lov/2005-06-17-62/KAPITTEL_17#%C2%A715-3">
                    i Arbeidsmiljøloven
                </Lenke>
            </Tekstseksjon>
            <Tekstseksjon tittel={tekstseksjonstittel(4)} id={tekstseksjonsid(4)}>
                <JegHarAlleredeMattePermittere />
            </Tekstseksjon>
            <Tekstseksjon tittel={tekstseksjonstittel(5)} id={tekstseksjonsid(5)}>
                <HvordanSkalJegVareSikker />
            </Tekstseksjon>
            <Normaltekst id={tekstseksjonsid(6)}>
                {tekstseksjonstittel(6)}
                <br />
                <Lenke href="https://www.nav.no/person/kontakt-oss/chat/arbeidsgiver">
                    Chat med NAV om permittering
                </Lenke>
            </Normaltekst>
        </div>
    );
};

export default VanligeSporsmal;
