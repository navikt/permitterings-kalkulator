import React from 'react';
import BEMHelper from '../../../utils/bem';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';
import KanJegPermittere from './tekster/KanJegPermittere';
import KanJegPermittereOmsorgspenger from './tekster/KanJegPermittereOmsorgspenger';
import SkalTilkallingsvikarene from './tekster/SkalTilkallingsvikarene';
import HvordanSkalJegBeregne from './tekster/HvordanSkalJegBeregne';
import HvordanSkalJegVareSikker from './tekster/HvordanSkalJegVareSikker';
import HvorLangErArbeidsgiverperioden from './tekster/HvorLangErArbeidsgiverperioden';
import JegHarAlleredeMattePermittere from './tekster/JegHarAlleredeMattePermittere';

interface Props {
    className: string;
}

const VanligeSporsmal = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('avsnitt')}>
            <Tekstseksjon tittel="Kan jeg permittere ansatte som er sykmeldt?">
                <KanJegPermittere />
            </Tekstseksjon>
            <Tekstseksjon tittel="Kan jeg permittere en ansatt som får omsorgspenger?">
                <KanJegPermittereOmsorgspenger />
            </Tekstseksjon>
            <Tekstseksjon tittel="Skal tilkallingsvikarene ha permitteringsvarsel?">
                <SkalTilkallingsvikarene />
            </Tekstseksjon>
            <Tekstseksjon tittel="Hvordan skal jeg beregne lønnspliktperioden når jeg permitterer gradert?">
                <HvordanSkalJegBeregne />
            </Tekstseksjon>
            <Tekstseksjon tittel="Hvordan kan jeg være sikker på at permitteringen er gyldig, og at de ansatte får sine penger?">
                <HvordanSkalJegVareSikker />
            </Tekstseksjon>
            <HvorLangErArbeidsgiverperioden />
            <Tekstseksjon tittel="Jeg har allerede måttet permittere flere ansatte og stått for regningen selv. Vil jeg få noen av disse pengene tilbake nå som arbeidgsgiverperioden er forkortet?">
                <JegHarAlleredeMattePermittere />
            </Tekstseksjon>
        </div>
    );
};

export default VanligeSporsmal;
