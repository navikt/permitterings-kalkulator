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

interface Props {
    className: string;
}

export const teksjonsnavn = [
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
];
// te
const VanligeSporsmal = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('avsnitt')}>
            <VanligeSporsmalHopplenker hopplenker={teksjonsnavn} />
            {console.log('test', teksjonsnavn[3].id.slice(1))}
            <Tekstseksjon tittel={teksjonsnavn[0].tittel} id={teksjonsnavn[0].id.slice(1)}>
                <KanJegPermittere />
            </Tekstseksjon>
            <Tekstseksjon tittel={teksjonsnavn[1].tittel} id={teksjonsnavn[1].id.slice(1)}>
                <KanJegPermittereOmsorgspenger />
            </Tekstseksjon>
            <Tekstseksjon tittel={teksjonsnavn[2].tittel} id={teksjonsnavn[2].id.slice(1)}>
                <SkalTilkallingsvikarene />
            </Tekstseksjon>
            <Tekstseksjon tittel={teksjonsnavn[3].tittel} id={teksjonsnavn[3].id.slice(1)}>
                <HvordanSkalJegBeregne />
            </Tekstseksjon>
            <Tekstseksjon>
                Skyldes permitteringen brann, ulykker eller naturomstendigheter, er det ingen lønnspliktperiode.
            </Tekstseksjon>
            <Tekstseksjon tittel={teksjonsnavn[4].tittel} id={teksjonsnavn[5].id.slice(1)}>
                <JegHarAlleredeMattePermittere />
            </Tekstseksjon>
            <Tekstseksjon tittel={teksjonsnavn[5].tittel} id={teksjonsnavn[4].id.slice(1)}>
                <HvordanSkalJegVareSikker />
            </Tekstseksjon>
        </div>
    );
};

export default VanligeSporsmal;
