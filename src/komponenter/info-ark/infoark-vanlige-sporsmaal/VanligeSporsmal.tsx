import React from 'react';
import BEMHelper from '../../../utils/bem';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';
import KanJegPermittere from './tekster/KanJegPermittere';
import KanJegPermittereOmsorgspenger from './tekster/KanJegPermittereOmsorgspenger';
import HvordanSkalJegVareSikker from './tekster/HvordanSkalJegVareSikker';
import VanligeSporsmalHopplenker from './VanligeSporsmalHopplenker';
import { tekstseksjonsSporsmal } from './tekstSporsmalOgSvar';
import KanJegPermitterePunkter from './lister/KanJegPermitterePunkter';
import FantDuIkkeSvar from './tekster/FantDuIkkeSvar';
import KanOgsaTilkallingsvikarerPermitteres from './tekster/KanOgsaTilkallingsvikarerPermitteres';

interface Props {
    className: string;
}

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
            <Tekstseksjon
                tittel={tekstseksjonstittel(0)}
                id={tekstseksjonsid(0)}
            >
                <KanJegPermittere />
            </Tekstseksjon>
            <KanJegPermitterePunkter />
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
                <HvordanSkalJegVareSikker />
            </Tekstseksjon>
            <Tekstseksjon
                tittel={tekstseksjonstittel(3)}
                id={tekstseksjonsid(3)}
            >
                <KanOgsaTilkallingsvikarerPermitteres />
            </Tekstseksjon>
            <Tekstseksjon
                tittel={tekstseksjonstittel(4)}
                id={tekstseksjonsid(4)}
            >
                <FantDuIkkeSvar />
            </Tekstseksjon>
        </div>
    );
};

export default VanligeSporsmal;
